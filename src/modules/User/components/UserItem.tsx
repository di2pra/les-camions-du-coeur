import React, { FC } from "react";
import { getUserProfilPicUrl } from "../../../components/Helpers";
import {User, MemberWithUserInfo} from "../types";

interface Props {
  user: MemberWithUserInfo | User | null;
}

const UserItem : FC<Props> = ({ user }) => {
  

  if (user == null) {
    return (
      <div className="user">
        <div className="user-image">
          <div
            className="user-image-content"
            style={{
              backgroundImage: `url(${
                process.env.PUBLIC_URL + "/img/profile.png"
              } )`,
            }}
          ></div>
        </div>
        <div className="user-name">
          <p>Inconnu</p>
        </div>
      </div>
    );
  } else {
    const name =
      user.prenom && user.nom
        ? user.prenom + " " + user.nom.substring(0, 1) + "."
        : user.email;

        let classNameUser = 'user';

        if('type' in user) {
          classNameUser = 'user' + ((user.type === "responsable") ? ' user-responsable' : '');
        }

    

    return (
      <div className={classNameUser}>
        <div className="user-image">
          <div
            className="user-image-content"
            style={{ backgroundImage: `url(${getUserProfilPicUrl(user)})` }}
          ></div>
        </div>
        <div className="user-name">
          <p>{name}</p>
        </div>
      </div>
    );
  }
}

export default UserItem;
