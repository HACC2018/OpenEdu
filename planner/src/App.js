import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

let history = createBrowserHistory();

class CreateTemplate extends Component {
  render() {
    return (
      <div>
      <h1>Create Template</h1>
      <label>Subject</label>
      <select>
        <option value="volvo">History</option>
        <option value="saab">Spanish</option>
        <option value="mercedes">Math</option>
        <option value="audi">Computer Science</option>
      </select>
      <label>Grade Level</label>
      <select>
        { ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g =>
          <option value="volvo">{g}</option>) }
      </select>
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
          </Switch>
        </BrowserRouter>
        </div>
    );
  }
}

export default App;
