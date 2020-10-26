import React, { useState, FC } from 'react';
import { capitalize } from '../../../../components/Helpers';

import { CentreDeDistribution } from '../../types';


interface Props {
  centre: CentreDeDistribution; 
  isConnectedUserResponsable: boolean; 
  onSaveCentreDesc: (value: string) => void;
}


const DistributionDetailSection: FC<Props> = ({centre, isConnectedUserResponsable, onSaveCentreDesc}) => {

  const [state, setState] = useState<{editMode: boolean; value: string}>({
    editMode: false,
    value: centre.informations || ''
  });

  const handleTextValueChange = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();

    setState({editMode: true, value: event.target.value});

  }

  const handleEditModeChange = (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    setState((previousState) => {
      return {
        ...previousState,
        editMode : !previousState.editMode
      }
    })

  }

  const onUpdateSaveClick = (event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    onSaveCentreDesc(state.value);
  }

  if(isConnectedUserResponsable) {

    if(state.editMode) {

      return (
        <section className="desc-section">
          <h1>Distribution à {capitalize(centre.nom)} le {centre.jour}</h1>
          <form>
            <textarea rows={10} value={state.value} onChange={handleTextValueChange} />
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
          <p>{(!state.value) ? 'Aucune information' : state.value }</p>
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