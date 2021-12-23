import React, { FC, ChangeEvent } from 'react';
import { CompteDisplayOptions } from '../../utils';

interface Props {
  updateState: (displayState: CompteDisplayOptions) => void;
  loadCroppie: (e: ChangeEvent) => void;
}

const CompteMenu: FC<Props> = ({ updateState, loadCroppie }) => {
  return (
    <div className="buttons-container menu">
      <div className="file-input-wrapper">
        <input
          accept="image/png, image/jpeg"
          onChange={loadCroppie}
          type="file"
          name="file"
          id="file"
          className="inputfile"
        />
        <label htmlFor="file" className="primary">
          Changer votre photo de profil
        </label>
      </div>
      <button
        onClick={(e) => updateState(CompteDisplayOptions.UPDATE_PREF)}
        type="button"
        className="btn-animated primary"
      >
        Changer vos préferences
      </button>
      <button
        onClick={(e) => updateState(CompteDisplayOptions.CHANGE_PASSWORD)}
        type="button"
        className="btn-animated primary"
      >
        Changer votre mot de passe
      </button>
      <button
        onClick={(e) => updateState(CompteDisplayOptions.DELETE_ACCOUNT)}
        type="button"
        className="btn-animated primary"
      >
        Supprimer votre compte
      </button>
    </div>
  );
};

export default CompteMenu;