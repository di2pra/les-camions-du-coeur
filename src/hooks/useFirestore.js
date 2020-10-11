import { useCallback } from 'react';
import { firestore, firebaseApp } from "../Firebase";
import {daysGenerator, delay} from "./../components/Helpers";

function useFirestore() {

  const getUserAdhesionDetails = useCallback(async (centreUid, userUid) => {

    const adhesionRef = await firestore.collection("demandeAdhesion").where("centre", "==", centreUid).where("utilisateur", "==", userUid).get();

    if(!adhesionRef.empty) {
      return {...adhesionRef.docs[0].data(), uid: adhesionRef.docs[0].id}
    }

    return null;

  }, []);

  const getCentreDemandeAdhesionList = useCallback(async (centreUid) => {

    let demandeAdhesionList = [];
    let demandeAdhesionDetailsList = [];
      

    const demandeAdhesionListRef = await firestore.collection("demandeAdhesion").where("centre", "==", centreUid).get();
    
    demandeAdhesionList = demandeAdhesionListRef.docs.map((doc) => {
      return ({...doc.data(), uid: doc.id});
    });

    if(demandeAdhesionList.length > 0) {

      let listUserIds = demandeAdhesionList.map(adhesion => {return adhesion.utilisateur});

      let i,j,temparray,chunk = 10;
      for (i=0,j=listUserIds.length; i<j; i+=chunk) {
        
        temparray = listUserIds.slice(i,i+chunk);

        // retrieve users details of demande Adhesion
        let demandeAdhesionuDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

        demandeAdhesionuDetailsRef.docs.forEach((doc) => {

          let selectedUserDemandeAdhesion = demandeAdhesionList.find((demandeAdhesin) => { return (demandeAdhesin.utilisateur === doc.id)});

          demandeAdhesionDetailsList.push({...doc.data(), utilisateurUid: doc.id, uid: selectedUserDemandeAdhesion.uid})
        })

      }

    }

    return demandeAdhesionDetailsList;

  }, []);

  const getCentreMembreList = useCallback(async (centreUid) => {

    let membreList = [];
    let membreDetailsList = [];

    // retrieve membres id and type
    const membresRef = await firestore.collection("centres").doc(centreUid).collection("membres").get();

    membreList = membresRef.docs.map((doc) => {
      return ({...doc.data()});
    });


    // retrieve membre details

    if(membreList.length > 0) {

      let membreListIds = membreList.map((membre) => {return membre.utilisateur});

      let i,j,temparray,chunk = 10;
      for (i=0,j=membreListIds.length; i<j; i+=chunk) {
        
        temparray = membreListIds.slice(i,i+chunk);

        const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();
    
        membreDetailsRef.forEach((doc) => {

          let membreType = membreList.find((membre) => {return membre.utilisateur === doc.id});

          membreDetailsList.push({
            ...doc.data(), 
            uid: doc.id,
            type: membreType.type
          })

        });
        

      }
    }

    return membreDetailsList;

  }, []);

  const getUserCentreList = useCallback(async (userUid) => {

    let userCentres = [];

    const membresRef = await firestore.collectionGroup("membres").where("utilisateur", "==", userUid).get();

    let centreIds = membresRef.docs.map((membreRef) => {
      return membreRef.ref.parent.parent.id
    });


    if(centreIds.length>0) {

      const centresRef = await firestore.collection("centres").where(firebaseApp.firestore.FieldPath.documentId(), "in", centreIds).get();

      userCentres = centresRef.docs.map((centre) => {
        return {...centre.data(), uid: centre.id}
      });

    }

    return userCentres;


  }, [])

  const getCentrePlanning = useCallback(async (centre) => {


    let planningList = [];
    const today = (new Date()).toISOString().split("T")[0];
    let planningRef = await firestore.collection("centres").doc(centre.uid).collection("distributions").where("date", ">=", today).orderBy("date").limit(5).get();


    planningList = planningRef.docs.map((doc)  => {
      return {...doc.data(), uid: doc.id}
    });

    if(planningRef.size < 5) {

      let days = daysGenerator(centre.jour);

      for(var i =0; i< planningList.length; i++ ) {
        for(var j= 0; j< days.length;j++) {
          if (days[j] === planningList[i].date) {
            days.splice(j,1);
            break;
          }
        }
      }

      let distributionToCreate = days.map((value) => {
        return {
          date: value,
          participants: []
        }
      });

      

      // Get a new write batch
      var batch = firestore.batch();

      distributionToCreate.forEach((dist) => {
        var docToCreate = firestore.collection("centres").doc(centre.uid).collection("distributions").doc();
        batch.set(docToCreate, dist)
      })


      // Commit the batch
      await batch.commit();

      let planningRef = await firestore.collection("centres").doc(centre.uid).collection("distributions").where("date", ">=", today).orderBy("date").limit(5).get();

      planningList = planningRef.docs.map((doc)  => {
        return {...doc.data(), uid: doc.id}
      });

    }

    return planningList;


  }, []);

  const getCentreList = useCallback(async () => {

    const centresRef = await firestore.collection("centres").get();

    return centresRef.docs.map((doc) => {
      return ({...doc.data(), uid: doc.id});
    });

  }, []);

  const updateCentre = useCallback(async (centre) => {

    await firestore.collection("centres").doc(centre.uid).update(centre);

    let centreRef = await firestore.collection("centres").doc(centre.uid).get();

    return {...centreRef.data(), uid: centreRef.id};

  }, []);

  const createDemandeAdhesion = useCallback(async(demandeAdhesion) => {
    

    let demandeAdhesionRef = await firestore.collection('demandeAdhesion').add({
      centre: demandeAdhesion.centre,
      utilisateur: demandeAdhesion.utilisateur
    });

    return {...demandeAdhesion,  uid: demandeAdhesionRef.id};

  }, []);

  const createUtilisateur = useCallback(async (uid, utilisateur) => {

    await firestore.collection('utilisateurs').doc(uid).set(utilisateur);

    return {...utilisateur, uid: uid};

  }, []);

  const updateDistributionParticipant = useCallback(async (centreUid, userUid, distributionUid, participants = []) => {


    // if the user is already registered, then remove him
    if(((participants).includes(userUid))) {
      await firestore.collection("centres").doc(centreUid).collection("distributions").doc(distributionUid).update({
        participants: firebaseApp.firestore.FieldValue.arrayRemove(userUid)
      });

    // else add him
    } else {
      await firestore.collection("centres").doc(centreUid).collection("distributions").doc(distributionUid).update({
        participants: firebaseApp.firestore.FieldValue.arrayUnion(userUid)
      });
    }
    
    const distributionRef = await firestore.collection("centres").doc(centreUid).collection("distributions").doc(distributionUid).get();

    return {...distributionRef.data(), uid: distributionRef.id}

  }, []);

  const deleteDemandeAdhesion = useCallback(async (demandeAdhesionUid) => {

    await firestore.collection("demandeAdhesion").doc(demandeAdhesionUid).delete();

  }, [])

  return {
    getUserAdhesionDetails, 
    getCentreDemandeAdhesionList, 
    getCentreMembreList,
    getUserCentreList,
    getCentrePlanning,
    getCentreList,
    updateCentre,
    createDemandeAdhesion,
    createUtilisateur,
    updateDistributionParticipant,
    deleteDemandeAdhesion
  };
}




export default useFirestore;