import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import {UserContext} from "../../providers/UserProvider";
import PageLoading from "../../components/PageLoading";
import AlertBox from "../../components/AlertBox";
import useFirestore from "../../hooks/useFirestore";
import { Error } from "../../types/Error";

import CentreItem from "./components/CentreItem";
import { CentreDeDistribution} from "./types";
import DistributionCard from "./components/DistributionCard";
import useCentreForm from "../../hooks/useCentreForm";

interface ParamTypes {
  nom: string,
  jour: string
}

function Distribution() {

  const { nom, jour } = useParams<ParamTypes>();
  const history = useHistory();
  const {connectedUser} = useContext(UserContext);

  const [centreList, setCentreList] = useState<{
    isProcessing: boolean | null;
    error: Error | null;
    data: CentreDeDistribution[];
  }>({
    isProcessing: true,
    error: null,
    data: []
  });

  const {
    getCentreList
  } = useFirestore();



  useEffect(() => {

    let isCancelled = false;

    getCentreList()
    .then((centres) => {

      if (!isCancelled) setCentreList({
        isProcessing: false,
        error: null,
        data: centres
      });

    })
    .catch((error) => {

      if (!isCancelled) setCentreList({
        isProcessing: false,
        error: {
          type: "error",
          message:
            "Erreur lors du chargement de la liste des distributions : " +
            error.message,
        },
        data: []
      });

    });

    return () => {
      isCancelled = true;
    };

  }, [getCentreList]);

  const updateSelectedCentre = useCallback((newCentre : CentreDeDistribution) => {

    const findCentreIndex = centreList.data.findIndex(centre => centre.uid === newCentre.uid);

    if(findCentreIndex !== -1) {
      setCentreList(prevState => {

        let newCentreList = prevState.data;
        newCentreList[findCentreIndex] = newCentre;

        return {
          ...prevState,
          data: newCentreList
        }
      })
    }

  }, [centreList.data]);


  const {
    state,
    setState,
    onRegisterClick,
    saveDeclineAdhesion,
    saveAcceptAdhesion,
    onSaveCentreDesc,
  } = useCentreForm(connectedUser, updateSelectedCentre);



  useEffect(() => {

    if (jour == null || nom === null) {

      setState(prevState => {

        return {
          ...prevState,
          selectedCentre: null,
          centreDemandeAdhesionUserList: null,
          centreMembreDetailsList: null,
          isProcessing: false
        }
      
      });

    } else {

      if(centreList.data.length > 0) {

        const findCentre = centreList.data.find((centre) => {
          return centre.nom === nom && centre.jour === jour;
        });

        if (findCentre == null) {
          history.push("/distribution");
        } else {

          setState(prevState => {

            if(prevState.selectedCentre === null) {
              return {
                ...prevState,
                selectedCentre: findCentre,
                isProcessing: true
              }
            } else {
              return prevState
            }
          
          });

        }
    
        
      }

    }

  }, [centreList.data, jour, nom, history,  setState]);


  if (state.error !== null || centreList.error !== null) {
    return (
      <div className="container-fluid container-80">
        <AlertBox error={state.error || centreList.error} />
      </div>
    );
  }

  if (centreList.isProcessing === true || state.isProcessing === true) {
    return <PageLoading />;
  }

  if (
    state.selectedCentre !== null && 
    connectedUser !== null &&
    state.centreMembreDetailsList != null &&
    state.centreDemandeAdhesionUserList != null
  ) {

    return <DistributionCard 
    connectedUser={connectedUser}
    centre={state.selectedCentre}
    membreDetailsList={state.centreMembreDetailsList}
    centreDemandeAdhesionUserList={state.centreDemandeAdhesionUserList}
    onRegisterClick={onRegisterClick}
    saveDeclineAdhesion={saveDeclineAdhesion}
    saveAcceptAdhesion={saveAcceptAdhesion}
    onSaveCentreDesc={onSaveCentreDesc}
    isConnectedUserMember={state.selectedCentre.participants.includes(connectedUser.uid)}
    isConnectedUserResponsable={state.selectedCentre.responsables.includes(connectedUser.uid)}
    />;
  }

  return (
    <div className="container-fluid">
      <div className="home-card-container">
        {centreList.data.map((centre) => {
          return <CentreItem key={centre.uid} centre={centre} />;
        })}
      </div>
    </div>
  );
  
  
}

export default Distribution;
