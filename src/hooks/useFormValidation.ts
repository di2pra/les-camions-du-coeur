import { useState, useCallback } from 'react';
import {isEmpty} from '../components/Helpers';
import { FormSchema, ValidationSchema } from '../types/FormSchema';

const useFormValidation = (
  stateSchema: FormSchema,
  validationSchema:ValidationSchema = {},
  callback: (state: FormSchema) => void
) => {

  const [state, setState] = useState<FormSchema>(stateSchema);

  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {

    let newState = {};

    const hasErrorInState = Object.keys(validationSchema).map(key => {
      const isInputFieldRequired = validationSchema[key].required;
      const stateValue = state[key].value; // state value
      const stateError = state[key].error; // state error

      if(isInputFieldRequired && !stateValue && !stateError) {

        newState = {
          ...newState,
          [key]: {
            value: stateValue,
            error: 'Ce champs est obligatoire.',
            classValue: 'is-invalid'
          }
        };

      }

      return (isInputFieldRequired && !stateValue) || stateError;
    });


    if(!isEmpty(newState)) {

      // update the current state with the new one
      setState(prevState => ({
        ...prevState,
        ...newState
      }));

    }


    return hasErrorInState.includes(true);

  }, [state, validationSchema]);



  // Used to handle every changes in every input
  const handleOnChange = useCallback(
    event => {

      const name = event.target.name;
      const value = event.target.value;

      let error = '';

      // required validation
      if (validationSchema[name].required) {
        if (!value) {
          error = 'Ce champs est obligatoire.';
        }
      }

      // equal match validation
      //if(validationSchema[name].hasToMatch !== null && typeof validationSchema[name].hasToMatch === 'object') {
      if(typeof validationSchema[name].hasToMatch === "object") {
          if(
          state[validationSchema[name].hasToMatch!.value].value !== '' &&
          state[validationSchema[name].hasToMatch!.value].value !== value
        ) {
          error = validationSchema[name].hasToMatch!.error;
        }
      }

      // regex validation
      /*if (
        validationSchema[name].validator !== null &&
        typeof validationSchema[name].validator === 'object'
      )*/
      if (typeof validationSchema[name].validator === 'object') {
        if (value && !validationSchema[name].validator!.regEx.test(value)) {
          error = validationSchema[name].validator!.error;
        }
      }

      let newState = {
        [name]: {
          value,
          error,
          classValue: (error === '') ? 'is-valid' : 'is-invalid'
        }
      };

      // isEqual reset field on update
      if(typeof validationSchema[name].isEqualTo !== "undefined") {

        const inputName = validationSchema[name].isEqualTo!;

        newState = {
          ...newState,
          [inputName]: {}
        };

      }

      setState(prevState => ({
        ...prevState,
        ...newState
      }));


    },
    [validationSchema, state]
  );

  const handleOnSubmit = useCallback(
    event => {
      event.preventDefault();

      // Make sure that validateState returns false
      // Before calling the submit callback function
      if (!validateState()) {
        callback(state);
      }
    },
    [state, callback, validateState]
  );

  return { state, handleOnChange, handleOnSubmit };
};

export default useFormValidation;