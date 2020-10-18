import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  FC,
  useMemo,
} from "react";

import { firestore } from "../../../../Firebase";
import PageLoading from "../../../../components/PageLoading";
import { UserContext, ConnectedUser } from "../../../../providers/UserProvider";
import AlertBox from "../../../../components/AlertBox";
import DistributionDetailSection from "../DistributionDetailsSection";
import useFirestore from "../../../../hooks/useFirestore";
import RegisterBanner from "../RegisterBanner";
import DemandeAdhesion from "../DemandeAdhesion";
import ResponsableSection from "../ResponsableSection";
import ParticipantSection from "../ParticipantSection";
import { MemberDetails, MemberType } from "../../../Membership/types";
import { CentreDeDistribution, DemandeAdhesionDetail } from "../../types";
import { useSystemAlert } from "../../../../components/AlertBox/useSystemAlert";

const getRoleInMemberList = (
  connectedUser: ConnectedUser,
  membres: MemberDetails[]
) => {
  const member = membres.find((membre) => membre.uid === connectedUser.uid);
  return {
    isMember: member !== undefined,
    isResponsable: member?.type === MemberType.RESPONSABLE,
  };
};

interface Props {
  centre: CentreDeDistribution;
}

const DistributionCard: FC<Props> = ({ centre }) => {
  const {
    getUserAdhesionDetails,
    getCentreDemandeAdhesionList,
    getCentreMembreList,
    updateCentre,
    createDemandeAdhesion,
    deleteDemandeAdhesion,
  } = useFirestore();

  const { connectedUser } = useContext(UserContext);

  const {systemAlert, setError} = useSystemAlert();
  const [isProcessing, setIsProcessing] = useState(true);
  const [selectedCentre, setSelectedCentre] = useState<CentreDeDistribution>(
    centre
  );
  const [centreMembreDetailsList, setCentreMembreDetailsList] = useState<
    MemberDetails[]
  >([]);
  const [
    centreDemandeAdhesionDetailsList,
    setCentreDemandeAdhesionDetailsList,
  ] = useState<DemandeAdhesionDetail[]>([]);
  const [
    connectedUserAdhesionDetails,
    setConnectedUserAdhesionDetails,
  ] = useState<DemandeAdhesionDetail | null>(null);

  const userRoleFromDetailsList = useMemo(
    () => getRoleInMemberList(connectedUser, centreMembreDetailsList),
    [connectedUser, centreMembreDetailsList]
  );

  useEffect(() => {
    let isCancelled = false;

    setIsProcessing(true);

    getCentreMembreList(centre.uid)
      .then((membreList) => {
        if (!isCancelled) {
          setCentreMembreDetailsList(membreList);
        }

        const userRole = getRoleInMemberList(connectedUser, membreList);

        if (userRole.isMember) {
          if (userRole.isResponsable) {
            getCentreDemandeAdhesionList(centre.uid)
              .then((demandeAdhesionList) => {
                if (!isCancelled) {
                  setCentreDemandeAdhesionDetailsList(demandeAdhesionList);
                  setIsProcessing(false);
                }
              })
              .catch((error) => {
                !isCancelled &&
                setError("Erreur lors du chagement des demandes d'adhésion : " + error.message);
              });
          } else {
            !isCancelled && setIsProcessing(false);
          }
        } else {
          getUserAdhesionDetails(centre.uid, connectedUser.uid)
            .then((adhesionData) => {
              if (!isCancelled) {
                setConnectedUserAdhesionDetails(adhesionData);
                setIsProcessing(false);
              }
            })
            .catch((error) => {
              !isCancelled &&
              setError(
                "Erreur lors du chagement des informations d'adhésion de l'utilisateur connectée : " + error.message
              );
            });
        }
      })
      .catch((error) => {
        !isCancelled &&
        setError("Erreur lors du chagement des membres : " + error.message);
      });

    return () => {
      isCancelled = true;
    };
  }, [
    connectedUser,
    centre.uid,
    getCentreMembreList,
    getCentreDemandeAdhesionList,
    getUserAdhesionDetails,
    setError
  ]);

  const onRegisterClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setIsProcessing(true);

      createDemandeAdhesion({
        centre: centre.uid,
        utilisateur: connectedUser.uid,
      })
        .then((demandeAdhesion) => {
          setConnectedUserAdhesionDetails(demandeAdhesion);
        })
        .catch((error) => {
          setError("Erreur lors de votre demande d'adhésion : " + error.message);
        })
        .finally(() => setIsProcessing(false));
    },
    [createDemandeAdhesion, connectedUser.uid, centre.uid,setError]
  );

  const saveAcceptAdhesion = useCallback(
    async (adhesion) => {
      // Get a new write batch
      const batch = firestore.batch();

      // Delete demandeAdhesion
      const demandeAdhesionRef = firestore
        .collection("demandeAdhesion")
        .doc(adhesion.uid);
      batch.delete(demandeAdhesionRef);

      // Update the centre with new user
      const membreRef = firestore
        .collection("centres")
        .doc(centre.uid)
        .collection("membres")
        .doc(adhesion.utilisateurUid);
      batch.set(membreRef, {
        utilisateur: adhesion.utilisateurUid,
        type: "membre",
      });

      setCentreMembreDetailsList((prevState) => {
        return {
          ...prevState,
          isProcessing: true,
        };
      });

      try {
        await batch.commit();

        getCentreMembreList(centre.uid).then((membreList) => {
          const userRole = getRoleInMemberList(connectedUser, membreList);
          if (userRole.isResponsable) {
            getCentreDemandeAdhesionList(centre.uid).then(() => {
              setCentreMembreDetailsList((prevState) => {
                return {
                  ...prevState,
                  isProcessing: false,
                  data: membreList,
                };
              });
            });
          } else {
            setCentreMembreDetailsList((prevState) => {
              return {
                ...prevState,
                isProcessing: false,
                data: membreList,
              };
            });
          }
        });
      } catch (error) {
        setError("Erreur lors de l'acceptation d'une demande d'adhésion : " + error.message);

        setCentreMembreDetailsList((prevState) => {
          return {
            ...prevState,
            isProcessing: false,
          };
        });
      }
    },
    [
      connectedUser,
      centre.uid,
      getCentreMembreList,
      getCentreDemandeAdhesionList,
      setError
    ]
  );

  const saveDeclineAdhesion = useCallback(
    async (adhesion) => {
      setIsProcessing(true);

      deleteDemandeAdhesion(adhesion.uid)
        .then(() => {
          if (!userRoleFromDetailsList.isResponsable) {
            return setIsProcessing(false);
          }

          getCentreDemandeAdhesionList(centre.uid)
            .then((demandeAdhesionList) =>
              setCentreDemandeAdhesionDetailsList(demandeAdhesionList)
            )
            .catch((error) => {
              setError("Erreur lors du refus d'une demande d'adhésion : " + error.message);
            })
            .finally(() => setIsProcessing(false));
        })
        .catch((error) => {
          setIsProcessing(false);
          setError("Erreur lors du refus d'une demande d'adhésion : " + error.message);
        });
    },
    [
      userRoleFromDetailsList,
      centre.uid,
      deleteDemandeAdhesion,
      getCentreDemandeAdhesionList,
      setError
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
          setError("Erreur lors de la mise à jour de la description de la distribution : " + error.message);
        })
        .finally(() => setIsProcessing(false));
    },
    [selectedCentre, updateCentre, setError]
  );

  if (systemAlert !== null) {
    return (
      <div id="distribution-details" className="container-fluid container-80">
        <AlertBox systemAlert={systemAlert} />
      </div>
    );
  }

  if (isProcessing) {
    return <PageLoading />;
  }

  return (
    <div id="distribution-details" className="container-fluid container-80">
      <RegisterBanner
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
      <section>
        <h1>Responsable(s)</h1>
        <ResponsableSection membres={centreMembreDetailsList} />
      </section>
      <section>
        <h1>Membre(s)</h1>
        <ParticipantSection membres={centreMembreDetailsList} />
      </section>
      <DemandeAdhesion
        saveDeclineAdhesion={saveDeclineAdhesion}
        saveAcceptAdhesion={saveAcceptAdhesion}
        demandeAdhesionList={centreDemandeAdhesionDetailsList}
        isConnectedUserResponsable={userRoleFromDetailsList.isResponsable}
      />
    </div>
  );
};

export default DistributionCard;
