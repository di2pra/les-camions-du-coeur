import React, { useState, useEffect, FC } from "react";
import { useParams, useHistory } from "react-router-dom";

import PageLoading from "../../components/PageLoading";
import AlertBox from "../../components/AlertBox";
import useFirestore from "../../hooks/useFirestore";
import { Error } from "../../types/Error";


import CentreItem from "./components/CentreItem";
import { CentreDeDistribution } from "./types";
import DistributionCard from "./components/DistributionCard";

interface ParamTypes {
  nom: string;
  jour: string;
}

const Distribution: FC<{}> = () => {
  const { nom, jour } = useParams<ParamTypes>();
  const history = useHistory();

  const [error, setError] = useState<Error | null>(null);
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

    setCentreList({
      isProcessing: true,
      data: []
    });

    getCentreList()
      .then((centres) => {
        if (!isCancelled)
          setCentreList({
            isProcessing: false,
            data: centres
          });
      })
      .catch((error) => {
        if (!isCancelled)
          setError({
            type: "error",
            message:
              "Erreur lors du chargement de la liste des distributions : " +
              error.message,
          });
      });

    return () => {
      isCancelled = true;
    };
  }, [getCentreList]);

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

  if (error !== null) {
    return (
      <div className="container-fluid container-80">
        <AlertBox error={error} />
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
