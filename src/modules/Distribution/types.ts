export interface CentreDeDistribution {
  uid: string;
  nom: string;
  jour: string;
  benevoles: number;
  informations?:string;
  participants: [string];
  responsables: [string];
  postulants: [string];
}