import React, { useState, useCallback, useEffect, FC } from 'react';
import useFirestore from '../../../../hooks/useFirestore';
import { IPlanning } from '../../types';
import { CentreDeDistribution } from '../../../Distribution/types';
import { MemberWithUserInfo, User } from '../../../User/types';
import { Error } from '../../../../types/Error';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';
import useIsMounted from '../../../../components/IsMounted';

interface Props {
  planning: IPlanning, 
  connectedUser: User, 
  centre: CentreDeDistribution, 
  membres: MemberWithUserInfo[]
}

const PlanningCard : FC<Props> = ({planning, connectedUser, centre, membres}) => {

  const isMounted = useIsMounted();
  const [error, setError] = useState<Error | null>(null);
  const [distribution, setDistributionData] = useState<{isProcessing: boolean; data: IPlanning}>({isProcessing: false, data: planning});
  const [participantList, setParticipantList] = useState<MemberWithUserInfo[]>([]);

  const {updatePlanningParticipant} = useFirestore();

  const onUpdateClick = useCallback((event) => {

    event.preventDefault();

    setDistributionData((prevState) => {
      return {
        ...prevState,
        isProcessing: true
      }
    });

    updatePlanningParticipant(connectedUser.uid, distribution.data.uid, distribution.data.participants).then((distribution) => {

      if(isMounted.current) setDistributionData((prevState) => {
        return {
          ...prevState,
          isProcessing: false,
          data: distribution
        }
      });

    }).catch((error) => {

      setError({
        type: "error",
        message: "Erreur lors de la mise à jour de la distribution : " + error.message
      });

    });
    
  }, [updatePlanningParticipant, isMounted, connectedUser.uid, distribution.data.uid, distribution.data.participants]);


  useEffect(() => {

    let participantDetails = distribution.data.participants.map((participant) => {
  
      return membres.find(function(user) { 
        return user.uid === participant; 
      });

    }) as MemberWithUserInfo[];

    setParticipantList(participantDetails);

  }, [distribution.data, membres])




  return(
    <div className="planning-card-container">
      <div className="planning-card">
        <CardHeader distribution={distribution} connectedUser={connectedUser} centre={centre} onUpdateClick={onUpdateClick} />
        <CardBody distribution={distribution} centre={centre} participantList={participantList} error={error} />
        <CardFooter distribution={distribution}/>
      </div>
    </div>
  )
  
}




export default PlanningCard;