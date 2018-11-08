import React from 'react';
import axios from 'axios';

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
        <button>&#9776;</button>
        {props.loggedIn && <button onClick={props.logout}>asdfLogout</button>}
        <span>asdf</span>
      </header>
      <main>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/topic/:id" render={({match}) =>
                <Topic topic_id={match.params.id} />
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

export default connect(
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
