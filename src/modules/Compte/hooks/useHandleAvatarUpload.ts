import { useCallback } from "react";

import { storage, firestore } from "../../../Firebase";

import { uuidv4 } from "../../../components/Helpers";
import { ConnectedUser } from "../../../providers/UserProvider";
import { useSystemAlert } from "../../../components/AlertBox/useSystemAlert";

export  const useHandleAvatarUpload = (
  connectedUser: ConnectedUser,
  setProfilPic: (fireBaseUrl: string, cloudRef: string) => void
) => {
  const {systemAlert, setError} = useSystemAlert();

  const upload = useCallback(
    (imageAsFile: any) => {
      const cloudRef = `/profile_pic/${uuidv4()}.png`;
      const uploadTask = storage.ref(cloudRef).put(imageAsFile);

      uploadTask.on(
        "state_changed",
        null,
        (erro) => setError(erro.message),
        () => {
          storage
            .ref(cloudRef)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              // update the profil pic url in the user db
              firestore.collection("utilisateurs").doc(connectedUser.uid).set(
                {
                  profil_pic: fireBaseUrl,
                  profil_pic_ref: cloudRef,
                },
                { merge: true }
              );

              // delete the existing pic
              if (connectedUser.profil_pic_ref) {
                storage
                  .ref()
                  .child(connectedUser.profil_pic_ref)
                  .delete()
                  .then(function () {})
                  .catch(function (error) {
                    // Uh-oh, an error occurred!
                  });
              }

              // update the current session profil pic of the user
              setProfilPic(fireBaseUrl, cloudRef);
            });
        }
      );
    },
    [connectedUser, setProfilPic, setError]
  );

  return { error: systemAlert, upload };
};