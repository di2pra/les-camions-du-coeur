import React, {FC} from 'react';
import { IPlanning } from './../../types';



interface Props {
  distribution: {isProcessing: boolean; data: IPlanning}
}

const CardFooter: FC<Props> = ({distribution}) => {

  if(distribution.isProcessing || distribution.data.participants.length === 0) {
    return (null)
  } else {
    return (
    <div className="planning-card-footer">
      <div className="kpi-container">
        <h2># Participants</h2>
        <h1>{distribution.data.participants.length}</h1>
      </div>
    </div>
  )
  }
}

export default CardFooter;