import React, { useState, useCallback, useEffect, useContext } from 'react';

import { firestore } from "../../../Firebase";
import PageLoading from '../../../components/PageLoading';
import {UserContext} from "../../../providers/UserProvider";
import UserList from '../../User/components/UserList';
import AlertBox from '../../../components/AlertBox';
import DistributionDetailSection from './DistributionDetailsSection';
import useFirestore from '../../../hooks/useFirestore';

function DistributionCard({centre}) {


  const {connectedUser} = useContext(UserContext);

  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedCentre, setSelectedCentre] = useState(centre);
  const [centreMembreDetailsList, setCentreMembreDetailsList] = useState([]);
  const [centreDemandeAdhesionDetailsList, setCentreDemandeAdhesionDetailsList] = useState([]);
  const [connectedUserAdhesionDetails, setConnectedUserAdhesionDetails] = useState(null);
  

  const isConnectedUserResponsable = useCallback((membres) => {
    return typeof membres.find((membre) => {return (membre.uid === connectedUser.uid && membre.type === "responsable")}) !== 'undefined'
  }, [connectedUser.uid]);

  const isConnectedUserMember = useCallback((membres) => {
    return typeof membres.find((membre) => {return (membre.uid === connectedUser.uid)}) !== 'undefined'
  }, [connectedUser.uid]);


  const {
    getUserAdhesionDetails, 
    getCentreDemandeAdhesionList, 
    getCentreMembreList,
    updateCentre,
    createDemandeAdhesion,
    deleteDemandeAdhesion
  } = useFirestore();
  

  

  useEffect(() => {

    let isCancelled = false;

    setIsProcessing(true);

    getCentreMembreList(centre.uid).then((membreList) => {

      if(!isCancelled) setCentreMembreDetailsList(membreList);

      if(isConnectedUserMember(membreList)) {

        if(isConnectedUserResponsable(membreList)) {

          getCentreDemandeAdhesionList(centre.uid).then((demandeAdhesionList) => {

            if(!isCancelled) setCentreDemandeAdhesionDetailsList(demandeAdhesionList);
            if(!isCancelled) setIsProcessing(false);

          }).catch((error) => {

            if(!isCancelled) setError({
              type: "error",
              message: "Erreur lors du chagement des demandes d'adhésion : " + error.message
            });

          });

        } else {
          if(!isCancelled) setIsProcessing(false);
        }

      } else {

        getUserAdhesionDetails(centre.uid, connectedUser.uid).then((adhesionData) => {

          if(!isCancelled) setConnectedUserAdhesionDetails(adhesionData);
          if(!isCancelled) setIsProcessing(false);

        }).catch((error) => {

          if(!isCancelled) setError({
            type: "error",
            message: "Erreur lors du chagement des informations d'adhésion de l'utilisateur connectée : " + error.message
          });

        })
      }


    }).catch((error) => {

      if(!isCancelled) setError({
        type: "error",
        message: "Erreur lors du chagement des membres : " + error.message
      })

    });

    
    return () => {
      isCancelled = true
    }


  }, [connectedUser.uid, centre.uid, getCentreMembreList, isConnectedUserMember, isConnectedUserResponsable, getCentreDemandeAdhesionList, getUserAdhesionDetails]);



  const onRegisterClick = useCallback((e) => {

    e.preventDefault();

    setIsProcessing(true);

    createDemandeAdhesion({
      centre: centre.uid,
      utilisateur: connectedUser.uid
    }).then((demandeAdhesion) => {

      setConnectedUserAdhesionDetails(demandeAdhesion);
      setIsProcessing(false);

    }).catch((error) => {

      setError({
        type: "error",
        message: "Erreur lors de votre demande d'adhésion : " + error.message
      });

    })

  }, [createDemandeAdhesion, connectedUser.uid, centre.uid]);


  const saveAcceptAdhesion = useCallback(async (adhesion) => {

    // Get a new write batch
    var batch = firestore.batch();

    // Delete demandeAdhesion
    let demandeAdhesionRef = firestore.collection("demandeAdhesion").doc(adhesion.uid);
    batch.delete(demandeAdhesionRef);


    // Update the centre with new user
    var membreRef = firestore.collection("centres").doc(centre.uid).collection("membres").doc(adhesion.utilisateurUid);
    batch.set(
      membreRef, 
      {
        "utilisateur": adhesion.utilisateurUid,
        "type": "membre"
      }
    );


    setCentreMembreDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: true
      }
    });


    try {

      await batch.commit();

      getCentreMembreList(centre.uid).then((membreList) => {

        if(isConnectedUserResponsable(membreList)) {

          getCentreDemandeAdhesionList(centre.uid).then(() => {
            setCentreMembreDetailsList((prevState) => {
              return {
                ...prevState,
                isProcessing: false,
                data: membreList
              }
            });
          });

        } else {

          setCentreMembreDetailsList((prevState) => {
            return {
              ...prevState,
              isProcessing: false,
              data: membreList
            }
          })

        }

      });


    } catch (error) {

      setError({
        type: "error",
        message: "Erreur lors de l'acceptation d'une demande d'adhésion : " + error.message
      });


      setCentreMembreDetailsList((prevState) => {
        return {
          ...prevState,
          isProcessing: false
        }
      });

    }
    
    

  }, [centre.uid, isConnectedUserResponsable, getCentreMembreList, getCentreDemandeAdhesionList]);


  const saveDeclineAdhesion = useCallback(async (adhesion) => {

    setIsProcessing(true);

    deleteDemandeAdhesion(adhesion.uid).then(() => {

      if(isConnectedUserResponsable(centreMembreDetailsList)) {

        getCentreDemandeAdhesionList(centre.uid).then((demandeAdhesionList) => {

          setCentreDemandeAdhesionDetailsList(demandeAdhesionList);
          setIsProcessing(false);

        }).catch((error) => {

          setError({
            type: "error",
            message: "Erreur lors du refus d'une demande d'adhésion : " + error.message
          });

        });

      } else {

        setIsProcessing(false);

      }


    }).catch((error) => {

      setError({
        type: "error",
        message: "Erreur lors du refus d'une demande d'adhésion : " + error.message
      });

    });
    

  }, [centreMembreDetailsList, centre.uid, isConnectedUserResponsable, deleteDemandeAdhesion, getCentreDemandeAdhesionList]);




  const onSaveCentreDesc = useCallback((descValue) => {

    setIsProcessing(true);

    updateCentre({...selectedCentre, informations: descValue}).then((newCentre) => {

      setSelectedCentre(newCentre);
      setIsProcessing(false);

    }).catch((error) => {

      setError({
        type: "error",
        message: "Erreur lors de la mise à jour de la description de la distribution : " + error.message
      });

    })

  }, [selectedCentre, updateCentre]);


  if(error !== null) {
    return (
      <div id="distribution-details" className="container-fluid container-80">
        <AlertBox error={error} />
      </div>
    )
  } else if(isProcessing) {
    return <PageLoading />;
  } else {
    return (
      <div id="distribution-details" className="container-fluid container-80">
        <RegisterBanner adhesion={connectedUserAdhesionDetails} connectedUser={connectedUser} onRegisterClick={onRegisterClick} isConnectedUserMember={isConnectedUserMember(centreMembreDetailsList)}  />
        <DistributionDetailSection centre={selectedCentre} isConnectedUserResponsable={isConnectedUserResponsable(centreMembreDetailsList)} onSaveCentreDesc={onSaveCentreDesc} />
        <section>
          <h1>Responsable(s)</h1>
          <ResponsableSection membres={centreMembreDetailsList} />
        </section>
        <section>
          <h1>Membre(s)</h1>
          <ParticipantSection membres={centreMembreDetailsList} />
        </section>
        <DemandeAdhesion saveDeclineAdhesion={saveDeclineAdhesion} saveAcceptAdhesion={saveAcceptAdhesion} demandeAdhesionList={centreDemandeAdhesionDetailsList} isConnectedUserResponsable={isConnectedUserResponsable(centreMembreDetailsList)} />
      </div>
    );
  }

  
  
}



