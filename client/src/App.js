import './scss/app.scss'

import axios from 'axios';

import { login, logout, fetchQueue } from './actions.js';
import createRootReducer from './reducers'

import LoginContainer from './components/Login.js';
import Dashboard from './components/Dashboard.js';
import Topic from './components/Topic.js';

import React from 'react';
import { Route, Redirect, Switch, Link } from 'react-router-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history'
import { push, ConnectedRouter, routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension';
import { save, load } from "redux-localstorage-simple"

  /*
let UserRoute = connect(
  state => ({ loggedIn: state.openedu.username != null ? true : false }),
  dispatch => ({ redirect: () => dispatch(push('/login')) })
)(({component: Component, ...props}) =>
  <Route path={props.path} render={() => {
    if(!props.loggedIn) {
      props.redirect();
      return null;
    }
    return <Component {...props} />;
  }}/>
);
*/

const history = createBrowserHistory()

class OpenEdu extends React.Component {
  componentDidMount() {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.props.jwt;

    if (this.props.loggedIn)
      this.props.refresh();
  }

  render() {
    let props = this.props;

    if (!this.props.loggedIn && this.props.path != '/login')
      this.props.redirectToLogin();

    return (
      <div>
      <header className="app-header">
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
}

let OpenEduContainer = connect(
  state => ({
    path: state.router.location.pathname,
    loggedIn: state.openedu.username == null ? false : true,
    queue: state.openedu.queue,
    jwt: state.openedu.jwt
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
    redirectToLogin: () => dispatch(push('/login')),
    refresh: () => dispatch(fetchQueue())
  })
)(OpenEdu);

const createStoreWithMiddleware = applyMiddleware(
  save() // Saving done here
)(createStore)

const rootReducer = createRootReducer(history);

const store = createStoreWithMiddleware(
  createRootReducer(history), // root reducer with router state
  load(),
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
