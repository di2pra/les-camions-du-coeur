export interface Error {
  type: string;
  message: string;
}

export interface FirebaseErrors {
  [key: string]: string;
}
