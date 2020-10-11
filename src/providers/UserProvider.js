import React, { createContext, useState, useEffect } from "react";
import { auth, firestore } from "../Firebase";
import AppLoading from "./../components/AppLoading";

export const UserContext = createContext({connectedUser: {}, setAuthListener: () => {}, setProfilPic: () => {}});

function UserProvider(props) {

  const [authToListen, setAuthListener] = useState(true);
  const [connectedUser, setConnectedUser] = useState({uid: '', email: '',  prenom: '', nom: '', profil_pic: '', profil_pic_ref: '', authWasListened: false});
  
  useEffect(() => {

    if(authToListen) {

      const unsubscribe = auth.onAuthStateChanged(async user => {

        if (user) {
          try {
            const userData = await firestore.collection('utilisateurs').doc(user.uid).get();

            setConnectedUser({
              ...userData.data(),
              authWasListened: true,
              uid: user.uid
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

  const setProfilPic = (profil_pic, cloud_ref) => {
    setConnectedUser(prevObject => ({...prevObject, profil_pic: profil_pic, profil_pic_ref: cloud_ref}))
  }

  return (
    connectedUser.authWasListened ?
    <UserContext.Provider value={{connectedUser: connectedUser, setAuthListener: setAuthListener, setProfilPic: setProfilPic}}>
      {props.children}
    </UserContext.Provider>
    : <AppLoading />
  );

}

export default UserProvider;