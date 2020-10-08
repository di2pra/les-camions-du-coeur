import React, { useState, useCallback, useEffect, useContext } from 'react';
import { firestore, firebaseApp } from "../Firebase";
import PageLoading from '../components/PageLoading';
import {UserContext} from "./../providers/UserProvider";
import AlertBox from '../components/AlertBox';
import {capitalize} from '../components/Helpers';

function DistributionCard({centre}) {


  const {connectedUser} = useContext(UserContext);

  const [error, setError] = useState({type: "", message: ""});
  const [selectedCentre, setSelectedCentre] = useState({isProcessing: false, data: centre});
  const [centreMembreDetailsList, setCentreMembreDetailsList] = useState({isProcessing: true, data: []});
  const [centreDemandeAdhesionDetailsList, setCentreDemandeAdhesionDetailsList] = useState({isProcessing: true, data: []});
  const [connectedUserAdhesionDetails, setConnectedUserAdhesionDetails] = useState({isProcessing: true, data: null});
  

  const isConnectedUserResponsable = useCallback((membres) => {
    return typeof membres.find((membre) => {return (membre.uid === connectedUser.uid && membre.type === "responsable")}) !== 'undefined'
  }, [connectedUser.uid]);

  const isConnectedUserMember = useCallback((membres) => {
    return typeof membres.find((membre) => {return (membre.uid === connectedUser.uid)}) !== 'undefined'
  }, [connectedUser.uid]);


  const loadConnectedUserAdhesionDetails = useCallback(async (selectedCentreUid) => {

    setConnectedUserAdhesionDetails((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: null
      }
    })

    let adhesionData = null;

    try {

      const adhesionRef = await firestore.collection("demandeAdhesion").where("centre", "==", selectedCentreUid).where("utilisateur", "==", connectedUser.uid).get();

      if(!adhesionRef.empty) {

        adhesionData = {...adhesionRef.docs[0].data(), uid: adhesionRef.docs[0].id}
        
      }
      
    } catch (error) {
      setError({
        type: "error",
        message: "Erreur lors du chagement des informations d'adhesion : " + error.message
      });
    }


    setConnectedUserAdhesionDetails((prevState) => {
      return {
        ...prevState,
        isProcessing: false,
        data: adhesionData
      }
    })

    

  }, [connectedUser.uid]);

  const loadCentreDemandeAdhesionDetails = useCallback(async (selectedCentreUid) => {

    let demandeAdhesionList = [];
    let demandeAdhesionDetailsList = [];

    setCentreDemandeAdhesionDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: []
      }
    });
      
    try {

      const demandeAdhesionListRef = await firestore.collection("demandeAdhesion").where("centre", "==", selectedCentreUid).get();
      
      demandeAdhesionList = demandeAdhesionListRef.docs.map((doc) => {
        return ({...doc.data(), uid: doc.id});
      });
    
    
    } catch (error) {
      setError({
        type: "error",
        message: error.message
      })
    }


    if(demandeAdhesionList.length > 0) {

      let listUserIds = demandeAdhesionList.map(adhesion => {return adhesion.utilisateur});

      let i,j,temparray,chunk = 10;
      for (i=0,j=listUserIds.length; i<j; i+=chunk) {
        
        temparray = listUserIds.slice(i,i+chunk);

        try {

          // retrieve users details of demande Adhesion
          let demandeAdhesionuDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();

          demandeAdhesionuDetailsRef.docs.forEach((doc) => {

            let selectedUserDemandeAdhesion = demandeAdhesionList.find((demandeAdhesin) => { return (demandeAdhesin.utilisateur === doc.id)});

            demandeAdhesionDetailsList.push({...doc.data(), utilisateurUid: doc.id, uid: selectedUserDemandeAdhesion.uid})
          })
          
        } catch (error) {
          setError({
            type: "error",
            message: error.message
          })
        }

      }

    }

    setCentreDemandeAdhesionDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: false,
        data: demandeAdhesionDetailsList
      }
    });

  }, []);

  const loadCentreMembreDetails = useCallback(async (selectedCentreUid) => {


    let membreList = [];
    let membreDetailsList = [];

    setCentreMembreDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: []
      }
    });

    try {

      // retrieve membres id and type
      const membresRef = await firestore.collection("centres").doc(selectedCentreUid).collection("membres").get();

      membreList = membresRef.docs.map((doc) => {
        return ({...doc.data()});
      });
      
    } catch (error) {

      setError({
        type: "error",
        message: "Erreur lors du chagement des membres : " + error.message
      })

    }


    // retrieve membre details

    if(membreList.length > 0) {

      let membreListIds = membreList.map((membre) => {return membre.utilisateur});

      let i,j,temparray,chunk = 10;
      for (i=0,j=membreListIds.length; i<j; i+=chunk) {
        
        temparray = membreListIds.slice(i,i+chunk);

        try {

          const membreDetailsRef = await firestore.collection("utilisateurs").where(firebaseApp.firestore.FieldPath.documentId(), "in", temparray).get();
    
          membreDetailsRef.forEach((doc) => {

            let membreType = membreList.find((membre) => {return membre.utilisateur === doc.id});

            membreDetailsList.push({
              ...doc.data(), 
              uid: doc.id,
              type: membreType.type
            })

          });
          
        } catch (error) {
          setError({
            type: "error",
            message: "Erreur lors du chagement des membres : " + error.message
          })
        }
        

      }
    }

    //await delay(5000);

    setCentreMembreDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: false,
        data: membreDetailsList
      }
    });

    return membreDetailsList;

  }, []);

  useEffect(() => {

    setSelectedCentre({
      isProcessing: false,
      data: centre
    });

  }, [centre]);


  useEffect(() => {

    loadCentreMembreDetails(centre.uid).then((membreList) => {
      if(isConnectedUserResponsable(membreList)) {
        loadCentreDemandeAdhesionDetails(centre.uid);
      } else {
        setCentreDemandeAdhesionDetailsList((prevState) => {
          return {
            ...prevState,
            isProcessing: false
          }
        })
      }
    });

    loadConnectedUserAdhesionDetails(centre.uid);


  }, [centre.uid, loadCentreMembreDetails, isConnectedUserResponsable, loadCentreDemandeAdhesionDetails, loadConnectedUserAdhesionDetails]);



  const onRegisterClick = (e) => {
    e.preventDefault();

    saveRegisterCentre();

  }

  const saveRegisterCentre = useCallback(async () => {


    setConnectedUserAdhesionDetails((prevState) => {
      return {
        ...prevState, 
        isProcessing: true
      }
    });

    let demandeAdhesion = null;


    try {

      let demandeAdhesionRef = await firestore.collection('demandeAdhesion').add({
        centre: centre.uid,
        utilisateur: connectedUser.uid
      });

      demandeAdhesion = {centre: centre.uid, utilisateur: connectedUser.uid, uid: demandeAdhesionRef.id};


    } catch (error) {
      setError({
        type: "error",
        message: "Erreur lors de votre demande d'adhésion : " + error.message
      });
    }

    setConnectedUserAdhesionDetails((prevState) => {
      return {
        ...prevState, 
        isProcessing: false,
        data: demandeAdhesion
      }
    });
    

  }, [setConnectedUserAdhesionDetails, connectedUser.uid, centre.uid])

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
        isProcessing: true,
        data: []
      }
    });


    try {

      await batch.commit();

      loadCentreMembreDetails(centre.uid).then((membreList) => {
        if(isConnectedUserResponsable(membreList)) {
          loadCentreDemandeAdhesionDetails(centre.uid);
        } else {
          setCentreDemandeAdhesionDetailsList((prevState) => {
            return {
              ...prevState,
              isProcessing: false,
              data: []
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

    
    

  }, [centre.uid, isConnectedUserResponsable, loadCentreMembreDetails, loadCentreDemandeAdhesionDetails]);


  const saveDeclineAdhesion = useCallback(async (adhesion) => {
    
    setCentreDemandeAdhesionDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: []
      }
    });

    try {

      // delete demande adhésion
      await firestore.collection("demandeAdhesion").doc(adhesion.uid).delete();

      if(isConnectedUserResponsable(centreMembreDetailsList.data)) {
        loadCentreDemandeAdhesionDetails(centre.uid);
      } else {
        setCentreDemandeAdhesionDetailsList((prevState) => {
          return {
            ...prevState,
            isProcessing: false
          }
        })
      }

    } catch (error) {

      setError({
        type: "error",
        message: "Erreur lors du refus d'une demande d'adhésion : " + error.message
      });

    }

    setCentreDemandeAdhesionDetailsList((prevState) => {
      return {
        ...prevState,
        isProcessing: false
      }
    });

    
    

  }, [centreMembreDetailsList.data, centre.uid, isConnectedUserResponsable, loadCentreDemandeAdhesionDetails]);



  const saveCentreDesc = useCallback(async (descValue) => {

    setSelectedCentre((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: null
      }
    });

    let newCentreData = null;

    try {

      await firestore.collection("centres").doc(centre.uid).update({informations: descValue});

      let centreRef = await firestore.collection("centres").doc(centre.uid).get();

      newCentreData = {...centreRef.data(), uid: centreRef.id};

    } catch (error) {

      setError({
        type: "error",
        message: "Erreur lors de la mise à jour de la description de la distribution : " + error.message
      });

    }

    setSelectedCentre((prevState) => {
      return {
        ...prevState,
        isProcessing: false,
        data: newCentreData
      }
    });
    

  }, [centre.uid]);


  if(error.type !== "") {
    return (
      <div id="distribution-details" className="container-fluid container-80">
        <AlertBox type={error == null ? '' : error.type} message={error == null ? '' : error.message} />
      </div>
    )
  } else if(selectedCentre.isProcessing === true || centreMembreDetailsList.isProcessing === true || centreDemandeAdhesionDetailsList.isProcessing === true || connectedUserAdhesionDetails.isProcessing === true) {
    return (<PageLoading />);
  } else {
    return (
      <div id="distribution-details" className="container-fluid container-80">
        <AlertBox type={error == null ? '' : error.type} message={error == null ? '' : error.message} />
        <RegisterBanner adhesion={connectedUserAdhesionDetails.data} connectedUser={connectedUser} onRegisterClick={onRegisterClick} isConnectedUserMember={isConnectedUserMember(centreMembreDetailsList.data)}  />
        <DistributionDetailSection centre={selectedCentre.data} isConnectedUserResponsable={isConnectedUserResponsable(centreMembreDetailsList.data)} saveCentreDesc={saveCentreDesc} />
        <section>
          <h1>Responsable(s)</h1>
          <ResponsableSection membres={centreMembreDetailsList.data} />
        </section>
        <section>
          <h1>Membre(s)</h1>
          <ParticipantSection membres={centreMembreDetailsList.data} />
        </section>
        <DemandeAdhesion saveDeclineAdhesion={saveDeclineAdhesion} saveAcceptAdhesion={saveAcceptAdhesion} demandeAdhesionList={centreDemandeAdhesionDetailsList.data} isConnectedUserResponsable={isConnectedUserResponsable(centreMembreDetailsList.data)} />
      </div>
    );
  }

  
  
}

