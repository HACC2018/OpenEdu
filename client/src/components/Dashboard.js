import React from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

let Dashboard = connect(
  (state, p) => ({
    username: state.openedu.username,
    queue: state.openedu.queue,
    courses: state.openedu.courses
  }),
  dispatch => ({
    study: (topic) => dispatch(push('/topic/' + topic.id))
  })
)(props =>
  <div className="dashboard">
    <h1>Study Queue</h1>
    { props.queue &&
        <ul className="topic-list">{props.queue.map(topic =>
        <li key={topic.id}>{
          <a className="topic-card" onClick={()=>props.study(topic)}>
            <h3>{topic.title}</h3>
            <span className="topic-course">{props.courses.find(c => c.id == topic.course_id).title}</span>
            <span className="topic-status">New</span>
          </a>
          }
        </li>)}
    </ul> }
  </div>
);

export default Dashboard;
