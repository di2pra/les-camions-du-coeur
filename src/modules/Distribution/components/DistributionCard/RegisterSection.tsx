import React, { FC, memo } from 'react';
import {DemandeAdhesion} from "../../types";
import {User} from "../../../User/types";
import AlertBox from '../../../../components/AlertBox';



interface Props {
  connectedUser: User | null;
  onRegisterClick: () => void;
  adhesion: DemandeAdhesion | null;
  isConnectedUserMember: boolean;
}

const RegisterSection : FC<Props> = ({connectedUser, onRegisterClick, adhesion, isConnectedUserMember}) => {

  if(!connectedUser) {
    return null;
  }

  if(isConnectedUserMember) {
    return null;
  }

  if(adhesion && adhesion.utilisateur === connectedUser.uid) {
    return <AlertBox error={{type: "info", message: "Votre demande d'adhésion pour cette distribution est en attente de validation par un responsable."}} />;
  }

  return(
      <section className="register-banner" >
        <div className="buttons-container">
          <button type="button" className="btn-animated primary" onClick={(e) => { e.preventDefault(); onRegisterClick();}}>Adhérer à cette distribution</button>
        </div>
      </section>
    );
};

export default memo(RegisterSection);