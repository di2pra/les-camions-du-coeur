export interface Member {
  uid: string,
  utilisateur: string;
  type: string;
}

export interface MemberWithUserInfo extends User {
  type: string;
  memberUid: string;
}

export interface User extends CreateUser {
    uid: string;
}

export interface CreateUser {
  email: string;
  prenom: string;
  nom: string;
  profil_pic?: string;
  profil_pic_ref?: string;
}