function DistributionDetailSection({centre, isConnectedUserResponsable, saveCentreDesc}) {

  const [state, setState] = useState({
    editMode: false,
    value: ""
  });

  useEffect(() => {

    setState({
      editMode: false,
      value: centre.informations
    })

  }, [centre])

  const handleTextValueChange = (event) => {
    event.preventDefault();

    setState({editMode: true, value: event.target.value});

  }

  const handleEditModeChange = (event) => {
    event.preventDefault();

    setState((previousState) => {
      return {
        ...previousState,
        editMode : !previousState.editMode
      }
    })

  }

  const onUpdateSaveClick = (event) => {

    event.preventDefault();

    saveCentreDesc(state.value);

  }

  if(isConnectedUserResponsable) {

    if(state.editMode) {

      return (
        <section className="desc-section">
          <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
          <form>
            <textarea rows="10" value={state.value} onChange={handleTextValueChange} />
            <div className="buttons-container">
              <button onClick={onUpdateSaveClick} type="button" className="btn-animated primary">Enregistrer</button>
              <button onClick={handleEditModeChange} type="button" className="btn-animated secondary">Annuler</button>
            </div>
          </form>
        </section>
      )

      
  
    } else {
  
      return (
        <section className="desc-section">
          <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
          <p>{state.value === "" ? 'Aucune information' : state.value }</p>
          <div className="buttons-container">
            <button onClick={handleEditModeChange} type="button" className="btn-animated primary">Modifier</button>
          </div>
        </section>
      )
  
    }

  } else {

    return (
      <section className="desc-section">
        <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
        <p>{state.value === "" ? 'Aucune information' : state.value }</p>
      </section>
    )

  }

  

  
}


