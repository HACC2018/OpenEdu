import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../actions.js';

let Login = (props) => {
  let emailfield;
  let passwordfield;

  return (
    <div className="App">
      <p>{props.username ? "hello, " + props.username : "not logged in"}</p>
      <input ref={node => (emailfield = node)} />
      <input ref={node => (passwordfield = node)} />
      <button onClick={() => props.login(emailfield.value, passwordfield.value)}>Log In</button>
      <button onClick={() => props.logout()}>Logout</button>
      { props.error ? <p>{props.error}</p> : null }
    </div>
  );
}

const LoginContainer = connect(
  state => ({ ...state, username: state.username }),
  dispatch => ({
    login: (email, password) => dispatch(login(email, password)),
    logout: () => dispatch(logout())
  })
)(Login);

export default LoginContainer;
