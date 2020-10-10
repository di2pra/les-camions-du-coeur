import React from 'react';

function AlertBox({error}) {

  const types = ["error", "success", "warning", "info"]

  if(error == null || error.type === "" || error.message === "") {
      return null;
  } else {
    
    if(types.includes(error.type)) {
      return(
        <div className="alert-container">
          <div className={'alert alert-' + error.type}>{error.message}</div>
        </div>
      )
    } else {
      return null;
    }
  }

}

export default AlertBox;