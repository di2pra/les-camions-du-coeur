export enum MemberType {
  MEMBER = 'membre',
  RESPONSABLE = 'responsable'
}

export interface Member {
  utilisateur: string;
  type: string;
}

export interface MemberDetails {
  uid: string;
  utilisateur: string;
  type: string;
}

export interface UserCentre {
  uid: string;
}