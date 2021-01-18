import React, {useState, useCallback, FC, useEffect} from 'react';
import { useHistory, useLocation } from "react-router-dom";
import AlertBox from '../components/AlertBox';
import PageLoading from '../components/PageLoading';
import useFormValidation from '../hooks/useFormValidation';
import useFireAuth from '../hooks/useFireAuth';
import { Error } from '../types/Error';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Action : FC<{}> = () => {


  // Get the router object
  const history = useHistory();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resetCodeVerified, setResetCodeVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const query = useQuery();


  const {
    verifyPasswordResetCode,
    confirmPasswordReset
  } = useFireAuth();


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
        error: 'Les mots de passe que vous avez saisis ne correspondent pas.'
      }
    }
  };

  const processResetPassword = useCallback((state) => {

    setIsProcessing(true);

    confirmPasswordReset(query.get("oobCode") as string, state.password.value).then(() => {

      setError({message: "Votre mot de passe a été mis à jour avec succès.", type: "success"});
      setIsProcessing(false);

    }).catch((error) => {
      setError({
        type: 'error',
        message: error.message
      });
      setIsProcessing(false);
    })

  }, [confirmPasswordReset, query])

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processResetPassword);

  const checkCode = useCallback((code: string) => {

    setResetCodeVerified(null);
    setIsProcessing(true);

    verifyPasswordResetCode(code).then(() => {

      setResetCodeVerified(true);
      setIsProcessing(false);

    }).catch((error) => {

      setError({
        type: 'error',
        message: error.message
      });

      setResetCodeVerified(false);
      setIsProcessing(false);
      
    })

  }, [verifyPasswordResetCode])

  useEffect(() => {

    if(resetCodeVerified == null && isProcessing !== true && query.get("oobCode") != null) {
      checkCode(query.get("oobCode") as string);
    }
    
  }, [resetCodeVerified, checkCode, isProcessing, query])



  /*if(error) {
    return (
      <div id="reset-password-page" className="container-fluid">
        <div className="form-container-x">
          <div className="form">
            <AlertBox error={error} />
            <form>
              <div className="buttons-container">
                <button onClick={(e) => history.push('/')} type="button" className="btn-animated primary" >Retourner à la page d'Accueil</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }*/

  if(isProcessing) {
    return <PageLoading />;
  }
  
  return (
    <div className="container-fluid">
      <div className="form-container-x">
        <div className="form">
          <AlertBox error={error} />
          {
            (resetCodeVerified && (!error || (error && error.type !== "success"))) &&
            <form onSubmit={handleOnSubmit}>
              <div className="form-row">
                <div className="form-group col-md">
                  <label htmlFor="exampleInputPassword">Mot de passe*</label>
                  <input
                    autoComplete="new-password"
                    name="password"
                    value={state.password.value || ""}
                    onChange={handleOnChange}
                    type="password"
                    className={
                      "form-control " + (state.password.classValue || "")
                    }
                    id="exampleInputPassword"
                    placeholder="Choisir un mot de passe"
                  />
                  <div className="invalid-feedback">{state.password.error}</div>
                </div>
                <div className="form-group col-md">
                  <label htmlFor="exampleInputPassword2">
                    Confirmez votre mot de passe*
                  </label>
                  <input
                    autoComplete="new-password"
                    name="password1"
                    value={state.password1.value || ""}
                    onChange={handleOnChange}
                    type="password"
                    className={
                      "form-control " + (state.password1.classValue || "")
                    }
                    id="exampleInputPassword1"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <div className="invalid-feedback">{state.password1.error}</div>
                </div>
              </div>
              <div className="buttons-container">
                <button type="submit" className="btn-animated primary">
                  Mettre à jour mon mot de passe
                </button>
              </div>
            </form>
          }
          {
            ((!resetCodeVerified && error && error.type === "error") || (resetCodeVerified && error && error.type === "success")) &&
            <form>
              <div className="buttons-container">
                <button onClick={(e) => history.push('/')} type="button" className="btn-animated primary" >Retourner à la page d'Accueil</button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  )
  

}

export default Action;