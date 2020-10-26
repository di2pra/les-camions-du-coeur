import React, { createContext, useState, useEffect, FC } from "react";
import { auth } from "../Firebase";
import {User} from "../modules/User/types";
import PageLoading from "../components/PageLoading";
import useFirestore from "../hooks/useFirestore";

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

  const {getUserById} = useFirestore();

  useEffect(() => {

    if(authToListen) {
      const unsubscribe = auth.onAuthStateChanged(async user => {
        
        if (user) {

          getUserById(user.uid).then((user) => {

            setConnectedUser(user);

          }).catch(() => {

            setConnectedUser(null);
            
          }).finally(() => {

            setAuthWasListened(true);

          });   

        } else {

          setConnectedUser(null);
          setAuthWasListened(true);
          
        }

      });

      return unsubscribe;
    }

  }, [authToListen, getUserById]);

  const setProfilPic = (profil_pic: string, cloud_ref: string) => {
    setConnectedUser((prevState) => ({...prevState as User, profil_pic: profil_pic, profil_pic_ref: cloud_ref}))
  }

  return (
    authWasListened
    ? <UserContext.Provider value={{
      connectedUser: connectedUser,
      setAuthListener: setAuthListener,
      setProfilPic: setProfilPic
    }}>
      {children}
    </UserContext.Provider>
    : <PageLoading />
  );

}

export default UserProvider;