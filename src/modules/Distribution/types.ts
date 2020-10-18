import {User} from "../User/types";

export interface CentreDeDistribution {
  uid: string;
  nom: string;
  jour: string;
  informations?:string;
}

export interface CreateDemandeAdhesion {
  centre: string,
  utilisateur: string;
}

export interface DemandeAdhesion extends CreateDemandeAdhesion {
  uid: string;
}

export interface DemandeAdhesionWithUserInfo extends User {
  demandeAdhesionUid: string
  demandeAdhesionCentre: string
}
