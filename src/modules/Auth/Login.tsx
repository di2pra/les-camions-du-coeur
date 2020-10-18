import React, {useState, useCallback, FC} from 'react';
import { useHistory } from 'react-router-dom';
import AlertBox from '../../components/AlertBox';
import PageLoading from '../../components/PageLoading';
import useFormValidation from '../../hooks/useFormValidation';
import useFireAuth from '../../hooks/useFireAuth';
import { Error } from '../../types/Error';
import { FormSchema } from '../../types/FormSchema';

const Login: FC<{}> = () => {

  // Get the router object
  const history = useHistory();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

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

  const processLogin = useCallback((state:FormSchema) => {

    setIsProcessing(true);

    logInUser(state.email.value, state.password.value).then(() => {

    }).catch((error) => {

      setError({
        type: 'error',
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
            <AlertBox error={error} />
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