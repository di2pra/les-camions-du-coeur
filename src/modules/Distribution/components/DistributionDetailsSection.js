import React, { useState, useEffect } from 'react';
import {capitalize} from '../../../components/Helpers';


function DistributionDetailSection({centre, isConnectedUserResponsable, onSaveCentreDesc}) {

  const [state, setState] = useState({
    editMode: false,
    value: ""
  });

  useEffect(() => {

    setState({
      editMode: false,
      value: centre.informations
    })

  }, [centre])

  const handleTextValueChange = (event) => {
    event.preventDefault();

    setState({editMode: true, value: event.target.value});

  }

  const handleEditModeChange = (event) => {
    event.preventDefault();

    setState((previousState) => {
      return {
        ...previousState,
        editMode : !previousState.editMode
      }
    })

  }

  const onUpdateSaveClick = (event) => {

    event.preventDefault();

    onSaveCentreDesc(state.value);

  }

  if(isConnectedUserResponsable) {

    if(state.editMode) {

      return (
        <section className="desc-section">
          <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
          <form>
            <textarea rows="10" value={state.value} onChange={handleTextValueChange} />
            <div className="buttons-container">
              <button onClick={onUpdateSaveClick} type="button" className="btn-animated primary">Enregistrer</button>
              <button onClick={handleEditModeChange} type="button" className="btn-animated secondary">Annuler</button>
            </div>
          </form>
        </section>
      )

      
  
    } else {
  
      return (
        <section className="desc-section">
          <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
          <p>{(state.value == null || state.value === "") ? 'Aucune information' : state.value }</p>
          <div className="buttons-container">
            <button onClick={handleEditModeChange} type="button" className="btn-animated primary">Modifier</button>
          </div>
        </section>
      )
  
    }

  } else {

    return (
      <section className="desc-section">
        <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
        <p>{state.value === "" ? 'Aucune information' : state.value }</p>
      </section>
    )

  }

  
}

export default DistributionDetailSection;