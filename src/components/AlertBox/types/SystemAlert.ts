export enum SystemAlertTypes {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  UNDEFINED = 'undefined'
}

export interface SystemAlert {
  type: SystemAlertTypes;
  message: string;
}
