import {User} from "../User/types";

export interface CentreDeDistribution {
  uid: string;
  nom: string;
  jour: string;
  informations?:string;
  participants: [string];
  responsables: [string];
  postulants: [string];
}

export interface DemandeAdhesion extends CreateDemandeAdhesion {
  uid: string;
}

export interface CreateDemandeAdhesion {
  centre: string,
  utilisateur: string;
}

export interface DemandeAdhesionWithUserInfo extends User {
  demandeAdhesionUid: string
  demandeAdhesionCentre: string
}