export interface CentreDeDistribution {
  uid: string;
  nom: string;
  jour: string;
}

export interface IDemandeAdhesion {
  uid: string;
  utilisateur: string;
  utilisateurUid: string;
  nom: string;
  prenom: string;
  profil_pic: string;
}

export interface DemandeAdhesionDetail {
  uid: string;
  utilisateur: string;
  utilisateurUid: string;
  nom: string;
  prenom: string;
  profil_pic: string;
}
