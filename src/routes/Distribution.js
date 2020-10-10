import React, { useCallback, useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { firestore } from "../Firebase";
import PageLoading from '../components/PageLoading';
import {PinIcon, CalendarIcon} from '../components/Icons';
import {capitalize} from '../components/Helpers';
import DistributionCard from '../components/DistributionCard';
import AlertBox from '../components/AlertBox';

function Distribution() {


  let { nom, jour } = useParams();
  const history = useHistory();

  const [error, setError] = useState(null);
  const [centreList, setCentreList] = useState({isProcessing: null, data: []});
  const [selectedCentre, setSelectedCentre] = useState(null);

  const loadCentreList = useCallback(async () => {

    setCentreList((prevState) => {
      return {
        ...prevState,
        isProcessing: true,
        data: []
      }
    });

    let centres = [];

    try {

      const centresRef = await firestore.collection("centres").get();

      centres = centresRef.docs.map((doc) => {
        return ({...doc.data(), uid: doc.id});
      });
      

    } catch (error) {

      setError({
        type: "error",
        message: "Erreur lors du chargement de la liste des distributions : " + error.message
      })

    }

    setCentreList((prevState) => {
      return {
        ...prevState,
        isProcessing: false,
        data: centres
      }
    })

  }, []);

  useEffect(() => {

    if(centreList.isProcessing == null) {
      loadCentreList(); 
    }

    if((jour == null || nom === null)) {
      setSelectedCentre(null);
    } else {
      if(centreList.isProcessing === false) {

        let selectedCentre = centreList.data.find((centre) => {
          return centre.nom === nom && centre.jour === jour
        });
  
        if(selectedCentre == null) {
          history.push("/distribution");
        } else {
          setSelectedCentre(selectedCentre);
        }
      }
      
    }

  }, [jour, nom, history, centreList, selectedCentre, loadCentreList]);


  if(centreList.isProcessing === true) {
    return <PageLoading />;
  } else if(error !== null) {
    return (
      <div className="container-fluid container-80">
        <AlertBox error={error} />
      </div>
    )
  } else if(selectedCentre == null) {

    return (
      <div className="container-fluid">
        <div className="home-card-container">
          {
            centreList.data.map((centre) => {
              return (<CentreItem key={centre.uid} centre={centre} />)
            })
          }
        </div>
      </div>
    )

  } else if(selectedCentre !== null) {
    return <DistributionCard centre={selectedCentre}/>;
  } else {
    return null
  }

}

function CentreItem({centre}) {

  return (
    <Link className="home-card-link" to={'/distribution/' + centre.nom + '/' + centre.jour}>
      <div className="home-card">
        <div className="home-card-body">
          <div className="flex-middle"><i><PinIcon /></i><h3>{capitalize(centre.nom)}</h3></div>
          <div className="flex-middle"><i><CalendarIcon /></i><h3>le {centre.jour}</h3></div>
          <p className="card-text">Voir les informations concernant cette distribution</p>
        </div>
      </div>
    </Link>
  )
}




export default Distribution;