import { completeTopic } from '../actions.js';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux'

class TopicInner extends React.Component {
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
    return (
      <div className="topic">
        <h1>{this.props.topic.title}</h1>
        <ReactMarkdown source={this.props.topic.content} />
        <button onClick={() => this.props.complete(this.props.topic)}>Complete</button>
      </div>
    );
  }
}

let Topic = connect(
  (state, p) => ({ topic: state.openedu.queue.find(t => t.id == p.topic_id) }),
  dispatch => ({ complete: topic => dispatch(completeTopic(topic)) })
)(TopicInner);

export default Topic;
