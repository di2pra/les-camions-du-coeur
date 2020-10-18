import React, { FC } from 'react';


const AppLoading:FC<{}> = () => {
  return (
  <div className="pageLoading position-fixed align-middle text-center">
    <h2>Chargement...</h2><br />
    <div className="spinner-border text-danger" role="status" aria-hidden="true"></div>
  </div>
  );
}


export default AppLoading;