import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory } from "react-router-dom";

import PageLoading from "../../components/PageLoading";
import AlertBox from "../../components/AlertBox";
import useFirestore from "../../hooks/useFirestore";

import DistributionCard from "./components/DistributionCard";
import CentreItem from "./components/CentreItem";
import { CentreDeDistribution } from "./types";
import { useSystemAlert } from "../../components/AlertBox/useSystemAlert";


interface Params {
  nom: string;
  jour: string;
}

type Props = {}

const Distribution: FC<Props> = () => {
  const { nom, jour } = useParams<Params>();
  const history = useHistory();

  const {systemAlert, setError} = useSystemAlert();
  const [centreList, setCentreList] = useState<{
    isProcessing: boolean | null;
    data: CentreDeDistribution[];
  }>({
    isProcessing: null,
    data: [],
  });
  const [
    selectedCentre,
    setSelectedCentre,
  ] = useState<CentreDeDistribution | null>(null);

  const { getCentreList } = useFirestore();

  useEffect(() => {
    let isCancelled = false;

    setCentreList((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: [],
      };
    });

    getCentreList()
      .then((centres) => {
        if (!isCancelled)
          setCentreList((prevState) => {
            return {
              ...prevState,
              isProcessing: false,
              data: centres,
            };
          });
      })
      .catch((error) => {
        if (!isCancelled)
          setError("Erreur lors du chargement de la liste des distributions : " + error.message);
      });

    return () => {
      isCancelled = true;
    };
  }, [getCentreList, setError]);

  useEffect(() => {
    if (centreList.isProcessing === true) {
      return;
    }
    if (jour == null || nom == null) {
      setSelectedCentre(null);
    } else {
      const selectedCentre = centreList.data.find((centre) => {
        return centre.nom === nom && centre.jour === jour;
      });

      if (selectedCentre == null) {
        history.push("/distribution");
      } else {
        setSelectedCentre(selectedCentre);
      }
    }
  }, [jour, nom, history, centreList]);

  if (systemAlert !== null) {
    return (
      <div className="container-fluid container-80">
        <AlertBox systemAlert={systemAlert} />
      </div>
    );
  }

  if (centreList.isProcessing === true) {
    return <PageLoading />;
  }

  if (selectedCentre == null) {
    return (
      <div className="container-fluid">
        <div className="home-card-container">
          {centreList.data.map((centre) => (
            <CentreItem key={centre.uid} centre={centre} />
          ))}
        </div>
      </div>
    );
  }

  return <DistributionCard centre={selectedCentre} />;
};

export default Distribution;
