import React, { FC } from 'react';
import {User} from "../../../User/types";
import AlertBox from '../../../../components/AlertBox';



interface Props {
  connectedUser: User | null;
  onRegisterClick: () => void;
  isConnectedUserMember: boolean;
  postulants: [string]
}

const RegisterSection : FC<Props> = ({postulants, connectedUser, onRegisterClick, isConnectedUserMember}) => {

  if(connectedUser) {
    if(isConnectedUserMember) {
      return null;
    } else if(postulants.includes(connectedUser.uid)) {
      return <AlertBox error={{type: "info", message: "Votre demande d'adhésion pour cette distribution est en attente de validation par un responsable."}} />
    } else {
      return(
        <section className="register-banner" >
          <div className="buttons-container">
            <button type="button" className="btn-animated primary" onClick={(e) => { e.preventDefault(); onRegisterClick();}}>Adhérer à cette distribution</button>
          </div>
        </section>
      )
    }
  } else {
    return null
  }

  
  
}

export default RegisterSection;