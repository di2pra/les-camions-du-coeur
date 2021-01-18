import React, {useState, useCallback, FC} from 'react';
import { useHistory } from "react-router-dom";
import AlertBox from '../../components/AlertBox';
import PageLoading from '../../components/PageLoading';
import useFormValidation from '../../hooks/useFormValidation';
import useFireAuth from '../../hooks/useFireAuth';
import { Error } from '../../types/Error';


const ResetPassword : FC<{}> = () => {

  // Get the router object
  const history = useHistory();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);


  const {
    requestResetPassword,
  } = useFireAuth();

  

  const processRequestResetPassword = useCallback((state) => {


    setIsProcessing(true);
    setError(null);

    requestResetPassword(state.email.value).then(() => {

      setError({
        type: 'success',
        message: "Un email avec un lien pour réinitiliser votre mot de passe a été envoyé."
      });
      
      setIsProcessing(false);

    }).catch((error) => {

      setError({
        type: 'error',
        message: error.message
      });

      setIsProcessing(false);

    });

  }, [requestResetPassword]);

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

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processRequestResetPassword);


  if(error && error.type === "success") {
    return (
      <div className="container-fluid">
        <div className="form-container-x">
          <div className="form">
            <AlertBox error={error} />
            <div className="buttons-container">
              <button onClick={(e) => history.push('/')} type="button" className="btn-animated primary" >Retourner à la page d'Accueil</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if(isProcessing) {
    return <PageLoading />;
  }
  
  return (
    <div className="container-fluid">
      <div className="form-container-x">
        <div className="form">
          <AlertBox error={error} />
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

export default ResetPassword;