import React, {useState, useCallback, FC} from 'react';
import AlertBox from '../../../../components/AlertBox';
import PageLoading from '../../../../components/PageLoading';
import useFormValidation from '../../../../hooks/useFormValidation';
import useFireAuth from '../../../../hooks/useFireAuth';
import { Error } from '../../../../types/Error';
import { CompteDisplayOptions } from '../../utils';

interface Props {
  updateState: (displayState: CompteDisplayOptions) => void;
}

const ChangePassword: FC<Props> = ({updateState}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {changePassword} = useFireAuth();

  const processResetPassword = useCallback((state) => {

    setIsProcessing(true);

    changePassword(state.password.value).then(() => {

      setError({message: "Votre mot de passe a été mis à jour avec succès.", type: "success"});
      setIsProcessing(false);

    }).catch((error) => {
      setError({
        type: 'error',
        message: error.message
      });
      setIsProcessing(false);
    });


  }, [changePassword]);

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

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(
    stateSchema,
    validationStateSchema,
    processResetPassword
  );

  if(isProcessing) {
    return <PageLoading />;
  } else if(error != null && error.type === "success") {
    return (
      <div className="form-container-x">
        <div className="form">
          <AlertBox error={error} />
          <form onSubmit={handleOnSubmit}>
            <div className="buttons-container">
              <button
                onClick={(e) => updateState(CompteDisplayOptions.MENU)}
                type="button"
                className="btn-animated primary"
              >
                Retourner à votre compte
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return (
      <div className="form-container-x">
        <div className="form">
          <AlertBox error={error} />
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
              <button
                type="button"
                onClick={(e) => updateState(CompteDisplayOptions.MENU)}
                className="btn-animated secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }


};

export default ChangePassword;