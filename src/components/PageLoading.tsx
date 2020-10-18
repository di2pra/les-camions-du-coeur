import React, {FC} from 'react';
import { LoadingIcon } from './Icons';

const PageLoading: FC<{}> = () => {

  return (
    <div id="loading-page" className="container-fluid">
      <div className="loading-container">
        <LoadingIcon/>
      </div>
    </div>
  )
  
}


export default PageLoading;