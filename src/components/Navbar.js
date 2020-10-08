import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from "./../providers/UserProvider";
import {ListIcon} from './../components/Icons';


function NavItem({to, title}) {

  let location = useLocation();

  const OnClick = (event) => {
    document.getElementById("navbar-toggle").checked = false;
  }

  const currentMainPath = "/" + location.pathname.split("/")[1];

  return (<li className={"nav-item " + ((currentMainPath === to) ? 'active' : '')}><Link onClick={OnClick} to={to} className="nav-link" >{title}</Link></li>);
}

function Navbar() {
  
  const {connectedUser} = useContext(UserContext);

  return (
    <nav id="navbar">
      <Link to="/" className="navbar-brand" >Les camions du coeur</Link>

      <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
      <label type="button" htmlFor="navbar-toggle" className="navbar-toggle-label"><ListIcon /></label>

      <div className="navbar-menu" id="navbar-menu">
        <NavItemList connectedUser={connectedUser} />
      </div>

    </nav>
  )

}

function NavItemList({connectedUser}) {

  if(connectedUser.uid === "") {
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


export default Navbar;