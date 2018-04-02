import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Router, Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';

import Exp from './Exp.js';
import Rev from './Rev.js';
import Settings from './Settings.js';
import Chart from './Chart.js';
import NotFound from './NotFound.js';

import AccountsUIWrapper from './Accounts.js';

class App extends Component {
  render() {
	const path = this.props.location.pathname;
    return (
      <div className="container">

<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <a className="navbar-brand" href="#">
  	<img src="/img/brand.png" width="30" height="30" className="d-inline-block align-top" alt="" />
  </a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarSupportedContent">
  	<span className="navbar-text">
		<AccountsUIWrapper /> &nbsp; &nbsp; 
	</span>

	{this.props.currentUser && (
    <ul className="navbar-nav mr-auto float-right">
      <li className={(path=='/exp' || path == '/')?"nav-item active":"nav-item"}>
        <Link className="nav-link" to="/exp">Expenses</Link>
      </li>
      <li className={path=='/rev'?"nav-item active":"nav-item"}>
        <Link className="nav-link" to="/rev">Revenues</Link>
      </li>
      <li className={path=='/chart'?"nav-item active":"nav-item"}>
        <Link className="nav-link" to="/chart">Chart</Link>
      </li>
      <li className={path=='/settings'?"nav-item active":"nav-item"}>
        <Link className="nav-link" to="/settings">Settings</Link>
      </li>
	</ul>
	)}

	{!Meteor.isCordova && (
		<span className="nav-item">
			<a href="/Exp.apk" className="nav-link" title="Android App (not signed)"><div className="android-div"></div> For Android</a>
		</span>
	)}

  </div>
</nav>
        <Switch>
          <Route exact path="/" component={Exp} />
		  <Route exact path="/exp" component={Exp} />
		  <Route exact path="/rev" component={Rev} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/chart" component={Chart} />
          <Route component={NotFound} />
        </Switch>

      </div>
    );
  }
}

export default withRouter(withTracker(() => {
	return {
		currentUser: Meteor.user(),
	};
})(App));
