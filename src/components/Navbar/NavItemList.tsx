import React, { FC } from 'react';
import { User } from '../../modules/User/types';
import NavItem from './NavItem';

interface Props {
  connectedUser: User | null
}

const NavItemList: FC<Props> = ({connectedUser})  => {

  if(connectedUser == null) {
    return (
      <ul className="navbar-nav">
        <NavItem to="/" title="Accueil" />
        <NavItem to="/connexion" title="Se connecter" />
        <NavItem to="/sinscrire" title="S'inscrire" />
      </ul>
    );
  } else {
    return (
      <ul className="navbar-nav">
        <NavItem to="/" title="Accueil" />
        <NavItem to="/distribution" title="Les distributions" />
        <NavItem to="/planning" title="Le planning" />
        <NavItem to="/compte" title="Mon compte" />
        <NavItem to="/deconnexion" title="Se déconnecter" />
      </ul>
    )
  }

}

export default NavItemList;