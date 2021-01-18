import { useState, useCallback } from "react";
import { storage, firestore } from "../../../Firebase";
import { uuidv4 } from "../../../components/Helpers";
import { User } from "../../User/types";
import { Error } from "../../../types/Error";

export  const useHandleAvatarUpload = (
  connectedUser: User,
  setProfilPic: (fireBaseUrl: string, cloudRef: string) => void
) => {
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(
    (imageAsFile: any) => {
      const cloudRef = `/profile_pic/${uuidv4()}.png`;

      var metadata = {
        cacheControl: 'public,max-age=4000',
      }

      const uploadTask = storage.ref(cloudRef).put(imageAsFile, metadata);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          setError({
            type: "error",
            message: error.message,
          });
        },
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
              ).then(() => {

                // delete the existing pic
                if (connectedUser.profil_pic_ref) {
                  storage
                  .ref()
                  .child(connectedUser.profil_pic_ref)
                  .delete();
                }

                // update the current session profil pic of the user
                setProfilPic(fireBaseUrl, cloudRef);

              }).catch((error) => {
                setError({
                  type: "error",
                  message: error.message,
                });
              });

              
            });
        }
      );
    },
    [connectedUser, setProfilPic]
  );

  return { error, upload };
};