function RegisterBanner({connectedUser, onRegisterClick, adhesion, isConnectedUserMember}) {

  if(isConnectedUserMember) {
    return null;
  } else if(adhesion !== null && adhesion.utilisateur === connectedUser.uid) {
    return <AlertBox error={{type: "info", message: "Votre demande d'adhésion pour cette distribution est en attente de validation par un responsable."}} />
  } else {
    return(
      <section className="register-banner" >
        <div className="buttons-container">
          <button type="button" className="btn-animated primary" onClick={onRegisterClick}>Adhérer à cette distribution</button>
        </div>
      </section>
    )
  }
  
}

function DemandeAdhesion({demandeAdhesionList, saveAcceptAdhesion, saveDeclineAdhesion, isConnectedUserResponsable}) {

  if(isConnectedUserResponsable) {

    if(demandeAdhesionList.length === 0) {
      return (
        <section>
          <h1>Demande(s) d'adhésion</h1>
          <p>Aucune demande d'adhésion</p>
        </section>
      )
    } else {
      return(
        <section>
          <h1>Demande(s) d'adhésion</h1>
          <ul className="demande-adhesion-list">
            {
              demandeAdhesionList.map((adhesion, index) => {
  
                  return (
                    <li key={index}>
                      <div className="user-profile-pic" style={{backgroundImage: `url(${adhesion.profil_pic === '' ? process.env.PUBLIC_URL + '/img/profile.png' : adhesion.profil_pic } )`}} ></div>
                      <p>{adhesion.prenom} {adhesion.nom}</p>
                      <div className="buttons-container">
                        <button onClick={(e) => { e.preventDefault(); saveAcceptAdhesion(adhesion);}} type="button" className="btn-animated primary">Accepter</button>
                        <button onClick={(e) => { e.preventDefault(); saveDeclineAdhesion(adhesion);}} type="button" className="btn-animated secondary">Refuser</button>
                      </div>
                    </li>
                  )
  
              })
            }
          </ul>
        </section>
      )
    }

    
  } else {
    return null
  }

  
}

function ResponsableSection({membres}) {

  const responsables = membres.filter((membre) => {return membre.type === "responsable"});

  if(responsables.length > 0) {
    return (
      <UserList users={responsables} />
    )
  } else {
    return (
      <p>Aucun responsable</p>
    )
  }
}

function ParticipantSection({membres}) {

  const participants = membres.filter((membre) => {return membre.type === "membre"});

  if(participants.length > 0) {
    return (
      <UserList users={participants} />
    )
  } else {
    return (
      <p>Aucun membre</p>
    )
  }
}

export default DistributionCard;