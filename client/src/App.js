import './App.css'

import rootReducer from './reducers.js';
import LoginContainer from './components/Login.js';

import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk';

import { login, logout } from './actions.js';

let Dashboard = connect(
  state => ({ username: state.username })
)(props =>
  <div>
    <ul>{props.queue.map(topic => <li>{topic}</li>)}</ul>
  </div>
);

let UserRoute = connect(
  state => ({ loggedIn: state.username == null ? false : true })
)(({component: Component, ...props}) =>
  <Route path={props.path} render={() => props.loggedIn ? <Component {...props} /> : <Redirect to="/login" />} />
);

let OpenEdu = (props) => {
  return (
    <div>
    <header>
      <h1>OpenEdu</h1>
      {props.loggedIn && <button onClick={props.logout}>Logout</button>}
    </header>
    <main>
      <Router>
        <Switch>
          <UserRoute exact path="/" component={Dashboard} />
          <Route exact path="/login"
                 render={() => !props.loggedIn ? <LoginContainer /> : <Redirect to="/" />} />
        </Switch>
      </Router>
    </main>
    </div>
  );
}

let OpenEduContainer = connect(
  state => ({ loggedIn: state.username == null ? false : true }),
  dispatch => ({ logout: () => dispatch(logout()) })
)(OpenEdu);

let App = (props) => {
  const store = createStore(rootReducer, applyMiddleware(thunk));

  return (
    <Provider store={store}>
      <OpenEduContainer />
    </Provider>
  )
};

export default App;
