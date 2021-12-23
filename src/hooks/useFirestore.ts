import { useCallback } from 'react';
import { firestore, firebaseApp } from "../Firebase";
import { daysGenerator } from "../components/Helpers";
import { CentreDeDistribution } from "../modules/Distribution/types";
import { IPlanning } from '../modules/Planning/types';
import { User, MemberWithUserInfo, CreateUser } from "../modules/User/types";

function useFirestore() {

  const getCentreDemandeAdhesionWithUserInfoList = useCallback(async (postulants: [string]): Promise<User[]> => {

    let postulantDetailsList: User[] = [];

    // retrieve membre details
    if (postulants.length > 0) {

      let i, j, temparray, chunk = 10;
      for (i = 0, j = postulants.length; i < j; i += chunk) {

        temparray = postulants.slice(i, i + chunk);

        const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

        membreDetailsRef.forEach((doc) => {

          postulantDetailsList.push({
            ...doc.data() as User,
            uid: doc.id
          } as User);

        });
      }
    }

    return postulantDetailsList;


  }, []);

  const getCentreMembreList = useCallback(async (participants: string[], responsables: string[]): Promise<MemberWithUserInfo[]> => {

    let membreDetailsList: MemberWithUserInfo[] = [];

    // retrieve membre details
    if (participants.length > 0) {

      let i, j, temparray, chunk = 10;
      for (i = 0, j = participants.length; i < j; i += chunk) {

        temparray = participants.slice(i, i + chunk);

        const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

        membreDetailsRef.forEach((doc) => {

          membreDetailsList.push({
            ...doc.data() as User,
            uid: doc.id,
            responsable: responsables.includes(doc.id)
          } as MemberWithUserInfo);

        });
      }
    }

    return membreDetailsList;
  }, []);

  const getUserCentreList = useCallback(async (userUid: string): Promise<CentreDeDistribution[]> => {
    let userCentres: CentreDeDistribution[] = [];

    const centresRef = await firestore.collection("centres").where("participants", "array-contains", userUid).get();

    userCentres = centresRef.docs.map((centre) => {
      return { ...centre.data(), uid: centre.id } as CentreDeDistribution
    });

    return userCentres;
  }, [])

  const getCentrePlanning = useCallback(async (centre: CentreDeDistribution): Promise<IPlanning[]> => {

    const nbrJour = 20;

    const today = (new Date()).toISOString().split("T")[0];
    let planningRef = await firestore.collection("plannings")
      .where("date", ">=", today)
      .where("centre", "==", centre.uid)
      .orderBy("date")
      .limit(nbrJour)
      .get();

    let planningList: IPlanning[] = [];
    planningList = planningRef.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as IPlanning;
    });

    if (planningRef.size < nbrJour) {
      let days = daysGenerator(centre.jour, nbrJour);

      console.log(days);

      for (var i = 0; i < planningList.length; i++) {
        for (var j = 0; j < days.length; j++) {
          if (days[j] === planningList[i].date) {
            days.splice(j, 1);
            break;
          }
        }
      }

      let distributionToCreate = days.map((value) => {
        return {
          centre: centre.uid,
          date: value,
          participants: []
        }
      });

      // Get a new write batch
      var batch = firestore.batch();

      distributionToCreate.forEach((dist) => {
        var docToCreate = firestore.collection("plannings").doc();
        batch.set(docToCreate, dist)
      })

      // Commit the batch
      await batch.commit();

      let planningRef = await firestore.collection("plannings").where("date", ">=", today).where("centre", "==", centre.uid).orderBy("date").limit(nbrJour).get();

      planningList = planningRef.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as IPlanning;
      });
    }

    return planningList;

  }, []);

  const getCentreList = useCallback(async (): Promise<CentreDeDistribution[]> => {

    const centresRef = await firestore.collection("centres").get();

    return centresRef.docs.map((doc) => {
      return { ...doc.data(), uid: doc.id } as CentreDeDistribution;
    });

  }, []);

  const updateCentreInformation = useCallback(async (centreUid: string, informations: string): Promise<CentreDeDistribution> => {

    await firestore.collection("centres").doc(centreUid).update({
      informations: informations
    });

    let centreRef = await firestore.collection("centres").doc(centreUid).get();

    return { ...centreRef.data(), uid: centreRef.id } as CentreDeDistribution;

  }, []);

  const addDemandeAdhesion = useCallback(async (userUid: string, centreUid: string): Promise<CentreDeDistribution> => {

    await firestore.collection("centres").doc(centreUid).update(
      {
        postulants: firebaseApp.firestore.FieldValue.arrayUnion(userUid)
      }
    );

    const centreDoc = await firestore.collection("centres").doc(centreUid).get();

    return { ...centreDoc.data(), uid: centreDoc.id } as CentreDeDistribution;

  }, []);

  const createUtilisateur = useCallback(async (uid: string, user: CreateUser): Promise<User> => {

    await firestore.collection('utilisateurs').doc(uid).set(user);

    return { ...user, preferences: ['PLAT_CHAUD', 'SOUPE', 'CAFE', 'PASSE_PLAT', 'ACCOMPAGNEMENT'], uid: uid };

  }, []);

  const updatePlanningParticipant = useCallback(async (userUid: string, planningUid: string, participants: string[] = []): Promise<IPlanning> => {

    // if the user is already registered, then remove him
    if (((participants).includes(userUid))) {

      await firestore.collection("plannings").doc(planningUid).update({
        participants: firebaseApp.firestore.FieldValue.arrayRemove(userUid)
      });

      // else add him
    } else {

      await firestore.collection("plannings").doc(planningUid).update({
        participants: firebaseApp.firestore.FieldValue.arrayUnion(userUid)
      });

    }

    const planningRef = await firestore.collection("plannings").doc(planningUid).get();

    return { ...planningRef.data(), uid: planningRef.id } as IPlanning

  }, []);

  const deleteDemandeAdhesion = useCallback(async (userUid: string, centreUid: string): Promise<CentreDeDistribution> => {

    await firestore.collection("centres").doc(centreUid).update(
      {
        postulants: firebaseApp.firestore.FieldValue.arrayRemove(userUid)
      }
    );

    const centreDoc = await firestore.collection("centres").doc(centreUid).get();

    return { ...centreDoc.data(), uid: centreDoc.id } as CentreDeDistribution;

  }, []);

  const addUserToCentre = useCallback(async (userUid: string, centreUid: string): Promise<CentreDeDistribution> => {


    await firestore.collection("centres").doc(centreUid).update(
      {
        participants: firebaseApp.firestore.FieldValue.arrayUnion(userUid),
        postulants: firebaseApp.firestore.FieldValue.arrayRemove(userUid)
      }
    );

    const centreDoc = await firestore.collection("centres").doc(centreUid).get();

    return { ...centreDoc.data(), uid: centreDoc.id } as CentreDeDistribution;


  }, []);

  const getUserById = useCallback(async (userUid: string): Promise<User> => {

    const userRef = await firestore.collection('utilisateurs').doc(userUid).get();

    return {
      ...userRef.data(),
      uid: userRef.id
    } as User

  }, [])

  return {
    getCentreDemandeAdhesionWithUserInfoList,
    getCentreMembreList,
    getUserCentreList,
    getCentrePlanning,
    getCentreList,
    updateCentreInformation,
    addDemandeAdhesion,
    createUtilisateur,
    updatePlanningParticipant,
    deleteDemandeAdhesion,
    addUserToCentre,
    getUserById
  };
}




export default useFirestore;