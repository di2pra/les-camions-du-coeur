import React, { useState, useCallback, useEffect, useContext, FC, useMemo } from 'react';

import { firestore } from "../../../../Firebase";
import PageLoading from '../../../../components/PageLoading';
import {UserContext} from "../../../../providers/UserProvider";
import AlertBox from '../../../../components/AlertBox';
import DistributionDetailSection from './DistributionDetailsSection';
import useFirestore from '../../../../hooks/useFirestore';
import { Error } from '../../../../types/Error';
import {
  CentreDeDistribution,
  DemandeAdhesion,
  DemandeAdhesionWithUserInfo
} from "../../types";

import {MemberWithUserInfo, User} from "../../../User/types";
import RegisterSection from './RegisterSection';
import DemandeAdhesionSection from './DemandeAdhesionSection';
import ResponsableSection from './ResponsableSection';
import MembreSection from './MembreSection';

import { MemberType } from "../../../Membership/types";

const getRoleInMemberList = (
  connectedUser: User | null,
  membres: MemberWithUserInfo[]
) => {
  const member = membres.find((membre) => membre.uid === connectedUser?.uid);
  return {
    isMember: member !== undefined,
    isResponsable: member?.type === MemberType.RESPONSABLE,
  };
};

interface Props {
  centre: CentreDeDistribution;
}

