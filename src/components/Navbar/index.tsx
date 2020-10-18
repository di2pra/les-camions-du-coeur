import React, { FC , useContext} from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../providers/UserProvider';
import { ListIcon } from '../Icons';
import NavItemList from './NavItemList';

interface Props {
}

const Navbar : FC<Props> = () => {
  
  const {connectedUser} = useContext(UserContext);

  return (
    <nav id="navbar">
      <Link to="/" className="navbar-brand" >Les camions du coeur</Link>

      <input type="checkbox" id="navbar-toggle" className="navbar-toggle" />
      <label htmlFor="navbar-toggle" className="navbar-toggle-label"><ListIcon /></label>

      <div className="navbar-menu" id="navbar-menu">
        <NavItemList connectedUser={connectedUser} />
      </div>

    </nav>
  )

}

export default Navbar;