function RegisterBanner({connectedUser, onRegisterClick, adhesion, isConnectedUserMember}) {

  if(isConnectedUserMember) {
    return null;
  } else if(adhesion !== null && adhesion.utilisateur === connectedUser.uid) {
    return <AlertBox type="info" message="Votre demande d'adhésion pour cette distribution est en attente de validation par un responsable." />
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
      <div className="user-list-container">
        {
          (responsables || []).map((responsable) => {
  
            return <UserItem key={responsable.uid} user={responsable} />;
  
          })
        }
      </div>
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
      <div className="user-list-container">
        {
          (participants || []).map((participant) => {
  
            return <UserItem key={participant.uid} user={participant} />;
  
          })
        }
      </div>
    )
  } else {
    return (
      <p>Aucun membre</p>
    )
  }
}

function UserItem({user}) {

  const name = (user.prenom && user.nom) ? (user.prenom + ' ' + user.nom.substring(0,1) + '.') : 'Inconnu';

  return (
    <div className="item-user">
      <div className="item-user-image">
        <div className="item-user-image-content" style={{backgroundImage: `url(${user.profil_pic === '' ? process.env.PUBLIC_URL + '/img/profile.png' : user.profil_pic } )`}} ></div>
      </div>
      <div className="item-user-name"><p>{name}</p></div>
    </div>
  )
}

export default DistributionCard;