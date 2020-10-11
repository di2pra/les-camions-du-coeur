import React, {useState, useCallback, useContext} from 'react';
import AlertBox from '../components/AlertBox';
import PageLoading from './../components/PageLoading';
import useFormValidation from './../hooks/useFormValidation';
import { UserContext } from "./../providers/UserProvider";
import useFireAuth from '../hooks/useFireAuth';
import useFirestore from '../hooks/useFirestore';

function Signup() {

  const {setAuthListener} = useContext(UserContext);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const {createUser} = useFireAuth();
  const {createUtilisateur} = useFirestore();


  const processCreateUser = useCallback((state) => {

    setAuthListener(false);
    setIsProcessing(true);

    createUser(state.email.value, state.password.value).then((data) => {

      createUtilisateur(data.user.uid, {
        email: data.user.email,
        prenom: state.prenom.value,
        nom: state.nom.value
      }).then(() => {

        setAuthListener(true);

      }).catch((error) => {

        setError({
          type: 'error',
          message: error.message
        });

        setAuthListener(true);
        setIsProcessing(false);

      })

    }).catch((error) => {

      setError({
        type: 'error',
        message: error.message
      });

      setAuthListener(true);
      setIsProcessing(false);

    });

  }, [setAuthListener, createUtilisateur, createUser]);

  const stateSchema = {
    nom: { value: '', error: '' },
    prenom: { value: '', error: '' },
    email: { value: '', error: '' },
    email1: { value: '', error: '' },
    password: { value: '', error: '' },
    password1: { value: '', error: '' }
  };

  const validationStateSchema = {
    nom: {
      required: true
    },
    prenom: {
      required: true
    },
    email: {
      required: true,
      validator: {
        regEx: /\S+@\S+\.\S+/,
        error: 'L\'adresse email est incorrecte.'
      },
      isEqualTo: 'email1'
    },
    email1: {
      required: true,
      validator: {
        regEx: /\S+@\S+\.\S+/,
        error: 'L\'adresse email est incorrecte.'
      },
      hasToMatch: {
        value: 'email',
        error: 'Les adresses email que vous avez saisies ne correspondent pas.'
      }
    },
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

  const {state, handleOnChange, handleOnSubmit} = useFormValidation(stateSchema, validationStateSchema, processCreateUser);


  if(isProcessing) {
    return <PageLoading />;
  } else {
    return (
      <div id="register-page" className="container-fluid">
        <div className="form-container-m">
          <div className="form">
            <AlertBox error={error} />
            <form  onSubmit={handleOnSubmit}>
              <div className="form-group">
                <label htmlFor="inputNom">Nom*</label>
                <input autoComplete="family-name" name="nom" value={state.nom.value || ''} onChange={handleOnChange} type="text" className={"form-control " + (state.nom.classValue|| '')} id="inputNom" placeholder="Votre nom" />
                <div className="invalid-feedback">{state.nom.error}</div>
              </div>
              <div className="form-group">
                <label htmlFor="inputPrenom">Prénom*</label>
                <input autoComplete="given-name" name="prenom"  value={state.prenom.value || ''} onChange={handleOnChange} type="text" className={"form-control " + (state.prenom.classValue|| '')} id="inputPrenom"  placeholder="Votre prénom" />
                <div className="invalid-feedback">{state.prenom.error}</div>
              </div>
              <div className="form-row">
                <div className="form-group col-md">
                  <label htmlFor="inputEmail">Email*</label>
                  <input autoComplete="email" name="email" value={state.email.value || ''} onChange={handleOnChange} type="email" className={"form-control " + (state.email.classValue|| '')} id="inputEmail" placeholder="Votre adresse email" />
                  <div className="invalid-feedback">{state.email.error}</div>
                </div>
                <div className="form-group col-md">
                  <label htmlFor="inputEmail1">Confirmez votre email*</label>
                  <input name="email1" value={state.email1.value || ''} onChange={handleOnChange} type="email" className={"form-control " + (state.email1.classValue|| '')} id="inputEmail1" placeholder="Confirmez votre adresse email" />
                  <div className="invalid-feedback">{state.email1.error}</div>
                </div>
              </div>
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
                <button type="submit" className="btn-animated primary" >Créer votre compte</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

}

export default Signup;