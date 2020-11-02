import React, { useContext, useState, useCallback } from "react";

import { UserContext } from "../../providers/UserProvider";
import useCroppie from "../../hooks/useCroppie";
import { getUserProfilPicUrl } from "../../components/Helpers";
import AlertBox from "../../components/AlertBox";

import ChangePassword from "./components/ChangePassword";
import CompteMenu from "./components/CompteMenu";
import DeleteAccount from "./components/DeleteAccount";
import { useHandleAvatarUpload } from "./hooks/useHandleAvatarUpload";
import { CompteDisplayOptions } from "./utils";
import {User} from "./../../modules/User/types";

function Compte() {
  const [display, setDisplay] = useState(CompteDisplayOptions.MENU);
  const { connectedUser, setProfilPic } = useContext(UserContext as unknown as React.Context<{connectedUser: User; setProfilPic: (profil_pic: string, cloud_ref: string) => void;}>);

  const updateState = useCallback(
    (displayState: CompteDisplayOptions) => setDisplay(displayState),
    []
  );

  const displayProfilUpdateFrom = useCallback(
    (value) => setDisplay(value ? CompteDisplayOptions.PROFILE_UPDATE : CompteDisplayOptions.MENU),
    []
  );

  const { error, upload } = useHandleAvatarUpload(connectedUser, setProfilPic);

  const { loadCroppie, CroppieDomContainer } = useCroppie(
    upload,
    displayProfilUpdateFrom
  );

  const renderContent = useCallback(() => {
    let contains;
    if (display === CompteDisplayOptions.MENU) {
      contains = (
        <CompteMenu updateState={updateState} loadCroppie={loadCroppie} />
      );
    } else if (display === CompteDisplayOptions.CHANGE_PASSWORD) {
      contains = <ChangePassword updateState={updateState} />;
    } else if (display === CompteDisplayOptions.DELETE_ACCOUNT) {
      contains = <DeleteAccount updateState={updateState} />;
    } else if (display === CompteDisplayOptions.PROFILE_UPDATE) {
      contains = <CroppieDomContainer />;
    }

    return contains;
  }, [display, updateState, loadCroppie, CroppieDomContainer]); 

  return (
    <div id="account-management">
      <div className="account-card-container">
        <div className="account-banner"></div>
        <AlertBox error={error} />
        <div
          className="profile-image"
          style={{
            backgroundImage: `url(${getUserProfilPicUrl(connectedUser)})`,
          }}
        ></div>
        <h3 className="name">
          {connectedUser.prenom} {connectedUser.nom}
        </h3>
        <div className="account-card-body container-fluid">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Compte;
