export interface MemberWithUserInfo extends User {
  responsable: boolean;
  memberUid: string;
}

export interface User extends CreateUser {
  uid: string;
  preferences: string[];
}

export interface CreateUser {
  email: string;
  prenom: string;
  nom: string;
  profil_pic?: string;
  profil_pic_ref?: string;
}