import React, { useState, useCallback, FC, useContext } from 'react';
import AlertBox from '../../../../components/AlertBox';
import PageLoading from '../../../../components/PageLoading';
import useFormValidation from '../../../../hooks/useFormValidation';
import useFireAuth from '../../../../hooks/useFireAuth';
import { UserContext } from "../../../../providers/UserProvider";
import { Error } from '../../../../types/Error';
import { CompteDisplayOptions } from '../../utils';

interface Props {
  updateState: (displayState: CompteDisplayOptions) => void;
}

const ChangePreference: FC<Props> = ({ updateState }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { connectedUser } = useContext(UserContext);

  const { changePassword } = useFireAuth();

  const processResetPassword = useCallback((state) => {

    setIsProcessing(true);

    changePassword(state.password.value).then(() => {

      setError({ message: "Votre mot de passe a été mis à jour avec succès.", type: "success" });
      setIsProcessing(false);

    }).catch((error) => {
      setError({
        type: 'error',
        message: error.message
      });
      setIsProcessing(false);
    })


  }, [changePassword]);

  const stateSchema = {
    password: { value: '', error: '' },
    password1: { value: '', error: '' }
  };

  const validationStateSchema = {
    password: {
      required: true
    },
    password1: {
      required: true
    }
  };

  const { state, handleOnChange, handleOnSubmit } = useFormValidation(stateSchema, validationStateSchema, processResetPassword);

  const formContainer = useCallback(() => {

    if (connectedUser) {
      return connectedUser.preferences.map((item, index) => {
        return (
          <div className="form-row">
            <div className="dropdown">
  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a className="dropdown-item" href="#">Action</a>
    <a className="dropdown-item" href="#">Another action</a>
    <a className="dropdown-item" href="#">Something else here</a>
  </div>
</div>
              <div className="form-group col-12">
              <label htmlFor="preference">Choix {index+1}</label>
              <select name="preference" id="preference">
                <option value="PASSE_PLAT">Passe Plat</option>
                <option value="SOUPE" selected>Soupe</option>
                <option value="CAFE">Café</option>
                <option value="ACCOMPAGNEMENT">Accompagnement</option>
                <option value="PLAT_CHAUD">Plat Chaud</option>
              </select>
              <div className="invalid-feedback">{state.password1.error}</div>
              </div>
          </div>
        )
      });
    }


  }, [])

  if (isProcessing) {
    return <PageLoading />;
  } else {
    return (
      <div className="form-container-x">
        <div className="form">
          <AlertBox error={error} />
          <form onSubmit={handleOnSubmit}>
            <div className="form-row">
              {formContainer()}
            </div>
            <div className="buttons-container">
              <button type="submit" className="btn-animated primary">
                Mettre à jour mes preferences
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


}

export default ChangePreference;