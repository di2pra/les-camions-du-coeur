export interface CentreDeDistribution {
  uid: string;
  nom: string;
  jour: string;
}

export interface DemandeAdhesion {
  uid: string;
  utilisateur: string;
  utilisateurUid: string;
}

export interface DemandeAdhesionDetail {
  uid: string;
  utilisateurUid: string;
}