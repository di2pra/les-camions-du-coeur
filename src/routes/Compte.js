import React, {useContext, useState} from 'react';
import { storage, firestore } from "../Firebase";
import { UserContext } from "./../providers/UserProvider";
import useCroppie from "../hooks/useCroppie";
import {uuidv4, getUserProfilPicUrl} from './../components/Helpers';
import { useHistory } from 'react-router-dom';
import ChangePassword from '../components/ChangePassword';
import DeleteAccount from '../components/DeleteAccount';
import AlertBox from './../components/AlertBox';

function Compte() {

  // Get the router object
  const history = useHistory();

  const [state, setState] = useState({display: "menu"});
  const {connectedUser, setProfilPic} = useContext(UserContext);
  const [error, setError] = useState(null);

  const handleFireBaseUpload = (imageAsFile) => {

    const cloudRef = `/profile_pic/${uuidv4()}.png`;

    const uploadTask = storage.ref(cloudRef).put(imageAsFile);

    uploadTask.on('state_changed', null, (erro) => {
      setError(
        {
          type: "error",
          message: erro.message
        }
      );
    }, () => {

      storage.ref(cloudRef).getDownloadURL().then(fireBaseUrl => {

        // update the profil pic url in the user db
        firestore.collection('utilisateurs').doc(connectedUser.uid).set({
          profil_pic: fireBaseUrl,
          profil_pic_ref: cloudRef
        }, { merge: true });

        // delete the existing pic
        if(connectedUser.profil_pic_ref) {
          storage.ref().child(connectedUser.profil_pic_ref).delete().then(function() {
          }).catch(function(error) {
            // Uh-oh, an error occurred!
          });
        }
        

        // update the current session profil pic of the user
        setProfilPic(fireBaseUrl, cloudRef);
        
      });

    })

  }

  const updateState = function(newState) {
    setState({display: newState});
  }

  const displayProfilUpdateFrom = (value) => {
    if(value) {
      setState({display: "profilUpdate"});
    } else {
      setState({display: "menu"});
    }
  }

  const {loadCroppie, CroppieDomContainer} = useCroppie(handleFireBaseUpload, displayProfilUpdateFrom);



  let contains;

  if(state.display === "menu") {
    contains = <CompteMenu updateState={updateState} history={history} loadCroppie={loadCroppie} />;
  } else if(state.display === "changePwd") {
    contains = <ChangePassword updateState={updateState} />
  } else if(state.display === "deleteAccount") {
    contains = <DeleteAccount updateState={updateState} />
  } else if(state.display === "profilUpdate") {
    contains = <CroppieDomContainer />
  }


  return (
    <div id="account-management">
      <div className="account-card-container">
        <div className="account-banner"></div>
        <AlertBox error={error} />
        <div className="profile-image" style={{backgroundImage: `url(${getUserProfilPicUrl(connectedUser)})`}} ></div>
        <h3 className="name">{connectedUser.prenom} {connectedUser.nom}</h3>
        <div className="account-card-body container-fluid">
          {contains}
        </div>
      </div>
    </div>
  )
}


function CompteMenu({updateState, history, loadCroppie}) {

  return (
    <div className="buttons-container menu">
      <div className="file-input-wrapper">
        <input  accept="image/png, image/jpeg" onChange={loadCroppie} type="file" name="file" id="file" className="inputfile" />
        <label htmlFor="file" className="primary">Changer votre photo de profil</label>
      </div>
      <button onClick={(e) => updateState("changePwd")} type="button" className="btn-animated primary">Changer votre mot de passe</button>
      <button onClick={(e) => updateState("deleteAccount")} type="button" className="btn-animated primary">Supprimer votre compte</button>
    </div>
  )
}

export default Compte;