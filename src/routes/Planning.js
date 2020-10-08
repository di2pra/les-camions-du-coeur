import React, { useEffect, useState, useCallback, useContext } from 'react';
import PlanningCard from '../components/PlanningCard';
import { UserContext } from "../providers/UserProvider";
import { firestore, firebaseApp } from "../Firebase";
import PageLoading from '../components/PageLoading';
import {daysGenerator} from '../components/Helpers';
import AlertBox from '../components/AlertBox';
import {capitalize} from '../components/Helpers';
import { useHistory, useParams } from "react-router-dom";


function Planning({reset}) {

  let { nom, jour } = useParams();
  const history = useHistory();

  const {connectedUser} = useContext(UserContext);

  const [state, setState] = useState({
    isProcessing: null, 
    centres: [], 
    selectedCentreIndex: null,
    membres: [],
    distributions: [],
    error: {
      type: "",
      message: ""
    }
  })


  const loadData = useCallback(async () => {

    var newState = {
      ...state,
      isProcessing: false
    }

    setState(previousState => {
      return {...previousState, isProcessing: true}
    })


    try {

      if(newState.centres.length === 0 || reset) {
        const membresRef = await firestore.collectionGroup("membres").where("utilisateur", "==", connectedUser.uid).get();



        let centreIds = membresRef.docs.map((membreRef) => {
          return membreRef.ref.parent.parent.id
        });


        if(centreIds.length>0) {

          const centresRef = await firestore.collection("centres").where(firebaseApp.firestore.FieldPath.documentId(), "in", centreIds).get();

          newState = {
            ...newState,
            centres: centresRef.docs.map((centre) => {
              return {...centre.data(), uid: centre.id}
            }),
            selectedCentreIndex: 0
          }

          let selectedCentreIndex = newState.centres.findIndex((centre) => {
            if(centre.nom === nom && centre.jour === jour) {
              return true;
            } else {
              return false;
            }
          })

          if(selectedCentreIndex === -1) {
            history.push({
              pathname: "/planning/" + newState.centres[newState.selectedCentreIndex].nom + '/' + newState.centres[newState.selectedCentreIndex].jour
            });

          } else {

            newState = {
              ...newState,
              selectedCentreIndex: selectedCentreIndex
            }

          }

        } else {

          newState = {
            ...newState,
            centres: [],
            selectedCentreIndex: null
          }
        }

      }


      if(newState.centres.length>0) {


        // retrieve membre id and type
        const membresRef = await firestore.collection("centres").doc(newState.centres[newState.selectedCentreIndex].uid).collection("membres").get();

        newState = {
          ...newState,
          membres: membresRef.docs.map((doc) => {
            return ({...doc.data()});
          })
        }


        if(newState.membres.length > 0) {

          let listUserIds = newState.membres.map((membre) => {return membre.utilisateur})
          let i,j,temparray,chunk = 10;
          let membreDetailsList = [];
          let membreList = newState.membres;

          for (i=0,j=listUserIds.length; i<j; i+=chunk) {
            
            temparray = listUserIds.slice(i,i+chunk);

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

  
          newState = {
            ...newState,
            membres: membreDetailsList
          }
          
  
        }



        
        // retrieve distributions from the centre
        const today = (new Date()).toISOString().split("T")[0];
        let distributionsRef = await firestore.collection("centres").doc(newState.centres[newState.selectedCentreIndex].uid).collection("distributions").where("date", ">=", today).orderBy("date").limit(5).get();


        let distributionsData = distributionsRef.docs.map((doc)  => {
          return {...doc.data(), uid: doc.id}
        });

        if(distributionsRef.size < 5) {

          let days = daysGenerator(newState.centres[newState.selectedCentreIndex].jour);

          for(var i =0; i< distributionsData.length; i++ ) {
            for(var j= 0; j< days.length;j++) {
              if (days[j] === distributionsData[i].date) {
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
            var docToCreate = firestore.collection("centres").doc(newState.centres[newState.selectedCentreIndex].uid).collection("distributions").doc();
            batch.set(docToCreate, dist)
          })


          // Commit the batch
          await batch.commit();

          // re-fetch the distribution list from the db
          distributionsRef = await firestore.collection("centres").doc(newState.centres[newState.selectedCentreIndex].uid).collection("distributions").where("date", ">", today).orderBy("date").limit(5).get();


          // populate the distribution val
          distributionsData = distributionsRef.docs.map((doc)  => {
            return {...doc.data(), uid: doc.id}
          });

        }

        newState = {
          ...newState,
          distributions: distributionsData
        } 

      } else {
        newState = {
          ...newState,
          error: {
            type: "warning",
            message: "Vous devez d'abord adhérer à une distribution pour pouvoir consulter son planning."
          }
        }
      }

    } catch (error) {

      newState = {
        ...newState,
        error: {
          type: "error",
          message: error.message
        }
      }

    }

    setState(newState);


  }, [connectedUser.uid, state, jour, nom, history, reset])




  useEffect(() => {

    if(reset) {
      setState((previousState) => { return {...previousState, isProcessing: null}})
    }

  }, [reset]);


  useEffect(() => {

    if(state.isProcessing === null) {
      loadData();
    }

  }, [loadData, state.isProcessing]);

  

  const updateSelectedCentre = useCallback((index) => {

    setState(prevState => {
      return {
        ...prevState,
        isProcessing: null,
        selectedCentreIndex: index
      }
    })

    history.push({
      pathname: "/planning/" + state.centres[index].nom + '/' + state.centres[index].jour
    });

  }, [history, state.centres]);

  if(state.isProcessing) {
    return <PageLoading />
  } else {
    return (
      <div className="container-fluid container-80">
        <div className="planning-alert">
          <AlertBox type={state.error.type} message={state.error.message} />
        </div>
        <DistributionListContainer centres={state.centres} selectedCentreIndex={state.selectedCentreIndex} updateSelectedCentre={updateSelectedCentre} />
        {
          state.distributions.map((distribution) => {
            return (<PlanningCard key={distribution.date} centre={state.centres[state.selectedCentreIndex]} distribution={distribution} membres={state.membres} connectedUser={connectedUser} />)
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
  } else {
    return null
  }

  
}

export default Planning;