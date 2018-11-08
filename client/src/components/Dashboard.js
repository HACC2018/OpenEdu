import React from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

let Dashboard = props => {
  let queue = props.queue ? Object.entries(props.queue).map(p => p[1]) : [];

  let keys = [ "new", "completed", "locked" ];
  queue.sort((t1, t2) => {
    if (keys.indexOf(t1.status) < keys.indexOf(t2.status))
      return -1;
    else if (keys.indexOf(t1.status) > keys.indexOf(t2.status))
      return 1;
    return 0;
  });

  return (<div className="dashboard">
    <h1>Study Queue</h1>
        <ul className="topic-list">{queue.map(topic =>
        <li key={topic.id}>{
          <a className={"topic-card " + topic.status} onClick={()=>props.study(topic)}>
            <h3>{topic.title}</h3>
            <span className="topic-course">{props.courses.find(c => c.id == topic.course_id).title}</span>
            <span className={"topic-status " + topic.status}>{topic.status}</span>
          </a>
          }
        </li>)}
    </ul>
  </div>)}

export default connect(
  (state, p) => ({
    username: state.openedu.username,
    queue: state.openedu.queue,
    courses: state.openedu.courses
  }),
  dispatch => ({
    study: (topic) => dispatch(push('/topic/' + topic.id))
  })
)(Dashboard);
