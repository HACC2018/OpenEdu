import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import { LOGOUT, CHANGE_USER, ERROR, CLEAR_ERROR, RECEIVE_QUEUE, EMPTY_QUEUE } from './actions.js';

let rootReducer = (state, action) => {
  switch(action.type) {
    case LOGOUT:
      return { ...state, username: null, queue: null };
    case CHANGE_USER:
      return { ...state, username: action.user, jwt: action.jwt };
    case ERROR:
      return { ...state, error: action.what };
    case CLEAR_ERROR:
      return { ...state, error: null };
    case RECEIVE_QUEUE:
      return { ...state, queue: action.queue, courses: action.courses };
    case EMPTY_QUEUE:
      return { ...state, queue: null, courses: null };
    case "RECEIVE_QUESTION":
      return { ...state, question: action.question, answers: action.answers };
    default:
      return {...state};
  }
}

export default (history) => combineReducers({
  router: connectRouter(history),
  openedu: rootReducer
})

