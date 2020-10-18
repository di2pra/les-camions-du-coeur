import React, { FC} from 'react';
import AlertBox from '../../../../components/AlertBox';
import { MemberWithUserInfo } from '../../../User/types';
import { IPlanning } from '../../types';
import { Error } from '../../../../types/Error';
import { LoadingIcon } from '../../../../components/Icons';
import UserList from '../../../User/components/UserList';


interface Props {
  distribution: {isProcessing: boolean; data: IPlanning}, 
  participantList: MemberWithUserInfo[], 
  error: Error | null
}

const CardBody: FC<Props> = ({distribution, participantList, error}) => {

  if(error !== null) {
    return (
      <div className="planning-card-body">
        <AlertBox error={error}/>
      </div>
    )
  } else if(distribution.isProcessing) {
    return (
      <div className="planning-card-body">
        <div className="loading-container">
          <LoadingIcon/>
        </div>
      </div>
    )
  } else if(distribution.data.participants.length === 0) {
    return(
      <div className="planning-card-body">
        <h3>Aucun Participant</h3>
      </div>
    )
  } else {
    return (
    <div className="planning-card-body">
      <UserList users={participantList}/>
    </div>
    )
  }
}

export default CardBody;