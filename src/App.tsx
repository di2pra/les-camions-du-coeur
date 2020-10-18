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

/*function slowImport(value: Promise<{
  default: React.ComponentType<any>;
}>, ms = 5000) {
  return new Promise<{
    default: React.ComponentType<any>;
}>(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}*/

function App() {
  const {connectedUser} = useContext(UserContext);

  return (
    <Router basename="/">
      <Navbar />
      <Suspense fallback={<PageLoading/>}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/new" render={() => (connectedUser == null) ? <Redirect to="/connexion"/> : <NewPlanningCard/>} />
          <Route exact path="/distribution/:nom?/:jour?" render={() => (connectedUser == null) ? <Redirect to="/connexion"/> : <Distribution />} />
          <Route exact path="/planning/:nom?/:jour?" render={() => (connectedUser == null) ? <Redirect to="/connexion"/> : <Planning />} />
          <Route exact path="/compte" render={() => (connectedUser == null) ? <Redirect to="/connexion"/> : <Compte/>} />
          <Route exact path="/sinscrire" render={() => (connectedUser == null) ? <Signup/> : <Redirect to="/"/>}/>
          <Route exact path="/connexion" render={() => (connectedUser == null) ? <Login/> : <Redirect to="/"/> }/>
          <Route exact path="/deconnexion" render={() => (connectedUser == null) ? <Redirect to="/"/> : <Logout />  } />
          <Route exact path="/reinit-mdp" render={() => (connectedUser == null) ? <ResetPassword/> : <Redirect to="/"/> } />
          <Route component={PageNotFound} />
        </Switch>
      </Suspense>
    </Router>
  )
};

export default App;