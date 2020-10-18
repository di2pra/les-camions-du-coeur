import React, { createContext, useState, useEffect, FC } from "react";
import { auth, firestore } from "../Firebase";
import AppLoading from "../components/AppLoading";
import {User} from "../modules/User/types";

export const UserContext = createContext<{
  connectedUser: User | null;
  setAuthListener: (auth: boolean) => void;
  setProfilPic: (profil_pic: string, cloud_ref: string) => void;
}>({
  connectedUser: null,
  setAuthListener: () => {},
  setProfilPic: () => {},
});

const UserProvider: FC = ({children}) => {
  const [authToListen, setAuthListener] = useState(true);
  const [authWasListened, setAuthWasListened] = useState<boolean | null>(null);
  const [connectedUser, setConnectedUser] = useState<User | null>(null);

  useEffect(() => {
    if(authToListen) {
      const unsubscribe = auth.onAuthStateChanged(async user => {

        if (user) {

          try {
            const userData = await firestore.collection('utilisateurs').doc(user.uid).get();

            setConnectedUser({
              ...userData.data() as User,
              uid: user.uid
            });

          } catch (error) {
            setConnectedUser(null);
          }

        } else {
          setConnectedUser(null);
        }

        setAuthWasListened(true);

      });

      return unsubscribe;
    }
  }, [authToListen]);

  const setProfilPic = (profil_pic: string, cloud_ref: string) => {
    setConnectedUser((prevState) => ({...prevState as User, profil_pic: profil_pic, profil_pic_ref: cloud_ref}));
  };

  return (
    authWasListened
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