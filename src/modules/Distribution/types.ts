export interface CentreDeDistribution {
  uid: string;
  nom: string;
  jour: string;
  informations?:string;
  participants: [string];
  responsables: [string];
  postulants: [string];
}