import React, { FC} from 'react';
import { capitalize } from '../../../../components/Helpers';
import { PeopleIcon } from '../../../../components/Icons';
import { CentreDeDistribution } from '../../../Distribution/types';
import { User } from '../../../User/types';
import { IPlanning } from '../../types';


interface Props {
  distribution: {isProcessing: boolean; data: IPlanning}, 
  connectedUser: User, 
  onUpdateClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void, 
  centre: CentreDeDistribution
}

const CardHeader : FC<Props> = ({distribution, connectedUser, onUpdateClick, centre}) => {

  //const options  = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  const button: (isUpdating: boolean) => any = (isUpdating) => {
    if(isUpdating) {
      return null
    } else {
      return (
        <div className="buttons-container">
          <button type="button" onClick={onUpdateClick} className="btn-animated tertiary">{(distribution.data.participants.includes(connectedUser.uid) ? 'Annuler ma participation' : 'Participer à la distribution')}</button>
        </div>
      )
    }
  }

  const date = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(distribution.data.date));

  const nbrParticipants = distribution.data.participants.length;

  return(
    <div className="planning-card-header">
      <div className="header-title">
        <h4>{capitalize(centre.nom)} - {date}</h4>
        <div className="header-sub-title">
          <i><PeopleIcon /></i>
          <h5>{nbrParticipants} {(nbrParticipants <=1) ? 'participant' : 'participants'}</h5>
        </div>
      </div>
      
      {button(distribution.isProcessing)}
    </div>
  )
  
}

export default CardHeader