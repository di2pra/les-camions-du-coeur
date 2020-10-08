import React, {useState, useCallback} from 'react';
import ErrorMsg from './../components/ErrorMsg';
//import PageLoading from './../components/PageLoading';
import useUpdateAccountForm from './../hooks/useUpdateAccountForm';

function Profil() {

  const [data, setData] = useState({isProcessing: false, errorMsg: ""});

  /*const firebaseErrors = {
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée par un autre compte.',
    'auth/invalid-email': 'L\'adresse email est incorrecte.',
    'auth/weak-password': 'Le mot de passe est trop simple.'
  };*/ // list of firebase error codes to alternate error messages

  const updateUserInformation = useCallback(async (state) => {

    //setAuthListener(false);

    setData({isProcessing: true, errorMsg: ""});

    /*try {
      const data = await auth.createUserWithEmailAndPassword(state.email.value, state.password.value);

      await firestore.collection('utilisateurs').doc(data.user.uid).set({
        email: data.user.email,
        prenom: state.prenom.value,
        nom: state.nom.value
      })

    } catch (error) {
      setData({isProcessing: false, errorMsg: firebaseErrors[error.code] || error.message});
    } finally {
      setAuthListener(true);
    }*/

  }, [/*firebaseErrors, setAuthListener*/]);

  const stateSchema = {
    nom: { value: '', error: '' },
    prenom: { value: '', error: '' },
    email: { value: '', error: '' }
  };

  const validationStateSchema = {
    nom: {
      required: true
    },
    prenom: {
      required: true
    }
  };

  const allInputs = {imgUrl: ''}
  const [imageAsFile, setImageAsFile] = useState('')
  const [imageAsUrl, setImageAsUrl] = useState(allInputs)

  const handleImageAsFile = (e) => {
    const image = e.target.files[0]
    setImageAsFile(imageFile => (image))
  }

  //const {state, handleOnChange, handleOnSubmit, disable} = useUpdateAccountForm(stateSchema, validationStateSchema, updateUserInformation);

  /*return (
    <div className="container-fluid">
      <ErrorMsg error={data.errorMsg} />
      <div className="row">
        <div className="col-12 col-lg-6 offset-lg-3">
          <h1>Mon Compte</h1>
          <form  onSubmit={handleOnSubmit}>
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="customFile" lang="fr" />
              <label className="custom-file-label" for="customFile">Choose file</label>
            </div>
            <div className="form-group">
              <label htmlFor="inputNom">Nom</label>
              <input autoComplete="family-name" name="nom" value={state.nom.value || ''} onChange={handleOnChange} type="text" className={"form-control " + (state.nom.classValue|| '')} id="inputNom" placeholder="Votre nom" />
              <div className="invalid-feedback">{state.nom.error}</div>
            </div>
            <div className="form-group">
              <label htmlFor="inputPrenom">Prénom</label>
              <input autoComplete="given-name" name="prenom"  value={state.prenom.value || ''} onChange={handleOnChange} type="text" className={"form-control " + (state.prenom.classValue|| '')} id="inputPrenom"  placeholder="Votre prénom" />
              <div className="invalid-feedback">{state.prenom.error}</div>
            </div>
            <div className="form-group">
              <label htmlFor="inputEmail">Email</label>
              <input readOnly="true" name="email" value={state.email.value || ''} className="form-control" type="email" id="inputEmail" />
            </div>
            <button type="submit" disabled={disable} className="btn btn-primary" >Mettre à jour</button>
          </form>
        </div>
      </div>
    </div>
  )*/

  return (
    <div className="container-fluid">
      <ErrorMsg error={data.errorMsg} />
      <div className="row">
        <div className="col-12 col-lg-6 offset-lg-3">
          <h1>Mon Compte</h1>
          <form>
            <div className="custom-file">
              <input type="file" className="custom-file-input" id="customFile" onChange={handleImageAsFile} />
              <label className="custom-file-label" htmlFor="customFile" >Choose file</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


function useProfileUpdateForm() {

}

export default Profil;