import React, { createContext, useState, useEffect, FC } from "react";
import { auth, firestore } from "../Firebase";
import AppLoading from "../components/AppLoading";

export interface ConnectedUser {
  uid?: string;
  email?: string;
  prenom?: string;
  nom?: string;
  profil_pic?: string;
  profil_pic_ref?: string;
  authWasListened?: boolean;
}

export const UserContext = createContext<{
  connectedUser: ConnectedUser;
  setAuthListener: (auth: boolean) => void;
  setProfilPic: (profil_pic: string, cloud_ref: string) => void;
}>({
  connectedUser: {},
  setAuthListener: () => {},
  setProfilPic: () => {},
});

const UserProvider: FC = ({children}) => {
  const [authToListen, setAuthListener] = useState(true);
  const [connectedUser, setConnectedUser] = useState<ConnectedUser>({
    uid: "",
    email: "",
    prenom: "",
    nom: "",
    profil_pic: "",
    profil_pic_ref: "",
    authWasListened: false,
  });

  useEffect(() => {
    if(authToListen) {
      const unsubscribe = auth.onAuthStateChanged(async user => {
        if (user) {
          try {
            const userData = await firestore.collection('utilisateurs').doc(user.uid).get();
            const {
              email,
              nom,
              prenom,
              profil_pic,
            } = userData.data() as ConnectedUser;

            setConnectedUser({
              uid: user.uid,
              email,
              prenom,
              nom,
              profil_pic,
              authWasListened: true,
            });
          } catch (error) {
            setConnectedUser({uid: '', email: '', prenom: '', nom: '', profil_pic: '', profil_pic_ref: '', authWasListened: true});
          }
        } else {
          setConnectedUser({uid: '', email: '', prenom: '', nom: '', profil_pic: '', profil_pic_ref: '', authWasListened: true});
        }
      });

      return unsubscribe;
    }
  }, [authToListen]);

  const setProfilPic = (profil_pic: string, cloud_ref: string) => {
    setConnectedUser(prevObject => ({...prevObject, profil_pic: profil_pic, profil_pic_ref: cloud_ref}));
  };

  return (
    connectedUser.authWasListened
    ? <UserContext.Provider value={{
      connectedUser: connectedUser,
      setAuthListener: setAuthListener,
      setProfilPic: setProfilPic
    }}>
      {children}
    </UserContext.Provider>
    : <AppLoading />
  );

};

export default UserProvider;