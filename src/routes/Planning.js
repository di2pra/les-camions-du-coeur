import React, { useEffect, useState, useCallback, useContext } from 'react';
import PlanningCard from '../components/PlanningCard';
import { UserContext } from "../providers/UserProvider";
import { firestore, firebaseApp } from "../Firebase";
import PageLoading from '../components/PageLoading';
import {daysGenerator, capitalize} from '../components/Helpers';
import { useHistory, useParams } from "react-router-dom";
import AlertBox from '../components/AlertBox';


function Planning() {

  let { nom, jour } = useParams();
  const history = useHistory();

  const {connectedUser} = useContext(UserContext);

  const [error, setError] = useState(null);
  const [userCentreList, setUserCentreList] = useState({isProcessing: null, data: []});

  const [selectedCentreIndex, setSelectedCentreIndex] = useState(null);
  const [selectedCentreDataIsLoading, setSelectedCentreDataIsLoading] = useState(null);
  const [selectedCentreMemberList, setSelectedCentreMemberList] = useState([]);
  const [selectedCentrePlanningList, setSelectedCentrePlanningList] = useState([]);



  const loadUserCentreList = useCallback(async () => {

    let userCentres = [];

    const membresRef = await firestore.collectionGroup("membres").where("utilisateur", "==", connectedUser.uid).get();

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


  }, [connectedUser.uid])

  const loadSelectedCentreMembers = useCallback(async (selectedCentreIndex) => {


    let membreList = [], membreListDetails = [];
    // retrieve membre id and type
    const membresRef = await firestore.collection("centres").doc(userCentreList.data[selectedCentreIndex].uid).collection("membres").get();

    membreList = membresRef.docs.map((doc) => {
      return ({...doc.data()});
    });


    if(membreList.length > 0) {

      let listUserIds = membreList.map((membre) => {return membre.utilisateur})
      let i,j,temparray,chunk = 10;

      for (i=0,j=listUserIds.length; i<j; i+=chunk) {
        
        temparray = listUserIds.slice(i,i+chunk);

        const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();
    
        membreDetailsRef.forEach((doc) => {

          let membreType = membreList.find((membre) => {return membre.utilisateur === doc.id});

          membreListDetails.push({
            ...doc.data(), 
            uid: doc.id,
            type: membreType.type
          })

        });

      }

    }
      

    return membreListDetails;
    

  }, [userCentreList.data])

  const loadSelectedCentrePlanning = useCallback(async (selectedCentreIndex) => {


    let planningList = [];
    const today = (new Date()).toISOString().split("T")[0];
    let planningRef = await firestore.collection("centres").doc(userCentreList.data[selectedCentreIndex].uid).collection("distributions").where("date", ">=", today).orderBy("date").limit(5).get();


    planningList = planningRef.docs.map((doc)  => {
      return {...doc.data(), uid: doc.id}
    });

    if(planningRef.size < 5) {

      let days = daysGenerator(userCentreList.data[selectedCentreIndex].jour);

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
        var docToCreate = firestore.collection("centres").doc(userCentreList.data[selectedCentreIndex].uid).collection("distributions").doc();
        batch.set(docToCreate, dist)
      })


      // Commit the batch
      await batch.commit();

      let planningRef = await firestore.collection("centres").doc(userCentreList.data[selectedCentreIndex].uid).collection("distributions").where("date", ">=", today).orderBy("date").limit(5).get();

      planningList = planningRef.docs.map((doc)  => {
        return {...doc.data(), uid: doc.id}
      });

    }

    return planningList;


  }, [userCentreList.data])


  useEffect(() => {

    let isCancelled = false;

    setUserCentreList((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: []
      }
    });

    loadUserCentreList().then((centres) => {

      if(!isCancelled) setUserCentreList((prevState) => {
        return {
          ...prevState,
          isProcessing: false,
          data: centres
        }
      })

    }).catch((error) => {
      if(!isCancelled) setError({
        type: "error",
        message: "Erreur lors du chargement des centres : " + error.message
      })
    });

    return () => {
      isCancelled = true
    }

  }, [loadUserCentreList]);


  useEffect(() => {

    if(jour == null && nom == null) {

      // si le chargement da la liste des centres est terminé et qu'il y a des éléments dans la liste
      if(userCentreList.isProcessing === false && userCentreList.data.length > 0) {

        // choisir l'index 0 par défaut
        let selectedCentreIndexDefault = 0;
        let selectedCentre = userCentreList.data[selectedCentreIndexDefault];
  
        // re-router l'utilisateur vers le centre selectionné par défaut et charger les données spécifiques à ce centre
        if(selectedCentre != null) {
          history.push("/planning/" + selectedCentre.nom + '/' + selectedCentre.jour);
        }

      }
    //  si l'utilisateur arrive directement vers le route du centre
    } else {

      // si le chargement da la liste des centres est terminé
      if(userCentreList.isProcessing === false) {

        // choisir le centre par rapport à la liste des centres et le route
        let selectedCentre = userCentreList.data.findIndex((centre) => {
          return centre.nom === nom && centre.jour === jour
        });
  
        // si le centre n'existe pas parmi la liste des centres, alors router l'utilisateur vers /planning
        if(selectedCentre === -1) {

          history.push("/planning");

        // sinon selectionner le centre et charger les données specifiques à ce centre
        } else {

          setSelectedCentreIndex(selectedCentre);
          
        }
      }
    }

  }, [jour, nom, history, userCentreList]);


  useEffect(() => {

    let isCancelled = false;

    if(selectedCentreIndex !== null) {

      let loadingTerminated = [false, false];
      setSelectedCentreDataIsLoading(true);
  
      loadSelectedCentreMembers(selectedCentreIndex).then((membres) => {

        loadingTerminated[0] = true;
  
        if (!isCancelled) {

          setSelectedCentreMemberList(membres);

          if(!loadingTerminated.includes(false)) {
            setSelectedCentreDataIsLoading(false);
          }

        } 
  
      }).catch((error) => {
        if (!isCancelled) setError({
          type: "error",
          message: "Erreur lors du chargement des membres de la distribution : " + error.message
        })
      });
  
      loadSelectedCentrePlanning(selectedCentreIndex).then((planningList) => {

        loadingTerminated[1] = true;
  
        if (!isCancelled) {

          setSelectedCentrePlanningList(planningList);

          if(!loadingTerminated.includes(false)) {
            setSelectedCentreDataIsLoading(false);
          }

        }
  
      }).catch((error) => {
        if (!isCancelled) setError({
          type: "error",
          message: "Erreur lors du chargement des plannings : " + error.message
        })
      });

    }


    return () => {
      isCancelled = true
    }

  }, [selectedCentreIndex, loadSelectedCentrePlanning, loadSelectedCentreMembers])



  const updateSelectedCentre = useCallback((index) => {

    history.push({
      pathname: "/planning/" + userCentreList.data[index].nom + '/' + userCentreList.data[index].jour
    });

  }, [history, userCentreList.data]);


  if(error !== null) {
    return (
      <div className="container-fluid container-80">
        <AlertBox error={error} />
      </div>
    )
  } else if(userCentreList.isProcessing === null || userCentreList.isProcessing === true || selectedCentreDataIsLoading === null || selectedCentreDataIsLoading === true) {
    return (<PageLoading />);
  }  else {
    return (
      <div className="container-fluid container-80">
        <DistributionListContainer centres={userCentreList.data} selectedCentreIndex={selectedCentreIndex} updateSelectedCentre={updateSelectedCentre} />
        {
          selectedCentrePlanningList.map((planning) => {
            return (<PlanningCard key={planning.date} centre={userCentreList.data[selectedCentreIndex]} planning={planning} membres={selectedCentreMemberList} connectedUser={connectedUser} />)
          })
        }
      </div>
    )

  }

}

function DistributionListContainer({centres, selectedCentreIndex, updateSelectedCentre}) {

  if(centres.length > 1) {
    return (
      <ul className="planning-distribution-list">
        {
          centres.map((centre, index) => {
            return <li onClick={index === selectedCentreIndex ? null : () => {updateSelectedCentre(index)}} className={index === selectedCentreIndex ? 'selected' : ''}  key={index} >{capitalize(centre.nom)} le {centre.jour}</li>;
          })
        }
      </ul>
    )
  } else if(centres.length === 0) {
    return (<AlertBox error={{type: "warning",
    message: "Vous devez d'abord adhérer à une distribution pour pouvoir consulter son planning."}} />)
  } else {
    return null
  }
  
}

export default Planning;