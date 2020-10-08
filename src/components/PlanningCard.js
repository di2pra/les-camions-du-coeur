import React, { useState, useCallback } from 'react';
import { firestore, firebaseApp } from "../Firebase";
import {LoadingIcon} from './Icons';
import {capitalize} from '../components/Helpers';

function PlanningCard({distribution, connectedUser, centre, membres}) {

  const [distributionData, setDistributionData] = useState(distribution);
  const [isUpdating, setIsUpdating] = useState(false);


  const loadDistributionData = useCallback(async () => {

    try {

      let distributionId = distributionData.uid;

      const distribution = await firestore.collection("centres").doc(centre.uid).collection("distributions").doc(distributionId).get();

      setDistributionData({...distribution.data(), uid: distribution.id});
      
    } catch (error) {
      
    }

  }, [distributionData.uid, centre.uid]);

  const onUpdateClick = (event) => {

    event.preventDefault();

    setIsUpdating(true);
    updateDistribution().then(() => {
      loadDistributionData().then(() => {
        setIsUpdating(false);
      });
    });
    
    
  }

  const updateDistribution = useCallback(async () => {

    // if the user is already registered, then remove him
    if(((distributionData.participants || []).includes(connectedUser.uid))) {
      await firestore.collection("centres").doc(centre.uid).collection("distributions").doc(distribution.uid).update({
        participants: firebaseApp.firestore.FieldValue.arrayRemove(connectedUser.uid)
      });

    // else add him
    } else {
      await firestore.collection("centres").doc(centre.uid).collection("distributions").doc(distribution.uid).update({
        participants: firebaseApp.firestore.FieldValue.arrayUnion(connectedUser.uid)
      });
    }

  }, [distribution.uid, distributionData.participants, centre.uid, connectedUser.uid]);

  return(
    <div className="planning-card-container">
      <div className="planning-card">
        <CardHeader isUpdating={isUpdating} distributionData={distributionData} connectedUser={connectedUser} centre={centre} onUpdateClick={onUpdateClick} />
        <CardBody distributionData={distributionData} isUpdating={isUpdating} membres={membres} />
        <CardFooter distributionData={distributionData} isUpdating={isUpdating} membres={membres} />
      </div>
    </div>
  )
  
}

function UserBadge({user}) {

  if(typeof user == 'undefined') {
    return (
      <div className="planning-user">
        <div className="planning-user-image"><div className="planning-user-image-content" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/img/profile.png'} )`}}></div></div>
        <div className="planning-user-name"><p>Inconnu</p></div>
      </div>
    )
  } else {
    const name = (user.prenom && user.nom) ? (user.prenom + ' ' + user.nom.substring(0,1) + '.') : user.email;

    return (
      <div className="planning-user">
        <div className="planning-user-image"><div className="planning-user-image-content" style={{backgroundImage: `url(${user.profil_pic === '' ? process.env.PUBLIC_URL + '/img/profile.png' : user.profil_pic } )`}}></div></div>
        <div className="planning-user-name"><p>{name}</p></div>
      </div>
    )
  }

  

}

function CardHeader({distributionData, isUpdating, connectedUser, onUpdateClick, centre}) {

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  const button = (isUpdating) => {
    if(isUpdating) {
      return null
    } else {
      return (
        <div className="buttons-container">
          <button type="button" onClick={onUpdateClick} className="btn-animated tertiary">{((distributionData.participants || []).includes(connectedUser.uid) ? 'Annuler ma participation' : 'Participer à la distribution')}</button>
        </div>
      )
    }
  }

  let date = new Intl.DateTimeFormat('fr-FR', options).format(new Date(distributionData.date))

  return(
    <div className="planning-card-header">
      <h5>{capitalize(centre.nom)} - {date}</h5>
      {button(isUpdating)}
    </div>
  )
  
}


function CardBody({distributionData, membres, isUpdating}) {

  if(isUpdating) {
    return (
      <div className="planning-card-body">
        <div className="loading-container">
          <LoadingIcon/>
        </div>
      </div>
    )
  } else {
    return (
    <div className="planning-card-body">
      <UserListContent distributionData={distributionData} membres={membres} />
    </div>
  )
  }
}

function CardFooter({distributionData, membres, isUpdating}) {

  if(isUpdating || distributionData.participants.length === 0) {
    return (null)
  } else {
    return (
    <div className="planning-card-footer">
      <div className="kpi-container">
        <h2># Participants</h2>
        <h1>{distributionData.participants.length}</h1>
      </div>
    </div>
  )
  }
}

function UserListContent({distributionData, membres}) {

  if(distributionData.participants.length > 0) {

    return (
      <div className="user-list-container">
        {
          (distributionData.participants || []).map((participant) => {
  
            let user = membres.find(function(user) { 
              return user.uid === participant; 
            });

            return <UserBadge key={participant} user={user} />;

          })
        }
      </div>
    )

  } else {

    return(
      <h3 className="message">Aucun participant</h3>
    )

  }

}


export default PlanningCard;