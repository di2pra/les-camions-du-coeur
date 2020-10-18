import { useCallback } from 'react';

import { firestore, firebaseApp } from "../Firebase";
import {daysGenerator} from "../components/Helpers";
import {
  CentreDeDistribution,
  IDemandeAdhesion,
  DemandeAdhesionDetail,
} from "../modules/Distribution/types";
import { Member, MemberDetails, UserCentre } from "../modules/Membership/types";
import { Planning } from '../modules/Planning/types';

function useFirestore() {

  const getUserAdhesionDetails = useCallback(async (centreUid, userUid) => {

    const adhesionRef = await firestore.collection("demandeAdhesion").where("centre", "==", centreUid).where("utilisateur", "==", userUid).get();

    if(!adhesionRef.empty) {
      return { ...adhesionRef.docs[0].data(), uid: adhesionRef.docs[0].id } as DemandeAdhesionDetail;
    }

    return null;

  }, []);

  const getCentreDemandeAdhesionList = useCallback(async (centreUid) => {

    let demandeAdhesionList: IDemandeAdhesion[] = [];
    const demandeAdhesionDetailsList: DemandeAdhesionDetail[] = [];


    const demandeAdhesionListRef = await firestore.collection("demandeAdhesion").where("centre", "==", centreUid).get();

    demandeAdhesionList = demandeAdhesionListRef.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as IDemandeAdhesion;
    });

    if(demandeAdhesionList.length > 0) {

      const listUserIds = demandeAdhesionList.map(adhesion => {return adhesion.utilisateur;});

      let i,j,temparray;
      const chunk = 10;
      for (i=0,j=listUserIds.length; i<j; i+=chunk) {

        temparray = listUserIds.slice(i,i+chunk);

        // retrieve users details of demande Adhesion
        const demandeAdhesionuDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

        demandeAdhesionuDetailsRef.docs.forEach((doc) => {

          const selectedUserDemandeAdhesion = demandeAdhesionList.find(
            (demandeAdhesin) => demandeAdhesin.utilisateur === doc.id
          );

          if (selectedUserDemandeAdhesion) {
            demandeAdhesionDetailsList.push({
              ...doc.data(),
              utilisateurUid: doc.id,
              uid: selectedUserDemandeAdhesion.uid,
            } as DemandeAdhesionDetail);
          }
        });

      }

    }

    return demandeAdhesionDetailsList;

  }, []);

  const getCentreMembreList = useCallback(async (centreUid) => {
    let membreList: Member[] = [];
    const membreDetailsList: MemberDetails[] = [];

    // retrieve membres id and type
    const membresRef = await firestore.collection("centres").doc(centreUid).collection("membres").get();

    membreList = membresRef.docs.map((doc) => {
      return ({...doc.data()} as Member);
    });

    // retrieve membre details
    if(membreList.length > 0) {
      const membreListIds = membreList.map((membre) => {return membre.utilisateur;});

      let i,j,temparray;
      const chunk = 10;
      for (i=0,j=membreListIds.length; i<j; i+=chunk) {

        temparray = membreListIds.slice(i,i+chunk);

        const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

        membreDetailsRef.forEach((doc) => {
          const membreType = membreList.find((membre) => {
            return membre.utilisateur === doc.id;
          });

          if (membreType) {
            membreDetailsList.push({
              ...doc.data(),
              uid: doc.id,
              type: membreType.type,
            } as MemberDetails);
          }
        });
      }
    }

    return membreDetailsList;
  }, []);

  const getUserCentreList = useCallback(async (userUid) => {
    let userCentres: UserCentre[] = [];

    const membresRef = await firestore.collectionGroup("membres").where("utilisateur", "==", userUid).get();

    const centreIds = membresRef.docs.map((membreRef) => {
      return membreRef.ref.parent.parent?.id || '';
    });

    if(centreIds.length>0) {
      const centresRef = await firestore.collection("centres").where(firebaseApp.firestore.FieldPath.documentId(), "in", centreIds).get();

      userCentres = centresRef.docs.map((centre) => {
        return {...centre.data(), uid: centre.id};
      });
    }

    return userCentres;
  }, []);

  const getCentrePlanning = useCallback(async (centre) => {
    const today = (new Date()).toISOString().split("T")[0];
    const planningRef = await firestore.collection("centres")
      .doc(centre.uid)
      .collection("distributions")
      .where("date", ">=", today)
      .orderBy("date")
      .limit(5)
      .get();

    let planningList: Planning[] = [];
    planningList = planningRef.docs.map((doc)  => {
      return { ...doc.data(), uid: doc.id } as Planning;
    });

    if(planningRef.size < 5) {
      const days = daysGenerator(centre.jour);

      for(let i =0; i< planningList.length; i++ ) {
        for(let j= 0; j< days.length;j++) {
          if (days[j] === planningList[i].date) {
            days.splice(j,1);
            break;
          }
        }
      }

      const distributionToCreate = days.map((value) => {
        return {
          date: value,
          participants: []
        };
      });

      // Get a new write batch
      const batch = firestore.batch();

      distributionToCreate.forEach((dist) => {
        const docToCreate = firestore.collection("centres").doc(centre.uid).collection("distributions").doc();
        batch.set(docToCreate, dist);
      });

      // Commit the batch
      await batch.commit();

      const planningRef = await firestore.collection("centres").doc(centre.uid).collection("distributions").where("date", ">=", today).orderBy("date").limit(5).get();

      planningList = planningRef.docs.map((doc)  => {
        return { ...doc.data(), uid: doc.id } as Planning;
      });
    }

    return planningList;
  }, []);

  const getCentreList = useCallback(async () => {

    const centresRef = await firestore.collection("centres").get();

    return centresRef.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as CentreDeDistribution;
    });

  }, []);

  const updateCentre = useCallback(async (centre) => {

    await firestore.collection("centres").doc(centre.uid).update(centre);

    const centreRef = await firestore.collection("centres").doc(centre.uid).get();

    return { ...centreRef.data(), uid: centreRef.id } as CentreDeDistribution;

  }, []);

  const createDemandeAdhesion = useCallback(async(demandeAdhesion) => {


    const demandeAdhesionRef = await firestore.collection('demandeAdhesion').add({
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

    return {...distributionRef.data(), uid: distributionRef.id};

  }, []);

  const deleteDemandeAdhesion = useCallback(async (demandeAdhesionUid) => {

    await firestore.collection("demandeAdhesion").doc(demandeAdhesionUid).delete();

  }, []);

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