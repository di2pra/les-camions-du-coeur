import React, { FC, memo } from 'react';
import { DemandeAdhesionWithUserInfo } from '../../types';


interface Props {
  demandeAdhesionList: DemandeAdhesionWithUserInfo[];
  saveAcceptAdhesion: (adhesion: DemandeAdhesionWithUserInfo) => void;
  saveDeclineAdhesion: (adhesion: DemandeAdhesionWithUserInfo) => void;
  isConnectedUserResponsable: boolean;
}

const DemandeAdhesionSection : FC<Props> = ({
  demandeAdhesionList,
  saveAcceptAdhesion,
  saveDeclineAdhesion,
  isConnectedUserResponsable
}) => {

  if(!isConnectedUserResponsable) {
    return null;
  }

  if(demandeAdhesionList.length === 0) {
    return (
      <section>
        <h1>Demande(s) d&apos;adhésion</h1>
        <p>Aucune demande d&apos;adhésion</p>
      </section>
    );
  }

  return(
    <section>
      <h1>Demande(s) d&apos;adhésion</h1>
      <ul className="demande-adhesion-list">
        {
          demandeAdhesionList.map((adhesion, index) => {

            return (
              <li key={index}>
                <div className="user-profile-pic" style={{backgroundImage: `url(${adhesion.profil_pic === '' ? process.env.PUBLIC_URL + '/img/profile.png' : adhesion.profil_pic } )`}} ></div>
                <p>{adhesion.prenom} {adhesion.nom}</p>
                <div className="buttons-container">
                  <button onClick={(e) => { e.preventDefault(); saveAcceptAdhesion(adhesion);}} type="button" className="btn-animated primary">Accepter</button>
                  <button onClick={(e) => { e.preventDefault(); saveDeclineAdhesion(adhesion);}} type="button" className="btn-animated secondary">Refuser</button>
                </div>
              </li>
            );

          })
        }
      </ul>
    </section>
  );
};


export default memo(DemandeAdhesionSection);