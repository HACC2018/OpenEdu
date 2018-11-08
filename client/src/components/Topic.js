import { answerCorrect, answerIncorrect } from '../actions.js';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux'

class Topic extends React.Component {
  componentDidUpdate() {
    declare var MathJax;
    declare var hljs;

    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    var els = document.querySelectorAll('pre code');
    for (var i = 0; i < els.length; i++) {
        if (!els[i].classList.contains('hljs')) {
            window.hljs.highlightBlock(els[i]);
        }
    }
  }

  componentDidMount() {
    declare var MathJax;
    declare var hljs;

    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    var els = document.querySelectorAll('pre code');
    for (var i = 0; i < els.length; i++) {
        if (!els[i].classList.contains('hljs')) {
            window.hljs.highlightBlock(els[i]);
        }
    }
  }

  render() {
    const topic = this.props.topic;

    return (
      <div className="topic">
        <h1>{this.props.topic.title}</h1>
        <ReactMarkdown source={this.props.topic.content} />
        { (topic.status == "reviewing" || topic.status == "new") && <button onClick={() => this.props.review(this.props.topic)}>{
          (topic.status == "reviewing" && topic.times_left == 1) ? "Complete" : "Schedule Review"
        }</button> }
        { topic.status != "new" && <button className="reset-topic" onClick={() => this.props.reset(this.props.topic)}>Reset</button> }
      </div>
    );
  }
}

export default connect(
  (state, p) => ({
    topic: state.openedu.queue[p.topic_id]
  }),
  dispatch => ({
    review: topic => dispatch(answerCorrect(topic)),
    reset: topic => dispatch(answerIncorrect(topic))
  })
)(Topic);
