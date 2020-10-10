import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import React, {  Suspense, lazy, useContext } from 'react';

import Navbar from './components/Navbar';
import PageLoading from './components/PageLoading';
import Home from './routes/Home';
import {UserContext} from "./providers/UserProvider";

//const Planning = lazy(() => import('./routes/Planning'));
const Planning = lazy(() => import('./routes/Planning'));
const Distribution = lazy(() => import('./routes/Distribution'));
const Signup = lazy(() => import('./routes/Signup'));
const Logout = lazy(() => import('./routes/Logout'));
const Login = lazy(() => import('./routes/Login'));
const Compte = lazy(() => import('./routes/Compte'));
const ResetPassword = lazy(() => import('./routes/ResetPassword'));
const PageNotFound = lazy(() => import('./routes/PageNotFound'));

/*function slowImport(value, ms = 5000) {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}*/





function App() {

  const {connectedUser} = useContext(UserContext);

  return (
    <Router initialPath="/">
      <Navbar />
      <Suspense fallback={<PageLoading/>}>
        <Switch>
          <Route exact path="/" component={Home}/>
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