import axios from 'axios';
import { push } from 'connected-react-router';

export const LOGOUT = "LOGOUT";
export const CHANGE_USER = "CHANGE_USER";
export const ERROR = "ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const RECEIVE_QUEUE = "RECEIVE_QUEUE";

export function logout() {
  return dispatch => {
    delete axios.defaults.headers.common['Authorization'];
    dispatch({type: LOGOUT});
    dispatch(push('/login'));
  };
}

export function login(email, password) {
  return dispatch => {
    return axios.post(
      'http://localhost:3000/user_token',
      { auth: { email, password } }
    )
    .then(res => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.jwt;
      axios.get('http://localhost:3000/user')
        .then(res => {
          dispatch({ type: CHANGE_USER, user: res.data.username });
          dispatch(fetchQueue());
          dispatch(push("/dashboard"));
        })
      },
      err => {
        dispatch({type: LOGOUT});
        dispatch(timedError("login failed", 2000))
      });
  };
}

export function fetchQueue() {
  return dispatch =>
    axios.get('http://localhost:3000/queue')
         .then(res => dispatch({type: RECEIVE_QUEUE, queue: res.data})
  );
}

export function timedError(what, time) {
  return dispatch => {
    dispatch({ type: ERROR, what });

    return new Promise(resolve => setTimeout(resolve, time))
          .then(() => dispatch({ type: CLEAR_ERROR }));
  };
}
