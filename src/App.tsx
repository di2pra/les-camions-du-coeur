import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React, {  Suspense, lazy, useContext } from 'react';

import Navbar from './components/Navbar';
import PageLoading from './components/PageLoading';
import Home from './modules/Home';
import {UserContext} from "./providers/UserProvider";

const Planning = lazy(() => import('./modules/Planning'));
const NewPlanningCard = lazy(() => import('./modules/Planning/NewPlanningCard'));
const Distribution = lazy(() => import('./modules/Distribution'));
const Signup = lazy(() => import('./modules/Auth/Signup'));
const Logout = lazy(() => import('./modules/Auth/Logout'));
const Login = lazy(() => import('./modules/Auth/Login'));
const Compte = lazy(() => import('./modules/Compte'));
const ResetPassword = lazy(() => import('./modules/Auth/ResetPassword'));
const PageNotFound = lazy(() => import('./modules/PageNotFound'));

/*function slowImport(value, ms = 5000) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}*/

function App() {
  const {connectedUser} = useContext(UserContext);

  // TODO: Di2pra si t'as des bugs en rapport avec les redirections, remets initialPath au lieu de  basename
  return (
    <Router basename="/">
      <Navbar />
      <Suspense fallback={<PageLoading/>}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/new" render={() => (connectedUser.uid === "") ? <Redirect to="/connexion"/> : <NewPlanningCard/>} />
          <Route exact path="/distribution/:nom?/:jour?" render={() => (connectedUser.uid === "") ? <Redirect to="/connexion"/> : <Distribution />} />
          <Route exact path="/planning/:nom?/:jour?" render={() => (connectedUser.uid === "") ? <Redirect to="/connexion"/> : <Planning />} />
          <Route exact path="/compte" render={() => (connectedUser.uid === "") ? <Redirect to="/connexion"/> : <Compte/>} />
          <Route exact path="/sinscrire" render={() => (connectedUser.uid === "") ? <Signup/> : <Redirect to="/"/>}/>
          <Route exact path="/connexion" render={() => (connectedUser.uid === "") ? <Login/> : <Redirect to="/"/> }/>
          <Route exact path="/deconnexion" render={() => (connectedUser.uid === "") ? <Redirect to="/"/> : <Logout />  } />
          <Route exact path="/reinit-mdp" render={() => (connectedUser.uid === "") ? <ResetPassword/> : <Redirect to="/"/> } />
          <Route component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  )
};

export default App;