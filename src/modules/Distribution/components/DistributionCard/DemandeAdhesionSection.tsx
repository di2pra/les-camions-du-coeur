import React, { FC } from 'react';
import { User } from "../../../../modules/User/types";

interface Props {
  centreDemandeAdhesionUserList: User[];
  saveAcceptAdhesion: (user: User) => void;
  saveDeclineAdhesion: (user: User) => void;
  isConnectedUserResponsable: boolean;
}

const DemandeAdhesionSection : FC<Props> = ({centreDemandeAdhesionUserList, saveAcceptAdhesion, saveDeclineAdhesion, isConnectedUserResponsable}) => {

  if(isConnectedUserResponsable) {

    let sectionContent = null;

    if(centreDemandeAdhesionUserList.length === 0) {

      sectionContent = <p>Aucune demande d'adhésion</p>;

    } else {

      sectionContent = <ul className="demande-adhesion-list">
        {
          centreDemandeAdhesionUserList.map((user, index) => {

              return (
                <li key={index}>
                  <div className="user-profile-pic" style={{backgroundImage: `url(${user.profil_pic === '' ? process.env.PUBLIC_URL + '/img/profile.png' : user.profil_pic } )`}} ></div>
                  <p>{user.prenom} {user.nom}</p>
                  <div className="buttons-container">
                    <button onClick={(e) => { e.preventDefault(); saveAcceptAdhesion(user);}} type="button" className="btn-animated primary">Accepter</button>
                    <button onClick={(e) => { e.preventDefault(); saveDeclineAdhesion(user);}} type="button" className="btn-animated secondary">Refuser</button>
                  </div>
                </li>
              )

          })
        }
      </ul>;

    }

    return (
      <section>
        <h1>Demandes d'adhésion</h1>
        {sectionContent}
      </section>
    );
    
  } else {
    return null
  }

}


export default DemandeAdhesionSection;