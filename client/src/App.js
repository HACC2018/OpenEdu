import './scss/app.scss'

import LoginContainer from './components/Login.js';
import Dashboard from './components/Dashboard.js';

import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom'

import { applyMiddleware, compose, createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk';

import { login, logout, completeTopic } from './actions.js';

import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import { ConnectedRouter } from 'connected-react-router'

import { composeWithDevTools } from 'redux-devtools-extension';

import { push } from 'connected-react-router';

import ReactMarkdown from 'react-markdown';

import { save, load } from "redux-localstorage-simple"

let UserRoute = connect(
  state => ({ loggedIn: state.openedu.username == null ? false : true })
)(({component: Component, ...props}) =>
  <Route path={props.path} render={() => props.loggedIn ? <Component {...props} /> : <Redirect to="/login" />} />
);


declare var MathJax;
declare var hljs;
class TopicInner extends React.Component {
  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    var els = document.querySelectorAll('pre code');
    for (var i = 0; i < els.length; i++) {
        if (!els[i].classList.contains('hljs')) {
            window.hljs.highlightBlock(els[i]);
        }
    }
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    var els = document.querySelectorAll('pre code');
    for (var i = 0; i < els.length; i++) {
        if (!els[i].classList.contains('hljs')) {
            window.hljs.highlightBlock(els[i]);
        }
    }
  }

  render() {
    return (
      <div className="topic">
        <h1>{this.props.topic.title}</h1>
        <ReactMarkdown source={this.props.topic.content} />
        <button onClick={() => this.props.complete(this.props.topic)}>Complete</button>
      </div>
    );
  }
}

let Topic = connect(
  state => ({}), dispatch => ({ complete: topic => dispatch(completeTopic(topic)) })
)(TopicInner);

const history = createBrowserHistory()

let OpenEdu = (props) => {
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

let OpenEduContainer = connect(
  state => ({
    loggedIn: state.openedu.username == null ? false : true,
    queue: state.openedu.queue
  }),
  dispatch => ({
    logout: () => dispatch(logout()),
    completeTopic: (topic) => dispatch(completeTopic(topic))
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
