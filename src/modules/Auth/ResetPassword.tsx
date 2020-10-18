import React, {useState, useCallback, FC} from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../../Firebase';
import AlertBox from '../../components/AlertBox';
import PageLoading from '../../components/PageLoading';
import useFormValidation from '../../hooks/useFormValidation';

interface FirebaseErrors {
  [key: string]: string;
}

const ResetPassword : FC<{}> = () => {

  // Get the router object
  const history = useHistory();

  const [firebaseState, setFirebaseState] = useState({isProcessing: false, message: "", type: ""});

  const firebaseErrors : FirebaseErrors = {
    'auth/invalid-email': 'L\'adresse email est incorrecte.',
    'auth/user-disabled': 'Le compte de cet utilisateur est désactivé.',
    'auth/user-not-found': 'Le compte introuvable avec cette adresse email.'
  }; // list of firebase error codes to alternate error messages

  const processResetPassword = useCallback(async (state) => {

    setFirebaseState({isProcessing: true, message: "", type: ""});

    try {

      await auth.sendPasswordResetEmail(state.email.value);

      setFirebaseState(prevData => ({
        ...prevData, 
        ...{message: "Un email avec un lien pour réinitiliser votre mot de passe a été envoyé.", type: "success"}
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
    email: { value: '', error: '' }
  };

  const validationStateSchema = {
    email: {
      required: true,
      validator: {
        regEx: /\S+@\S+\.\S+/,
        error: 'L\'adresse email est incorrecte.'
      }
    }
  };

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processResetPassword);

  if(firebaseState.isProcessing) {
    return <PageLoading />;
  } else if(firebaseState.type === "success") {
    return (
      <div id="reset-password-page" className="container-fluid">
        <div className="form-container-x">
          <div className="form">
            <AlertBox error={firebaseState} />
            <form  onSubmit={handleOnSubmit}>
              <div className="buttons-container">
                <button onClick={(e) => history.push('/')} type="button" className="btn-animated primary" >Retourner à la page d'Accueil</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div id="reset-password-page" className="container-fluid">
        <div className="form-container-x">
          <div className="form">
            <AlertBox error={firebaseState} />
            <form  onSubmit={handleOnSubmit}>
              <div className="form-group">
                <label htmlFor="inputEmail">Email*</label>
                <input autoComplete="username" name="email" value={state.email.value || ''} onChange={handleOnChange} type="email" className={"form-control " + (state.email.classValue || '')} id="inputEmail" placeholder="Votre adresse email" />
                <div className="invalid-feedback">{state.email.error}</div>
              </div>
              <div className="buttons-container">
                <button type="submit" className="btn-animated primary" >Réinitialiser mon mot de passe</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
  

}

export default ResetPassword;