import React, { FC } from "react";
import { Link } from "react-router-dom";

import { PinIcon, CalendarIcon } from "../../../../components/Icons";
import { capitalize } from "../../../../components/Helpers";
import {CentreDeDistribution} from '../../types';

interface Props {
  centre: CentreDeDistribution;
}

const CentreItem: FC<Props> = ({ centre }) => {
  return (
    <Link
      className="home-card-link"
      to={"/distribution/" + centre.nom + "/" + centre.jour}
    >
      <div className="home-card">
        <div className="home-card-body">
          <div className="flex-middle">
            <i>
              <PinIcon />
            </i>
            <h3>{capitalize(centre.nom)}</h3>
          </div>
          <div className="flex-middle">
            <i>
              <CalendarIcon />
            </i>
            <h3>le {centre.jour}</h3>
          </div>
          <p className="card-text">
            Voir les informations concernant cette distribution
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CentreItem;
