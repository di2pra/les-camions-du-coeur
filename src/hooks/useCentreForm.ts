import { useState, useCallback, useEffect } from 'react';
import { CentreDeDistribution } from '../modules/Distribution/types';
import { User, MemberWithUserInfo } from '../modules/User/types';
import useFirestore from './useFirestore';
import { Error } from "../types/Error";

const useCentreForm = (connectedUser: User | null, updateSelectedCentre: (centre:CentreDeDistribution) => void) => {

  const [state, setState] = useState<{
    isProcessing: boolean;
    error: Error | null;
    selectedCentre: CentreDeDistribution | null;
    centreMembreDetailsList: MemberWithUserInfo[] | null;
    centreDemandeAdhesionUserList: User[] | null;
  }>({
    isProcessing: true,
    error: null,
    selectedCentre: null,
    centreMembreDetailsList: null,
    centreDemandeAdhesionUserList: null
  });

  const {
    getCentreDemandeAdhesionWithUserInfoList, 
    getCentreMembreList,
    updateCentreInformation,
    addDemandeAdhesion,
    deleteDemandeAdhesion,
    addUserToCentre
  } = useFirestore();

  useEffect(() => {

    console.log("useEffect : load user list");

    if(
      typeof state.selectedCentre?.participants !== "undefined" && 
      typeof state.selectedCentre?.responsables !== "undefined" &&
      connectedUser != null) {

        console.log("getCentreMembreList");
        getCentreMembreList(state.selectedCentre.participants, state.selectedCentre.responsables).then((membreList) => {

          if(typeof state.selectedCentre?.responsables !== "undefined" && state.selectedCentre.responsables.includes(connectedUser.uid)) {

            

            setState(prevState => {

              if(prevState.centreDemandeAdhesionUserList == null) {
                return {
                  ...prevState,
                  centreMembreDetailsList: membreList
                }
              } else {
                return {
                  ...prevState,
                  centreMembreDetailsList: membreList,
                  isProcessing: false
                }
              }
            
            });

          } else {
            setState(prevState => {

              return {
                ...prevState,
                centreMembreDetailsList: membreList,
                centreDemandeAdhesionUserList: [],
                isProcessing: false
              }
            
            });
          }

        }).catch((error) => {

          setState(prevState => {

            return {
              ...prevState,
              isProcessing: false,
              error: {
                type: "error",
                message: "Erreur lors du chargement des membres : " + error.message
              }
            }
          
          });

        })

    }
    

  }, [state.selectedCentre?.participants, state.selectedCentre?.responsables, getCentreMembreList, connectedUser])


  useEffect(() => {

    console.log("useEffect : load centre adhesion");

    if(typeof state.selectedCentre?.postulants !== "undefined" &&
    typeof state.selectedCentre?.responsables !== "undefined" &&
    connectedUser != null
    ) {

      if(state.selectedCentre.responsables.includes(connectedUser.uid)) {

        console.log("getCentreDemandeAdhesionWithUserInfoList");
        getCentreDemandeAdhesionWithUserInfoList(state.selectedCentre.postulants).then((demandeAdhesionUserList) => {

          setState(prevState => {

            if(prevState.centreMembreDetailsList == null) {
              return {
                ...prevState,
                centreDemandeAdhesionUserList: demandeAdhesionUserList
              }
            } else {
              return {
                ...prevState,
                centreDemandeAdhesionUserList: demandeAdhesionUserList,
                isProcessing: false
              }
            }
            
          });

          
  
        }).catch((error) => {

          setState(prevState => {

            return {
              ...prevState,
              isProcessing: false,
              error: {
                type: "error",
                message: "Erreur lors du chargement des demandes d'adhésion : " + error.message
              }
            }
          
          });
  
        });
  
      }

    }

  }, [getCentreDemandeAdhesionWithUserInfoList, state.selectedCentre?.postulants, state.selectedCentre?.responsables, connectedUser])

  const onRegisterClick = useCallback(() => {

    if(connectedUser && connectedUser.uid && state.selectedCentre != null) {

      setState(prevState => {

        return {
          ...prevState,
          isProcessing: true,
        }
      
      });

      addDemandeAdhesion(connectedUser.uid, state.selectedCentre.uid).then((updatedCentre) => {

        updateSelectedCentre(updatedCentre);

        setState(prevState => {
          return {
            ...prevState,
            selectedCentre: {
              ...prevState.selectedCentre as CentreDeDistribution,
              postulants: updatedCentre.postulants
            },
            isProcessing: false
          }
        
        });

      }).catch((error) => {

        setState(prevState => {

          return {
            ...prevState,
            isProcessing: false,
            error: {
              type: "error",
              message: "Erreur lors de votre demande d'adhésion : " + error.message
            }
          }
        
        });

      })

    }

  }, [connectedUser, state.selectedCentre, addDemandeAdhesion, updateSelectedCentre]);


  const saveAcceptAdhesion = useCallback((user: User) => {

    if(state.selectedCentre != null) {

      setState(prevState => {
        return {
          ...prevState,
          isProcessing: true
        }
      })

      addUserToCentre(user.uid, state.selectedCentre.uid).then((updatedCentre) => {

        updateSelectedCentre(updatedCentre);
        setState(prevState => {
          return {
            ...prevState,
            isProcessing: false,
            selectedCentre: {
              ...prevState.selectedCentre as CentreDeDistribution,
              participants: updatedCentre.participants,
              postulants: updatedCentre.postulants,
            }
          }
        })

      }).catch((error) => {

        setState(prevState => {
          return {
            ...prevState,
            isProcessing: false,
            error: {
              type: "error",
              message: "Erreur lors de l'acceptation d'une demande d'adhésion : " + error.message
            }
          }
        })

      });
      

    }


    
  }, [state.selectedCentre, updateSelectedCentre, addUserToCentre]);


  const saveDeclineAdhesion = useCallback((user: User) => {

    if(state.selectedCentre != null) {

      setState(prevState => {
        return {
          ...prevState,
          isProcessing: true
        }
      })

      deleteDemandeAdhesion(user.uid, state.selectedCentre.uid).then((updatedCentre) => {

        updateSelectedCentre(updatedCentre);
        setState(prevState => {
          return {
            ...prevState,
            isProcessing: false,
            selectedCentre: {
              ...prevState.selectedCentre as CentreDeDistribution,
              postulants: updatedCentre.postulants,
            }
          }
        })

      }).catch((error) => {

        setState(prevState => {
          return {
            ...prevState,
            isProcessing: false,
            error: {
              type: "error",
              message: "Erreur lors de l'acceptation d'une demande d'adhésion : " + error.message
            }
          }
        })

      });
      

    }
    

  }, [state.selectedCentre, deleteDemandeAdhesion, updateSelectedCentre]);

  const onSaveCentreDesc = useCallback((descValue : string) => {

    if(state.selectedCentre != null) {
      
      setState(prevState => {

        return {
          ...prevState,
          isProcessing: true
        }
      
      });

      updateCentreInformation(state.selectedCentre.uid, descValue).then((newCentre) => {
  
        updateSelectedCentre(newCentre);

        setState(prevState => {

          return {
            ...prevState,
            selectedCentre: {
              ...prevState.selectedCentre as CentreDeDistribution,
              informations: newCentre.informations
            },
            isProcessing: false
          }
        
        });
  
      }).catch((error) => {

        setState(prevState => {

          return {
            ...prevState,
            isProcessing: false,
            error: {
              type: "error",
              message: "Erreur lors de la mise à jour de la description de la distribution : " + error.message
            }
          }
        
        });
  
      })
    }
    

  }, [state.selectedCentre, updateCentreInformation, updateSelectedCentre]);

  return {
    state,
    setState,
    onRegisterClick,
    saveDeclineAdhesion,
    saveAcceptAdhesion,
    onSaveCentreDesc
  }

}

export default useCentreForm;