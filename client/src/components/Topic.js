import { fetchQuestion, answerCorrect, answerIncorrect } from '../actions.js';

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

    this.props.fetchQuestion(this.props.topic);
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderAnswerButtons() {
    const topic = this.props.topic;
    const question = this.props.question;

    if (question == null || question.topic_id != topic.id)
      return null;

    return this.props.answers.map(a => (
      <button className={"answer " + this.state.selected }
        onClick={() => {
        if(a.is_correct) {
          this.props.review(topic);
        } else {
          this.props.reset(topic);
        }
        this.setState({correct: a.is_correct, selected: a.id});
        }}>{a.text}</button>))
  }

  render() {
    const topic = this.props.topic;
    const question = this.props.question;

    return (
      <div className="topic">
        <h1>{this.props.topic.title}</h1>
        <ReactMarkdown source={this.props.topic.content} />
        <h1>Exercise</h1>
        <ReactMarkdown source={question.text} />
        {this.renderAnswerButtons()}
        { topic.status != "new" && <button className="reset-topic" onClick={() => this.props.reset(this.props.topic)}>Reset</button> }
      </div>
    );
  }
}

export default connect(
  (state, p) => ({
    topic: state.openedu.queue[p.topic_id],
    question: state.openedu.question,
    answers: state.openedu.answers,
  }),
  dispatch => ({
    review: topic => dispatch(answerCorrect(topic)),
    reset: topic => dispatch(answerIncorrect(topic)),
    fetchQuestion: topic => dispatch(fetchQuestion(topic))
  })
)(Topic);
