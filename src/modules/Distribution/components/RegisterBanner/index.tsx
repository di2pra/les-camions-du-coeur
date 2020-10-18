import React, { FC, memo } from 'react';

import { ConnectedUser } from "../../../../providers/UserProvider";
import AlertBox from '../../../../components/AlertBox';
import { DemandeAdhesionDetail } from '../../../../modules/Distribution/types';

interface Props {
  connectedUser: ConnectedUser,
  onRegisterClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  adhesion: DemandeAdhesionDetail | null,
  isConnectedUserMember: boolean
}

const RegisterBanner: FC<Props> = ({ connectedUser, onRegisterClick, adhesion, isConnectedUserMember }) => {
  if (isConnectedUserMember) {
    return null;
  }

  if (adhesion !== null && adhesion.utilisateur === connectedUser.uid) {
    return <AlertBox error={{ type: "info", message: "Votre demande d'adhésion pour cette distribution est en attente de validation par un responsable." }} />;
  }

  return (
    <section className="register-banner">
      <div className="buttons-container">
        <button type="button" className="btn-animated primary" onClick={onRegisterClick}>Adhérer à cette distribution</button>
      </div>
    </section>
  );
};

export default memo(RegisterBanner);
