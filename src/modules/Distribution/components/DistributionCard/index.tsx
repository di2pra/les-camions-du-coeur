import React, { FC } from 'react';

import DistributionDetailSection from './DistributionDetailsSection';
import {
  CentreDeDistribution
} from "../../types";

import {MemberWithUserInfo} from "../../../User/types";
import RegisterSection from './RegisterSection';
import DemandeAdhesionSection from './DemandeAdhesionSection';
import ResponsableSection from './ResponsableSection';
import MembreSection from './MembreSection';
import { User } from "../../../../modules/User/types";

interface Props {
  connectedUser: User | null;
  centre: CentreDeDistribution;
  membreDetailsList: MemberWithUserInfo[];
  centreDemandeAdhesionUserList: User[];
  onRegisterClick: () => void;
  saveAcceptAdhesion: (user: User) => void;
  saveDeclineAdhesion: (user: User) => void;
  onSaveCentreDesc: (descValue: string) => void;
  isConnectedUserResponsable: boolean;
  isConnectedUserMember: boolean;
}

const DistributionCard: FC<Props> = ({connectedUser, centre, membreDetailsList, centreDemandeAdhesionUserList, onRegisterClick, saveAcceptAdhesion, saveDeclineAdhesion, onSaveCentreDesc, isConnectedUserResponsable, isConnectedUserMember}) => {

  return (
    <div id="distribution-details" className="container-fluid container-80">
      <RegisterSection postulants={centre.postulants} connectedUser={connectedUser} onRegisterClick={onRegisterClick} isConnectedUserMember={isConnectedUserMember}  />
      <DistributionDetailSection centre={centre} isConnectedUserResponsable={isConnectedUserResponsable} onSaveCentreDesc={onSaveCentreDesc} />
      <ResponsableSection membres={membreDetailsList} />
      <MembreSection membres={membreDetailsList} />
      <DemandeAdhesionSection saveDeclineAdhesion={saveDeclineAdhesion} saveAcceptAdhesion={saveAcceptAdhesion} centreDemandeAdhesionUserList={centreDemandeAdhesionUserList} isConnectedUserResponsable={isConnectedUserResponsable} />
    </div>
  );
  
}



export default DistributionCard;