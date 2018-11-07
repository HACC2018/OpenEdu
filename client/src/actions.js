import axios from 'axios';
import { push } from 'connected-react-router';

export const LOGOUT = "LOGOUT";
export const CHANGE_USER = "CHANGE_USER";
export const ERROR = "ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const RECEIVE_QUEUE = "RECEIVE_QUEUE";
export const EMPTY_QUEUE = "EMPTY_QUEUE";

const api_url = 'http://192.168.1.102:3000/'

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
      api_url + 'user_token',
      { auth: { email, password } }
    )
    .then(res => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.jwt;
      axios.get(api_url + 'user')
        .then(res => {
          dispatch({ type: CHANGE_USER, user: res.data.username });
          dispatch(fetchQueue());
        })
      },
      err => {
        dispatch({type: LOGOUT});
        dispatch(timedError("login failed", 2000))
        alert(JSON.stringify(err));
      });
  };
}

export function fetchQueue() {
  return dispatch => {
    dispatch({type: EMPTY_QUEUE});
    dispatch(push('/dashboard'));
    axios.get(api_url + 'queue')
         .then(res => dispatch({type: RECEIVE_QUEUE, queue: res.data}))
  }
}

export function completeTopic(topic) {
  return dispatch => {
    return axios.post(api_url + 'complete/' + topic.id, {complete: true})
      .then(() => dispatch(push('/dashboard')))
      .then(res => dispatch(fetchQueue()))
  };
}

export function timedError(what, time) {
  return dispatch => {
    dispatch({ type: ERROR, what });

    return new Promise(resolve => setTimeout(resolve, time))
          .then(() => dispatch({ type: CLEAR_ERROR }));
  };
}
