import React from 'react';
import { LoadingIcon } from './Icons';

function PageLoading () {

  return (
    <div id="loading-page" className="container-fluid">
      <div className="loading-container">
        <LoadingIcon/>
      </div>
    </div>
  )
  
}


export default PageLoading;