import './App.css'

import LoginContainer from './components/Login.js';

import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom'

import { applyMiddleware, compose, createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk';

import { login, logout } from './actions.js';

import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import { ConnectedRouter } from 'connected-react-router'

import { composeWithDevTools } from 'redux-devtools-extension';

import { push } from 'connected-react-router';

let Dashboard = connect(
  state => ({
    username: state.openedu.username,
    queue: state.openedu.queue,
    state: state
  }),
  dispatch => ({
    study: (topic) => dispatch(push('/topic/' + topic.id))
  })
)(props =>
  <div>
    <p>{props.username}</p>
    { props.queue && <ul>{props.queue.map(topic => <li key={topic.id}>{
      <div>
        <h3 onClick={()=>props.study(topic)}>{topic.title}</h3>
      </div>
    }</li>)}</ul> }
  </div>
);

let UserRoute = connect(
  state => ({ loggedIn: state.openedu.username == null ? false : true })
)(({component: Component, ...props}) =>
  <Route path={props.path} render={() => props.loggedIn ? <Component {...props} /> : <Redirect to="/login" />} />
);

let Topic = (props) => (
  <div>
    <h3>{props.topic.title}</h3>
    <p>{props.topic.content}</p>
  </div>
)

const history = createBrowserHistory()

let OpenEdu = (props) => {
  return (
    <div>
    <header>
      <h1>OpenEdu</h1>
      {props.loggedIn && <button onClick={props.logout}>Logout</button>}
    </header>
    <main>
      <ConnectedRouter history={history}>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/topic/:id" render={({match}) =>
              <Topic topic={props.queue.find(t => t.id == match.params.id)} />
          } />
          <Route exact path="/login"
                 render={() => <LoginContainer />} />
        </Switch>
      </ConnectedRouter>
    </main>
    </div>
  );
}

let OpenEduContainer = connect(
  state => ({
    loggedIn: state.openedu.username == null ? false : true,
    queue: state.openedu.queue
  }),
  dispatch => ({ logout: () => dispatch(logout()) })
)(OpenEdu);

const store = createStore(
  createRootReducer(history), // root reducer with router state
  {},
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      thunk
    ),
  ),
)

let App = (props) => {
  return (
    <Provider store={store}>
      <OpenEduContainer />
    </Provider>
  )
};

export default App;
