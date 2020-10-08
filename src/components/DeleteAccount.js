import React, {useState, useCallback, useContext} from 'react';
import { auth, firestore, storage } from '../Firebase';
import AlertBox from './AlertBox';
import PageLoading from './PageLoading';
import {UserContext} from "./../providers/UserProvider";


function DeleteAccount({updateState}) {

  const {connectedUser} = useContext(UserContext);

  const [firebaseState, setFirebaseState] = useState({isProcessing: false, message: "", type: ""});

  const firebaseErrors = {
    'auth/requires-recent-login': 'Cette opération requiert une session de connexion plus récente, veuillez vous reconnecter pour changer votre mot de passe'
  }; // list of firebase error codes to alternate error messages

  const processDeleteAccount = useCallback(async () => {

    setFirebaseState({isProcessing: true, message: "", type: ""});

    try {

      if(connectedUser.profil_pic_ref) {
        await storage.ref().child(connectedUser.profil_pic_ref).delete();
      }

      await firestore.collection("utilisateurs").doc(auth.currentUser.uid).delete();

      await auth.currentUser.delete();

      setFirebaseState(prevData => ({
        ...prevData, 
        ...{message: "Votre a été supprimé avec succès.", type: "success"}
      }))

    } catch (error) {

      setFirebaseState(prevData => ({
        ...prevData, 
        ...{message: firebaseErrors[error.code] || error.message, type: "error"}
      }))

    }

    setFirebaseState(prevData => ({
      ...prevData, 
      ...{isProcessing: false}
    }))

  }, [firebaseErrors, connectedUser.profil_pic_ref]);

  const handleOnSubmit = (e) => {

    e.preventDefault();

    processDeleteAccount();
  }

  if(firebaseState.isProcessing) {
    return <PageLoading />;
  } else {
    return (
      <div className="form-container-x">
        <div className="form">
          <AlertBox type={firebaseState.type} message={firebaseState.message} />
          <form  onSubmit={handleOnSubmit}>
            <AlertBox type="warning" message="Voulez vous réellement supprimer votre compte ?" />
            <div className="buttons-container">
              <button disabled={true} type="submit" className="btn-animated primary" >Supprimer mon compte</button>
              <button type="button" onClick={(e) => updateState("menu")} className="btn-animated secondary" >Annuler</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  

}

export default DeleteAccount;