import React, { FC} from 'react';
import AlertBox from '../../../../components/AlertBox';
import { MemberWithUserInfo } from '../../../User/types';
import { IPlanning } from '../../types';
import { Error } from '../../../../types/Error';
import { LoadingIcon } from '../../../../components/Icons';
import UserList from '../../../User/components/UserList';
import { CentreDeDistribution } from '../../../Distribution/types';


interface Props {
  distribution: {isProcessing: boolean; data: IPlanning}, 
  participantList: MemberWithUserInfo[], 
  centre: CentreDeDistribution,
  error: Error | null
}

const CardBody: FC<Props> = ({distribution, participantList, centre, error}) => {

  let bodyContent = null;
  let progressBarContent = null;

  if(error !== null) {

    bodyContent = (<AlertBox error={error}/>);

  } else if(distribution.isProcessing) {

    bodyContent = (<div className="loading-container">
      <LoadingIcon/>
    </div>);

  } else {

    const percentage = centre.benevoles == null ? 0 : Math.min(Math.round(participantList.length / centre.benevoles * 100), 100);

    progressBarContent = (<div className="progress-bar-container">
      <div className="progress">
        <div className="progress-bar" role="progressbar" style={{'width' : percentage + '%'}}>{percentage}%</div>
      </div>
    </div>
    );

    if(distribution.data.participants.length === 0) {

      bodyContent = (<h3 className="message">Aucun Participant</h3>);
  
    } else {
      bodyContent = (<UserList users={participantList}/>);
    }

  }

  return (<div className="planning-card-body">
    {progressBarContent}
    {bodyContent}
    </div>);

}

export default CardBody;