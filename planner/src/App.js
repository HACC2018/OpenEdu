import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { createBrowserHistory } from 'history';

let history = createBrowserHistory();

class MyAppCalendar extends Component {
  state = {
    date: new Date(),
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <div>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
        />
      </div>
    );
  }
}

class CreateTemplate extends Component {
  render() {
    return (
      <div>
      <h1>Create Template</h1>
      <p></p>
      <label>Subject</label>
      <p></p>
      <select>
        <option value="volvo">History</option>
        <option value="saab">Spanish</option>
        <option value="mercedes">Math</option>
        <option value="audi">Computer Science</option>
      </select>
      <p></p>
      <label>Grade Level</label>
      <p></p>

      <select>
        { ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g =>
          <option value="mercedes">{g}</option>) }
      </select>
      <p></p>

      <button onClick={() => this.props.history.push("/new")}>Create!</button>

      </div>
    );
  }
}

class NewTemplate extends Component{
  render()
  {
    return (
      <div>
      <h1>New Template for</h1>
      <h2>Lesson Plan Type</h2>
      <select>
        { ["Daily", "Weekly"].map(g =>
          <option value="volvo">{g}</option>) }
      </select>
      <p></p>
      <button onClick={() => this.props.history.push("/calendar")}>Create Calendar!</button>

      </div>
    );
  }
}
class Main extends Component {
  render() {
      return (
      <div>
        <button onClick={() => this.props.history.push("/create")}>Create Template</button>
        <input></input>
        <button>Search</button>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <div className="App">
        <BrowserRouter history={history}>
          <Switch>
            <Route exact path="/" component={Main}/>
            <Route exact path="/create" component={CreateTemplate}/>
            <Route exact path ="/new" component={NewTemplate}/>
            <Route exact path ="/calendar" component={MyAppCalendar}/>
          </Switch>
        </BrowserRouter>
        </div>
    );
  }
}

export default App;
