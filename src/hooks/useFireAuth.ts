import { useCallback } from 'react';
import {  auth } from "../Firebase";
import { FirebaseErrors } from '../types/Error';

const firebaseErrors: FirebaseErrors = {
  'auth/weak-password': 'Le mot de passe est trop faible en terme de sécurité. Veuillez choisir un autre mot de passe.',
  'auth/requires-recent-login': 'Cette opération requiert une session de connexion plus récente, veuillez vous reconnecter pour changer votre mot de passe',
  'auth/invalid-email': 'L\'adresse email est incorrecte.',
  'auth/user-disabled': 'Le compte de cet utilisateur est désactivé.',
  'auth/user-not-found': 'Le compte introuvable avec cette adresse email.',
  'auth/wrong-password': 'Le mot de passe est incorrect.',
  'auth/too-many-requests' : 'Trop de tentatives de connexion, veuillez recommencer plus tard.',
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée par un autre compte.',
  'auth/expired-action-code': 'Votre demande de réinitialisation du mot de passe a expirée ou ce lien a déjà été utilisé.',
  'auth/invalid-action-code': 'Ce lien est invalide'
}; // list of firebase error codes to alternate error messages

function useFireAuth() {

  const confirmPasswordReset = useCallback(async (code : string, newPassword: string) => {

    try {
      await auth.confirmPasswordReset(code, newPassword);
    } catch (error) {
      throw Error(firebaseErrors[error.code] || error.message);
    }

    
  }, [])

  const verifyPasswordResetCode = useCallback(async (code : string) => {

    try {
      await auth.verifyPasswordResetCode(code);
    } catch (error) {
      throw Error(firebaseErrors[error.code] || error.message);
    }

    
  }, [])

  const requestResetPassword = useCallback(async (email : string) => {

    try {

      await auth.sendPasswordResetEmail(email)

    } catch (error) {

      throw Error(firebaseErrors[error.code] || error.message);

    }
    

  }, []);


  const changePassword = useCallback(async (password) => {

    try {

      if(auth.currentUser) {
        await auth.currentUser.updatePassword(password);
      }

    } catch (error) {

      throw Error(firebaseErrors[error.code] || error.message);

    }

  }, []);


  const logInUser = useCallback(async (email, password) => {

    try {

      await auth.signInWithEmailAndPassword(email, password);

    } catch (error) {
      throw Error(firebaseErrors[error.code] || error.message);
    }

  }, []);


  const createUser = useCallback(async (email, password) => {

    try {
      
      return await auth.createUserWithEmailAndPassword(email, password);

    } catch (error) {

      throw Error(firebaseErrors[error.code] || error.message);

    }

  }, [])

  return {
    requestResetPassword,
    changePassword,
    logInUser,
    createUser,
    confirmPasswordReset,
    verifyPasswordResetCode
  };
  
}

export default useFireAuth;