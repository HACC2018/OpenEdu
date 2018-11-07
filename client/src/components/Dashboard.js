import React from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

let Dashboard = connect(
  state => ({
    username: state.openedu.username,
    queue: state.openedu.queue,
    state: state
  }),
  dispatch => ({
    study: (topic) => dispatch(push('/topic/' + topic.id))
  })
)(props =>
  <div className="dashboard">
    { props.queue && <ul className="topic-list">{props.queue.map(topic =>
        <li className="topic-card" key={topic.id}>{
          <h3 onClick={()=>props.study(topic)}>{topic.title}</h3>
        }</li>)}
    </ul> }
  </div>
);

export default Dashboard;
