import React, { useEffect, useState, useCallback, useContext } from 'react';
import PlanningCard from '../components/PlanningCard';
import { UserContext } from "../providers/UserProvider";
import PageLoading from '../components/PageLoading';
import {capitalize} from '../components/Helpers';
import { useHistory, useParams } from "react-router-dom";
import AlertBox from '../components/AlertBox';
import useFirestore from './../hooks/useFirestore';

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
  

  const {
    getUserCentreList,
    getCentreMembreList,
    getCentrePlanning
  } = useFirestore();

  


  useEffect(() => {

    let isCancelled = false;

    setUserCentreList({
      isProcessing: true,
      data: []
    });

    getUserCentreList(connectedUser.uid).then((centres) => {

      if(!isCancelled) setUserCentreList({
        isProcessing: false,
        data: centres
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

  }, [connectedUser.uid, getUserCentreList]);


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

    if(userCentreList.isProcessing === false) {

      if(selectedCentreIndex !== null) {

        let loadingTerminated = [false, false];
        setSelectedCentreDataIsLoading(true);
  
    
        getCentreMembreList(userCentreList.data[selectedCentreIndex].uid).then((membres) => {
  
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
    
        getCentrePlanning(userCentreList.data[selectedCentreIndex]).then((planningList) => {
  
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
  
      } else {
        if(userCentreList.data.length === 0) {
          if (!isCancelled) setSelectedCentreDataIsLoading(false);
        }
      }

    }


    return () => {
      isCancelled = true
    }

    

  }, [userCentreList, selectedCentreIndex, getCentreMembreList, getCentrePlanning])



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