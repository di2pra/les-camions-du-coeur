import React, { FC} from 'react';
import { capitalize } from '../../../../components/Helpers';
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

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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

  let date = new Intl.DateTimeFormat('fr-FR', options).format(new Date(distribution.data.date))

  return(
    <div className="planning-card-header">
      <h5>{capitalize(centre.nom)} - {date}</h5>
      {button(distribution.isProcessing)}
    </div>
  )
  
}

export default CardHeader