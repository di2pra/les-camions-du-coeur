export interface FormSchema {
  [key: string]: {
    value: string;
    error: string;
    classValue?: string;
  };
}

export interface ValidationSchema {
  [key: string]: {
    required: boolean;
    validator?: {
      regEx: RegExp;
      error: string;
    },
    isEqualTo?: string;
    hasToMatch?: {
      value: string;
      error: string;
    }
  };
}