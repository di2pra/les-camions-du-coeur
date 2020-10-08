import React from 'react';

function AlertBox({type, message}) {

  const types = ["error", "success", "warning", "info"]

    if(message === "") {
        return null;
    } else {

      if(types.includes(type)) {
        return(
          <div className="alert-container">
            <div className={'alert alert-' + type}>{message}</div>
          </div>
        )
      }

      /*if(type==="error") {
        return (
          <div className="alert-container">
            <div className="alert alert-danger">{message}</div>
          </div>
        );
      } else if(type==="success") {
        return (
          <div className="alert-container">
            <div className="alert alert-success">{message}</div>
          </div>
        );
      } else if(type==="warning") {
        return (
          <div className="alert-container">
            <div className="alert alert-warning">{message}</div>
          </div>
        );
      } else {
        return null;
      }*/
    }

}

export default AlertBox;