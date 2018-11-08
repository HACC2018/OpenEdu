import React from 'react';
import { connect } from 'react-redux'
import { push } from 'connected-react-router';

function humanize(str) {
  var frags = str.split('_');
  for (let i = 0; i < frags.length; ++i) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

class Dashboard extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let props = this.props;
    let queue = props.queue ? Object.entries(props.queue).map(p => p[1]) : [];
    let numReviewing = queue.filter(t => t.status == "reviewing").length;
    let numInProgress = queue.filter(t => t.status == "in_progress").length;
    let numNew = queue.filter(t => t.status == "new").length;

    let keys = [ "reviewing", "in_progress", "new", "completed", "locked" ];
    queue.sort((t1, t2) => {
      if (keys.indexOf(t1.status) < keys.indexOf(t2.status))
        return -1;
      else if (keys.indexOf(t1.status) > keys.indexOf(t2.status))
        return 1;
      return 0;
    });

    return (<div className="dashboard">
    <div className="stats">
      <div className="num-new stat">
        <span className="stat-num">{numReviewing}</span>
        <span className="stat-label">Reviewing</span>
      </div>
      <div className="num-completed stat">
        <span className="stat-num">{numInProgress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="num-locked stat">
        <span className="stat-num">{numNew}</span>
        <span className="stat-label">New</span>
      </div>
    </div>
          <ul className="topic-list">{queue.map(topic =>
          <li key={topic.id}>{
            <a className={"topic-card " + topic.status} onClick={
              () => (topic.status != "in_progress" && topic.status != "locked") && props.study(topic)}>
              <h3>{topic.title}</h3>
              <span className="topic-course">{props.courses.find(c => c.id == topic.course_id).title}</span>
              <span className={"topic-status " + topic.status}>{
                topic.status == "in_progress" ? "Review in " + Math.floor((new Date(topic.next_review).getTime() - new Date().getTime())/1000)  : humanize(topic.status)
              }</span>
            </a>
            }
          </li>)}
      </ul>
    </div>)
  }
}

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
