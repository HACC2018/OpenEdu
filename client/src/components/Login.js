import React from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../actions.js';

let Login = (props) => {
  let emailfield;
  let passwordfield;

  return (
    <div className="login">
        <label>Email Address</label>
        <input className="email-field" ref={node => (emailfield = node)} />
        <label>Password</label>
        <input ref={node => (passwordfield = node)} />
        <button type="button" onClick={() => props.login(emailfield.value, passwordfield.value)}>Log In</button>
    </div>
  );
}

const LoginContainer = connect(
  state => ({ username: state.openedu.username }),
  dispatch => ({
    login: (email, password) => dispatch(login(email, password))
  })
)(Login);

export default LoginContainer;
