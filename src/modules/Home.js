import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {UserContext} from "./../providers/UserProvider";
import {CalendarIcon, RegisterIcon, LoginIcon, AccountIcon, TruckIcon} from './../components/Icons';

function Home() {

  const {connectedUser} = useContext(UserContext);

  if(connectedUser.uid === "") {
    return (
      <div className="container-fluid">
        <div className="home-card-container">
          <Link className="home-card-link" to="/connexion">
            <div className="home-card">
              <div className="home-card-body">
                <h5 className="card-title">Se connecter</h5>
                <i className="card-icon" ><LoginIcon /></i>
                <p className="card-text">Se connecter pour accèder à l'application</p>
              </div>
            </div>
          </Link>
          <Link className="home-card-link" to="/sinscrire">
            <div className="home-card">
              <div className="home-card-body">
                <h5 className="card-title">Créer votre compte</h5>
                <i className="card-icon" ><RegisterIcon /></i>
                <p className="card-text">Votre premier passage ? Créer votre compte !</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  } else {
    return (
      <div className="container-fluid">
        <div className="home-card-container">
          <Link className="home-card-link" to="/distribution">
            <div className="home-card">
              <div className="home-card-body">
                <h5 className="card-title">Les distributions</h5>
                <i className="card-icon" ><TruckIcon /></i>
                <p className="card-text">Voir les différentes distributions de repas chauds</p>
              </div>
            </div>
          </Link>
          <Link className="home-card-link" to="/planning">
            <div className="home-card">
              <div className="home-card-body">
                <h5 className="card-title">Le planning</h5>
                <i className="card-icon" ><CalendarIcon /></i>
                <p className="card-text">Voir le planning des prochaines distributions</p>
              </div>
            </div>
          </Link>
          <Link className="home-card-link" to="/compte">
            <div className="home-card">
              <div className="home-card-body">
                <h5 className="card-title">Mon Compte</h5>
                <i className="card-icon" ><AccountIcon /></i>
                <p className="card-text">Modifier les informations de votre compte</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    )
  }

	

}

export default Home;