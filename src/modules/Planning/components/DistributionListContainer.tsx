import React, { FC } from 'react';
import AlertBox from '../../../components/AlertBox';
import { capitalize } from '../../../components/Helpers';
import { CentreDeDistribution } from '../../Distribution/types';


interface Props {
  centres: CentreDeDistribution[];
  selectedCentreIndex: number;
  updateSelectedCentre: (index: number) => void;
}


const DistributionListContainer : FC<Props> = ({centres, selectedCentreIndex, updateSelectedCentre}) => {

  if(centres.length > 1) {
    return (
      <ul className="planning-distribution-list">
        {
          centres.map((centre, index) => {
            return <li onClick={index === selectedCentreIndex ? undefined : (e) => { e.preventDefault(); updateSelectedCentre(index);}} className={index === selectedCentreIndex ? 'selected' : ''}  key={index} >{capitalize(centre.nom)} le {centre.jour}</li>;
          })
        }
      </ul>
    );
  } else if(centres.length === 0) {
    return (<AlertBox error={{type: "warning",
    message: "Vous devez d'abord adhérer à une distribution pour pouvoir consulter son planning."}} />);
  } else {
    return null;
  }

};

export default DistributionListContainer;
