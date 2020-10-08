import React, {useState, useCallback} from 'react';
import { auth } from '../Firebase';
import AlertBox from './AlertBox';
import PageLoading from './PageLoading';
import useFormValidation from '../hooks/useFormValidation';

function ChangePassword({updateState}) {

  const [firebaseState, setFirebaseState] = useState({isProcessing: false, message: "", type: ""});

  const firebaseErrors = {
    'auth/weak-password': 'Le mot de passe est trop faible en terme de sécurité. Veuillez choisir un autre mot de passe.',
    'auth/requires-recent-login': 'Cette opération requiert une session de connexion plus récente, veuillez vous reconnecter pour changer votre mot de passe'
  }; // list of firebase error codes to alternate error messages

  const processResetPassword = useCallback(async (state) => {

    setFirebaseState({isProcessing: true, message: "", type: ""});

    try {

      await auth.currentUser.updatePassword(state.password.value);

      setFirebaseState(prevData => ({
        ...prevData, 
        ...{message: "Votre mot de passe a été mis à jour avec succès.", type: "success"}
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

  }, [firebaseErrors]);

  const stateSchema = {
    password: { value: '', error: '' },
    password1: { value: '', error: '' }
  };

  const validationStateSchema = {
    password: {
      required: true,
      isEqualTo: 'password1'
    },
    password1: {
      required: true,
      hasToMatch: {
        value: 'password',
        error: 'Les mots de passes que vous avez saisis ne correspondent pas.'
      }
    }
  };

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processResetPassword);

  if(firebaseState.isProcessing) {
    return <PageLoading />;
  } else if(firebaseState.type === "success") {
    return (
      <div className="form-container-x">
        <div className="form">
          <AlertBox type={firebaseState.type} message={firebaseState.message} />
          <form  onSubmit={handleOnSubmit}>
            <div className="buttons-container">
              <button onClick={(e) => updateState("menu")} type="button" className="btn-animated primary" >Retourner à votre compte</button>
            </div>
          </form>
        </div>
      </div>
    )
  } else {
    return (
      <div className="form-container-x">
        <div className="form">
          <AlertBox type={firebaseState.type} message={firebaseState.message} />
          <form  onSubmit={handleOnSubmit}>
            <div className="form-row">
              <div className="form-group col-md">
                <label htmlFor="exampleInputPassword">Mot de passe*</label>
                <input autoComplete="new-password" name="password" value={state.password.value || ''} onChange={handleOnChange} type="password" className={"form-control " + (state.password.classValue|| '')} id="exampleInputPassword" placeholder="Choisir un mot de passe" />
                <div className="invalid-feedback">{state.password.error}</div>
              </div>
              <div className="form-group col-md">
                <label htmlFor="exampleInputPassword2">Confirmez votre mot de passe*</label>
                <input autoComplete="new-password" name="password1" value={state.password1.value || ''} onChange={handleOnChange} type="password" className={"form-control " + (state.password1.classValue|| '')} id="exampleInputPassword1" placeholder="Confirmez votre mot de passe" />
                <div className="invalid-feedback">{state.password1.error}</div>
              </div>
            </div>
            <div className="buttons-container">
              <button type="submit" className="btn-animated primary" >Mettre à jour mon mot de passe</button>
              <button type="button" onClick={(e) => updateState("menu")} className="btn-animated secondary" >Annuler</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  

}

export default ChangePassword;