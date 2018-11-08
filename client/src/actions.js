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
      let jwt = res.data.jwt;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt;

      axios.get(api_url + 'user')
        .then(res => {
          dispatch({ type: CHANGE_USER, user: res.data.username, jwt });
          dispatch(fetchQueue());
          dispatch(push('/dashboard'));
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
    axios.get(api_url + 'queue')
      .then(res => {
              dispatch({type: RECEIVE_QUEUE, queue: res.data.topics, courses: res.data.courses});
              let times = Object.entries(res.data.topics)
                .map(([tid, t]) => t)
                .filter(t => t.status == "in_progress")
                .map(t => new Date(t.next_review).getTime())
                .sort();
              if (times.length > 0) {
                const time = 1 + (times[0] - new Date().getTime());
                return new Promise(resolve => setTimeout(resolve, time))
                      .then(() => dispatch(fetchQueue()));
              }
            },
            err => alert("error fetching queue"))
  }
}

export function answerCorrect(topic) {
  return dispatch => {
    return axios.post(api_url + 'correct/' + topic.id)
      .then(() => dispatch(push('/dashboard')), err => alert(JSON.stringify(err)))
      .then(res => dispatch(fetchQueue()))
  };
}

export function answerIncorrect(topic) {
  return dispatch => {
    return axios.post(api_url + 'incorrect/' + topic.id)
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