const DistributionCard: FC<Props> = ({centre}) => {
  const {
    getUserDemandeAdhesion,
    getCentreDemandeAdhesionWithUserInfoList,
    getCentreMembreList,
    updateCentre,
    createDemandeAdhesion,
    deleteDemandeAdhesion
  } = useFirestore();

  const {connectedUser} = useContext(UserContext);

  const [error, setError] = useState<Error | null>(null);
  const [isProcessing, setIsProcessing] = useState<Boolean>(true);
  const [selectedCentre, setSelectedCentre] = useState<CentreDeDistribution>(centre);
  const [centreMembreDetailsList, setCentreMembreDetailsList] = useState<MemberWithUserInfo[]>([]);
  const [
    centreDemandeAdhesionDetailsList,
    setCentreDemandeAdhesionDetailsList
  ] = useState<DemandeAdhesionWithUserInfo[]>([]);
  const [connectedUserAdhesionDetails, setConnectedUserAdhesionDetails] = useState<DemandeAdhesion | null>(null);

  const userRoleFromDetailsList = useMemo(
    () => getRoleInMemberList(connectedUser, centreMembreDetailsList),
    [connectedUser, centreMembreDetailsList]
  );

  useEffect(
    () => {
      let isCancelled = false;

      setIsProcessing(true);

      getCentreMembreList(centre.uid).then((membreList) => {

        if(!isCancelled) setCentreMembreDetailsList(membreList);

        const userRole = getRoleInMemberList(connectedUser, membreList);

        if(userRole.isMember) {

          if(userRole.isResponsable) {

            getCentreDemandeAdhesionWithUserInfoList(centre.uid).then((demandeAdhesionList) => {

              if (!isCancelled) {
                setCentreDemandeAdhesionDetailsList(demandeAdhesionList);
                setIsProcessing(false);
              }

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

          if(connectedUser && connectedUser.uid) {
            getUserDemandeAdhesion(centre.uid, connectedUser.uid).then((adhesionData) => {

              if (!isCancelled) {
                setConnectedUserAdhesionDetails(adhesionData);
                setIsProcessing(false);
              }

            }).catch((error) => {

              if(!isCancelled) setError({
                type: "error",
                message: "Erreur lors du chagement des informations d'adhésion de l'utilisateur connectée : " + error.message
              });

            });
          }

        }


      }).catch((error) => {

        if(!isCancelled) setError({
          type: "error",
          message: "Erreur lors du chagement des membres : " + error.message
        });

      });

      return () => {
        isCancelled = true;
      };
    },
    [connectedUser, centre.uid, getCentreMembreList, getCentreDemandeAdhesionWithUserInfoList, getUserDemandeAdhesion]
  );


  const onRegisterClick = useCallback(
    () => {

    if(connectedUser && connectedUser.uid) {

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
      .finally(() => setIsProcessing(false));
    }

  }, [createDemandeAdhesion, connectedUser, centre.uid]);

  const saveAcceptAdhesion = useCallback(
    async (adhesion: DemandeAdhesionWithUserInfo) => {
      // Get a new write batch
      const batch = firestore.batch();

      // Delete demandeAdhesion
      const demandeAdhesionRef = firestore
        .collection("demandeAdhesion")
        .doc(adhesion.demandeAdhesionUid);
      batch.delete(demandeAdhesionRef);

      // Update the centre with new user
      const membreRef = firestore
        .collection("centres")
        .doc(centre.uid)
        .collection("membres")
        .doc(adhesion.uid);
      batch.set(membreRef, {
        utilisateur: adhesion.uid,
        type: "membre",
      });

      setIsProcessing(true);

      try {
        await batch.commit();

        getCentreMembreList(centre.uid).then((membreList) => {
          const userRole = getRoleInMemberList(connectedUser, membreList);
          if (userRole.isResponsable) {
            getCentreDemandeAdhesionWithUserInfoList(centre.uid).then((demandeAdhesionList) => {
              setCentreMembreDetailsList(membreList);
              setCentreDemandeAdhesionDetailsList(demandeAdhesionList);
              setIsProcessing(false);
            });
          } else {
            setCentreMembreDetailsList(membreList);
            setIsProcessing(false);
          }
        });
      } catch (error) {
        setError({
          type: "error",
          message:
            "Erreur lors de l'acceptation d'une demande d'adhésion : " +
            error.message,
        });

        setIsProcessing(false);
      }
    },
    [
      connectedUser,
      centre.uid,
      getCentreMembreList,
      getCentreDemandeAdhesionWithUserInfoList,
    ]
  );

  const saveDeclineAdhesion = useCallback(
    (adhesion: DemandeAdhesionWithUserInfo) => {
      setIsProcessing(true);

      deleteDemandeAdhesion(adhesion.uid)
        .then(() => {
          if (!userRoleFromDetailsList.isResponsable) {
            return setIsProcessing(false);
          }

          getCentreDemandeAdhesionWithUserInfoList(centre.uid)
            .then((demandeAdhesionList) =>
              setCentreDemandeAdhesionDetailsList(demandeAdhesionList)
            )
            .catch((error) => {
              setError({
                type: "error",
                message:
                  "Erreur lors du refus d'une demande d'adhésion : " +
                  error.message,
              });
            })
            .finally(() => setIsProcessing(false));
        })
        .catch((error) => {
          setIsProcessing(false);
          setError({
            type: "error",
            message:
              "Erreur lors du refus d'une demande d'adhésion : " +
              error.message,
          });
        });
    },
    [
      userRoleFromDetailsList,
      centre.uid,
      deleteDemandeAdhesion,
      getCentreDemandeAdhesionWithUserInfoList,
    ]
  );

  const onSaveCentreDesc = useCallback(
    (descValue) => {
      setIsProcessing(true);

      updateCentre({ ...selectedCentre, informations: descValue })
        .then((newCentre) => {
          setSelectedCentre(newCentre);
        })
        .catch((error) => {
          setError({
            type: "error",
            message:
              "Erreur lors de la mise à jour de la description de la distribution : " +
              error.message,
          });
        })
        .finally(() => setIsProcessing(false));
    },
    [selectedCentre, updateCentre]
  );


  if(error !== null) {
    return (
      <div id="distribution-details" className="container-fluid container-80">
        <AlertBox error={error} />
      </div>
    );
  }

  if (isProcessing) {
    return <PageLoading />;
  }

  return (
    <div id="distribution-details" className="container-fluid container-80">
      <RegisterSection
        adhesion={connectedUserAdhesionDetails}
        connectedUser={connectedUser}
        onRegisterClick={onRegisterClick}
        isConnectedUserMember={userRoleFromDetailsList.isMember}
      />
      <DistributionDetailSection
        centre={selectedCentre}
        isConnectedUserResponsable={userRoleFromDetailsList.isResponsable}
        onSaveCentreDesc={onSaveCentreDesc}
      />
      <ResponsableSection membres={centreMembreDetailsList} />
      <MembreSection membres={centreMembreDetailsList} />
      <DemandeAdhesionSection
        saveDeclineAdhesion={saveDeclineAdhesion}
        saveAcceptAdhesion={saveAcceptAdhesion}
        demandeAdhesionList={centreDemandeAdhesionDetailsList}
        isConnectedUserResponsable={userRoleFromDetailsList.isResponsable}
      />
    </div>
  );
};

export default DistributionCard;
