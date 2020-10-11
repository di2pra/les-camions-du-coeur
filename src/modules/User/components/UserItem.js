import React from "react";

import { getUserProfilPicUrl } from "../../../components/Helpers";

function UserItem({ user }) {
  if (typeof user == "undefined") {
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
    return (
      <div className="user">
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
