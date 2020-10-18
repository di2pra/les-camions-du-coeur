import React, {useState, useCallback, useContext, FC} from 'react';
import { auth, firestore, storage, FirebaseError, FirebaseErrors } from '../../../../Firebase';
import AlertBox from '../../../../components/AlertBox';
import PageLoading from "../../../../components/PageLoading";
import {UserContext} from "../../../../providers/UserProvider";
import { CompteDisplayOptions } from '../../utils';
import { SystemAlertTypes } from '../../../../components/AlertBox/types/SystemAlert';

interface Props {
  updateState: (displayState: CompteDisplayOptions) => void;
}

const DeleteAccount: FC<Props> = ({updateState}) => {
  const {
    connectedUser: { profil_pic_ref },
  } = useContext(UserContext);

  const [firebaseState, setFirebaseState] = useState<{
    isProcessing: boolean;
    message: string;
    type: SystemAlertTypes;
  }>({isProcessing: false, message: "", type: SystemAlertTypes.UNDEFINED});

  const processDeleteAccount = useCallback(async () => {
    if (!auth.currentUser) {
      return;
    }

    setFirebaseState({isProcessing: true, message: "", type: SystemAlertTypes.UNDEFINED});

    try {
      if (profil_pic_ref) {
        await storage.ref().child(profil_pic_ref).delete();
      }

      await firestore
        .collection("utilisateurs")
        .doc(auth.currentUser.uid)
        .delete();

      await auth.currentUser.delete();

      setFirebaseState((prevData) => ({
        ...prevData,
        ...{ message: "Votre a été supprimé avec succès.", type: SystemAlertTypes.SUCCESS },
      }));
    } catch (error) {
      const firebaseError = error as FirebaseError;
      setFirebaseState((prevData) => ({
        ...prevData,
        ...{
          message: FirebaseErrors[firebaseError.code] || firebaseError.message,
          type: SystemAlertTypes.ERROR,
        },
      }));
    }

    setFirebaseState(prevData => ({
      ...prevData,
      ...{isProcessing: false}
    }));

  }, [profil_pic_ref]);

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    processDeleteAccount();
  };

  if(firebaseState.isProcessing) {
    return <PageLoading />;
  }


  return (
    <div className="form-container-x">
      <div className="form">
        <AlertBox systemAlert={firebaseState} />
        <form onSubmit={handleOnSubmit}>
          <AlertBox
            systemAlert={{
              type: SystemAlertTypes.WARNING,
              message: "Voulez vous réellement supprimer votre compte ?",
            }}
          />
          <div className="buttons-container">
            <button
              disabled={true}
              type="submit"
              className="btn-animated primary"
            >
              Supprimer mon compte
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
};

export default DeleteAccount;