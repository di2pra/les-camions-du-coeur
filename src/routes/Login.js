import React, {useState, useCallback} from 'react';
import { auth } from './../Firebase';
import { useHistory } from 'react-router-dom';
import AlertBox from '../components/AlertBox';
import PageLoading from './../components/PageLoading';
import useFormValidation from '../hooks/useFormValidation';

function Login() {

  // Get the router object
  const history = useHistory();

  const [data, setData] = useState({isProcessing: false, errorMsg: ""});

  const firebaseErrors = {
    'auth/invalid-email': 'L\'adresse email est incorrecte.',
    'auth/user-disabled': 'Le compte de cet utilisateur est désactivé.',
    'auth/user-not-found': 'Le compte introuvable avec cette adresse email.',
    'auth/wrong-password': 'Le mot de passe est incorrect.',
    'auth/too-many-requests' : 'Trop de tentatives de connexion, veuillez recommencer plus tard.'
  }; // list of firebase error codes to alternate error messages

  const processLogin = useCallback(async (state) => {

    setData({isProcessing: true, errorMsg: ""});

    try {

      await auth.signInWithEmailAndPassword(state.email.value, state.password.value);

    } catch (error) {

      setData({isProcessing: false, errorMsg: firebaseErrors[error.code] || error.message});
    }

  }, [firebaseErrors]);

  const stateSchema = {
    email: { value: '', error: '' },
    password: { value: '', error: '' }
  };

  const validationStateSchema = {
    email: {
      required: true,
      validator: {
        regEx: /\S+@\S+\.\S+/,
        error: 'L\'adresse email est incorrecte.'
      }
    },
    password: {
      required: true
    }
  };

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processLogin);

  if(data.isProcessing) {
    return <PageLoading />;
  } else {
    return (
      <div id="login-page" className="container-fluid">
        <div className="form-container-x">
          <div className="form">
            <AlertBox type="error" message={data.errorMsg} />
            <form  onSubmit={handleOnSubmit}>
              <div className="form-group">
                <label htmlFor="inputEmail">Email*</label>
                <input autoComplete="username" name="email" value={state.email.value || ''} onChange={handleOnChange} type="email" className={"form-control " + (state.email.classValue || '')} id="inputEmail" placeholder="Votre adresse email" />
                <div className="invalid-feedback">{state.email.error}</div>
              </div>
              <div className="form-group">
                <label htmlFor="inputPassword">Mot de passe*</label>
                <input autoComplete="current-password" name="password" value={state.password.value || ''} onChange={handleOnChange} type="password" className={"form-control " + (state.password.classValue || '')} id="inputPassword" placeholder="Votre mot de passe" />
                <div className="invalid-feedback">{state.password.error}</div>
              </div>
              <div className="buttons-container">
                <button type="submit" className="btn-animated primary" >Se connecter</button>
                <button onClick={(e) => history.push('/reinit-mdp')} type="button" className="btn-animated secondary" >Mot de passe oublié ?</button>
                <button onClick={(e) => history.push('/sinscrire')} type="button" className="btn-animated secondary" >S'inscrire</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

}

export default Login;