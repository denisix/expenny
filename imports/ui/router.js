import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';

import '../lib/jquery-3.2.1.slim.min.js'
import '../lib/popper.min.js'
import '../lib/bootstrap.min.js'

import { Expenses, Cats, Revenues, Todos } from '../api/db.js';

import Page_Signin from './page/Page_Signin';
import Header from './component/Header';

import Page_Expenses 	from './page/Page_Expenses'
import Page_Revenues	from './page/Page_Revenues'
import Page_Todo 		from './page/Page_Todo'
import Page_Settings 	from './page/Page_Settings'
import Page_Chart 		from './page/Page_Chart.js';
import Page_Chart2 		from './page/Page_Chart2.js';
import NotFound 		from './page/NotFound.js';

class App extends Component {
  constructor(props) {
	super(props)
  }

  render() {
	if (this.props.user === false) return <Page_Signin />

	if (!this.props.user || !this.props.ready) return <p>Loading..</p>

    return (
      <div>

	  	<Header history={this.props.history} user={this.props.user} />

        <Switch>
          <Route exact path="/" render={(p) => <Page_Expenses {...this.props} />} />
		  <Route exact path="/exp" render={(p) => <Page_Expenses {...this.props} />} />
		  <Route exact path="/rev" render={(p) => <Page_Revenues {...this.props} />} />
		  <Route exact path="/todo" render={(p) => <Page_Todo {...this.props} />} />
          <Route exact path="/settings" render={(p) => <Page_Settings {...this.props} />} />
          <Route exact path="/chart" render={(p) => <Page_Chart {...this.props} />} />
		  <Route exact path="/chart/2" render={(p) => <Page_Chart2 {...this.props} />} />
          <Route component={NotFound} />
        </Switch>

      </div>
    )
  }
}

export default withRouter(withTracker(() => {
	const user = Meteor.user()
	if (!user) return { user: false }

	const h = [
		Meteor.subscribe('exps'),
		Meteor.subscribe('cats'),
		Meteor.subscribe('revs'),
		Meteor.subscribe('todos'),
	]
	return {
		user: Meteor.user(),
		ready: h.every(i => i.ready()),

		todos: Todos.find({}, { sort: { idx: 1 } }).fetch(),
		expenses: Expenses.find({}, { sort: { createdAt: -1 } }).fetch(),
		cats_exp: Cats.find({ t: 'exp'}).fetch(),
		cats_rev: Cats.find({ t: 'rev'}).fetch(),
		revenues: Revenues.find({}, { sort: { createdAt: -1 } }).fetch(),
	}
})(App));
