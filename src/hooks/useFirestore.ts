import { useCallback } from 'react';

import { firestore, firebaseApp } from "../Firebase";
import {daysGenerator} from "../components/Helpers";
import {
  CentreDeDistribution,
  CreateDemandeAdhesion,
  DemandeAdhesion,
  DemandeAdhesionWithUserInfo
} from "../modules/Distribution/types";
import { IPlanning } from '../modules/Planning/types';
import { User, Member, MemberWithUserInfo, CreateUser } from "../modules/User/types";

function useFirestore() {

  const getUserDemandeAdhesion = useCallback(async (centreUid: string, userUid:string) : Promise<DemandeAdhesion | null> => {

    const adhesionRef = await firestore.collection("demandeAdhesion").where("centre", "==", centreUid).where("utilisateur", "==", userUid).get();

    if(!adhesionRef.empty) {
      return {...adhesionRef.docs[0].data(), uid: adhesionRef.docs[0].id} as DemandeAdhesion
    }

    return null;

  }, []);

  const getCentreDemandeAdhesionWithUserInfoList = useCallback(async (centreUid:string) : Promise<DemandeAdhesionWithUserInfo[]> => {

    let demandeAdhesionList: DemandeAdhesion[] = [];
    let demandeAdhesionWithUserInfoList: DemandeAdhesionWithUserInfo[] = [];
      

    const demandeAdhesionListRef = await firestore.collection("demandeAdhesion").where("centre", "==", centreUid).get();
    
    demandeAdhesionList = demandeAdhesionListRef.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as DemandeAdhesion;
    });

    if(demandeAdhesionList.length > 0) {

      const listUserIds = demandeAdhesionList.map(adhesion => {return adhesion.utilisateur});

      let i,j,temparray,chunk = 10;
      for (i=0,j=listUserIds.length; i<j; i+=chunk) {
        
        temparray = listUserIds.slice(i,i+chunk);

        // retrieve users details of demande Adhesion
        const demandeAdhesionUserDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

        demandeAdhesionUserDetailsRef.docs.forEach((doc) => {

          const selectedUserDemandeAdhesion = demandeAdhesionList.find((demandeAdhesin) => { return (demandeAdhesin.utilisateur === doc.id)});

          if (selectedUserDemandeAdhesion) {
            demandeAdhesionWithUserInfoList.push({
              ...doc.data(),
              uid: doc.id,
              demandeAdhesionUid: selectedUserDemandeAdhesion.uid,
              demandeAdhesionCentre: selectedUserDemandeAdhesion.centre
            } as DemandeAdhesionWithUserInfo);
          }
        })

      }

    }

    return demandeAdhesionWithUserInfoList;

  }, []);

  const getCentreMembreList = useCallback(async (centreUid:string): Promise<MemberWithUserInfo[]> => {
    let membreList: Member[] = [];
    let membreDetailsList: MemberWithUserInfo[] = [];

    // retrieve membres id and type
    const membresRef = await firestore.collection("centres").doc(centreUid).collection("membres").get();

    membreList = membresRef.docs.map((doc) => {
      return ({...doc.data(), uid: doc.id} as Member);
    });

    // retrieve membre details
    if(membreList.length > 0) {
      const membreListIds = membreList.map((membre) => {return membre.utilisateur});

      let i,j,temparray,chunk = 10;
      for (i=0,j=membreListIds.length; i<j; i+=chunk) {
        
        temparray = membreListIds.slice(i,i+chunk);

        const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();
    
        membreDetailsRef.forEach((doc) => {

          const selectedUserMembre = membreList.find((membre) => { return (membre.utilisateur === doc.id)});


          membreDetailsList.push({
            ...doc.data() as User,
            uid: doc.id,
            memberUid: selectedUserMembre?.uid,
            type: selectedUserMembre?.type
          } as MemberWithUserInfo);

        });
      }
    }

    return membreDetailsList;
  }, []);

  const getUserCentreList = useCallback(async (userUid:string): Promise<CentreDeDistribution[]> => {
    let userCentres: CentreDeDistribution[] = [];

    const membresRef = await firestore.collectionGroup("membres").where("utilisateur", "==", userUid).get();

    const centreIds = membresRef.docs.map((membreRef) => {
      return membreRef.ref.parent.parent?.id || ''
    });

    if(centreIds.length>0) {
      const centresRef = await firestore.collection("centres").where(firebaseApp.firestore.FieldPath.documentId(), "in", centreIds).get();

      userCentres = centresRef.docs.map((centre) => {
        return {...centre.data(), uid: centre.id} as CentreDeDistribution
      });
    }

    return userCentres;
  }, [])

  const getCentrePlanning = useCallback(async (centre:CentreDeDistribution) : Promise<IPlanning[]> => {

    const today = (new Date()).toISOString().split("T")[0];
    let planningRef = await firestore.collection("centres")
      .doc(centre.uid)
      .collection("distributions")
      .where("date", ">=", today)
      .orderBy("date")
      .limit(5)
      .get();

    let planningList: IPlanning[] = [];
    planningList = planningRef.docs.map((doc)  => {
      return { ...doc.data(), uid: doc.id } as IPlanning;
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
        return { ...doc.data(), uid: doc.id } as IPlanning;
      });
    }

    return planningList;

  }, []);

  const getCentreList = useCallback(async () : Promise<CentreDeDistribution[]> => {

    const centresRef = await firestore.collection("centres").get();

    return centresRef.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as CentreDeDistribution;
    });

  }, []);

  const updateCentre = useCallback(async (centre : CentreDeDistribution): Promise<CentreDeDistribution> => {

    await firestore.collection("centres").doc(centre.uid).update(centre);

    let centreRef  = await firestore.collection("centres").doc(centre.uid).get();

    return {...centreRef.data(), uid: centreRef.id} as CentreDeDistribution;

  }, []);

  const createDemandeAdhesion = useCallback(async(demandeAdhesion: CreateDemandeAdhesion) : Promise<DemandeAdhesion> => {
    

    let demandeAdhesionRef = await firestore.collection('demandeAdhesion').add(demandeAdhesion);

    return {...demandeAdhesion,  uid: demandeAdhesionRef.id};

  }, []);

  const createUtilisateur = useCallback(async (uid: string, user: CreateUser) : Promise<User> => {

    await firestore.collection('utilisateurs').doc(uid).set(user);

    return {...user, uid: uid};

  }, []);

  const updatePlanningParticipant = useCallback(async (centreUid : string, userUid : string, distributionUid : string, participants : string[] = []) : Promise<IPlanning> => {

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

    return {...distributionRef.data(), uid: distributionRef.id} as IPlanning

  }, []);

  const deleteDemandeAdhesion = useCallback(async (demandeAdhesionUid : string): Promise<void> => {

    await firestore.collection("demandeAdhesion").doc(demandeAdhesionUid).delete();

  }, [])

  return {
    getUserDemandeAdhesion, 
    getCentreDemandeAdhesionWithUserInfoList, 
    getCentreMembreList,
    getUserCentreList,
    getCentrePlanning,
    getCentreList,
    updateCentre,
    createDemandeAdhesion,
    createUtilisateur,
    updatePlanningParticipant,
    deleteDemandeAdhesion
  };
}




export default useFirestore;