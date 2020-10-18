import React, {useState, useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import AlertBox from '../../components/AlertBox';
import PageLoading from '../../components/PageLoading';
import useFormValidation from '../../hooks/useFormValidation';
import useFireAuth from '../../hooks/useFireAuth';
import { SystemAlert, SystemAlertTypes } from '../../components/AlertBox/types/SystemAlert';

function Login() {

  // Get the router object
  const history = useHistory();

  const [isProcessing, setIsProcessing] = useState(false);
  const [systemAlert, setSystemAlert] = useState<SystemAlert | null>(null);

  const {logInUser} = useFireAuth();

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

  const processLogin = useCallback((state) => {

    setIsProcessing(true);

    logInUser(state.email.value, state.password.value).then(() => {

    }).catch((error) => {

      setSystemAlert({
        type: SystemAlertTypes.ERROR,
        message: error.message
      });

      setIsProcessing(false);

    });


  }, [logInUser]);

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processLogin);


  if(isProcessing) {
    return <PageLoading />;
  } else {
    return (
      <div id="login-page" className="container-fluid">
        <div className="form-container-x">
          <div className="form">
            <AlertBox systemAlert={systemAlert} />
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
                <button onClick={(e) => history.push('/sinscrire')} type="button" className="btn-animated secondary">S&apos;inscrire</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}

export default Login;