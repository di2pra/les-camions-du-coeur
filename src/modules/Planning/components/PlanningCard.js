import React, { useState, useCallback, useEffect } from 'react';
import {capitalize} from '../../../components/Helpers';
import UserList from '../../User/components/UserList';
import AlertBox from '../../../components/AlertBox';
import useFirestore from '../../../hooks/useFirestore';
import {LoadingIcon} from '../../../components/Icons';
import { useSystemAlert } from '../../../components/AlertBox/useSystemAlert';

function CardHeader({distribution, connectedUser, onUpdateClick, centre}) {

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const button = (isUpdating) => {
    if(isUpdating) {
      return null;
    } else {
      return (
        <div className="buttons-container">
          <button type="button" onClick={onUpdateClick} className="btn-animated tertiary">{((distribution.data.participants || []).includes(connectedUser.uid) ? 'Annuler ma participation' : 'Participer à la distribution')}</button>
        </div>
      );
    }
  };

  const date = new Intl.DateTimeFormat('fr-FR', options).format(new Date(distribution.data.date));

  return(
    <div className="planning-card-header">
      <h5>{capitalize(centre.nom)} - {date}</h5>
      {button(distribution.isProcessing)}
    </div>
  );

}


function CardBody({distribution, participantList, error}) {

  if(error !== null) {
    return (
      <div className="planning-card-body">
        <AlertBox systemAlert={error}/>
      </div>
    );
  } else if(distribution.isProcessing) {
    return (
      <div className="planning-card-body">
        <div className="loading-container">
          <LoadingIcon/>
        </div>
      </div>
    );
  } else if(distribution.data.participants.length === 0) {
    return(
      <div className="planning-card-body">
        <h3>Aucun Participant</h3>
      </div>
    );
  } else {
    return (
    <div className="planning-card-body">
      <UserList users={participantList}/>
    </div>
    );
  }
}

function CardFooter({distribution}) {

  if(distribution.isProcessing || distribution.data.participants.length === 0) {
    return (null);
  } else {
    return (
    <div className="planning-card-footer">
      <div className="kpi-container">
        <h2># Participants</h2>
        <h1>{distribution.data.participants.length}</h1>
      </div>
    </div>
  );
  }
}

function PlanningCard({planning, connectedUser, centre, membres}) {

  const {systemAlert, setError} = useSystemAlert();
  const [distribution, setDistributionData] = useState({isProcessing: false, data: planning});
  const [participantList, setParticipantList] = useState([]);

  const {updateDistributionParticipant} = useFirestore();

  const onUpdateClick = useCallback((event) => {

    event.preventDefault();

    setDistributionData((prevState) => {
      return {
        ...prevState,
        isProcessing: true
      };
    });

    updateDistributionParticipant(
      centre.uid,
      connectedUser.uid,
      distribution.data.uid,
      distribution.data.participants
    ).then((distribution) => {

      setDistributionData((prevState) => {
        return {
          ...prevState,
          isProcessing: false,
          data: distribution
        };
      });

    }).catch((error) => {

      setError("Erreur lors de la mise à jour de la distribution : " + error.message);

    });

  }, [
    updateDistributionParticipant,
    centre.uid,
    connectedUser.uid,
    distribution.data.uid,
    distribution.data.participants,
    setError
  ]);


  useEffect(() => {

    const participantDetails = (distribution.data.participants || []).map((participant) => {

      return membres.find(function(user) {
        return user.uid === participant;
      });

    });

    setParticipantList(participantDetails);

  }, [distribution.data, membres]);




  return(
    <div className="planning-card-container">
      <div className="planning-card">
        <CardHeader
          distribution={distribution}
          connectedUser={connectedUser}
          centre={centre}
          onUpdateClick={onUpdateClick}
        />
        <CardBody distribution={distribution} participantList={participantList} error={systemAlert} />
        <CardFooter distribution={distribution}/>
      </div>
    </div>
  );

}

export default PlanningCard;