import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Route, Switch } from 'react-router';
import { withRouter, Link } from 'react-router-dom';

import '../lib/jquery-3.3.1.slim.min.js'
import '../lib/popper.min.js'
import '../lib/bootstrap.min.js'

import { Expenses, Cats, Revenues, Todos, Loans } from '../api/db.js';

import Page_Signin from './page/Page_Signin';
import Header from './component/Header';

import Page_Main 	from './page/Page_Main'
import Page_Expenses 	from './page/Page_Expenses'
import Page_Revenues	from './page/Page_Revenues'
import Page_Todo 		from './page/Page_Todo'
import Page_Loan 		from './page/Page_Loan'
import Page_Settings 	from './page/Page_Settings'
import Page_Chart 		from './page/Page_Chart.js';
import Page_Chart2 		from './page/Page_Chart2.js';
import NotFound 		from './page/NotFound.js';

class App extends Component {
  constructor(props) {
	super(props)
  }

  render() {

	if (!this.props.ready) return <h4 className="mt-3 ml-3">Loading..</h4>
	if (!this.props.user) return <Page_Signin />

    return (
      <div>

	  	<Header history={this.props.history} user={this.props.user} />

        <Switch>
          <Route exact path="/" render={p => <Page_Main {...this.props} />} />
		  <Route exact path="/expenses/:type?" render={p => <Page_Expenses {...this.props} params={p.match.params} />} />
		  <Route exact path="/revenues/:type?" render={p => <Page_Revenues {...this.props} params={p.match.params} />} />
		  <Route exact path="/todo" render={p => <Page_Todo {...this.props} params={p.match} />} />
		  <Route exact path="/loan" render={p => <Page_Loan {...this.props} params={p.match} />} />
          <Route exact path="/settings" render={p => <Page_Settings {...this.props} />} />
          <Route exact path="/chart" render={p => <Page_Chart {...this.props} params={p.match} />} />
		  <Route exact path="/chart2" render={p => <Page_Chart2 {...this.props} params={p.match} />} />
          <Route component={NotFound} />
        </Switch>

      </div>
    )
  }
}

export default withRouter(withTracker(() => {
	let user = null, ready = true
	if (Meteor.isClient) {
		/*
		const h = [
			Meteor.subscribe('exps'),
			Meteor.subscribe('cats'),
			Meteor.subscribe('revs'),
			Meteor.subscribe('todos'),
		]
		*/
		const h = Meteor.subscribe('all')
		ready = h.ready()   //h.every(i => i.ready())
		user = Meteor.user()
	}
	return {
		ready,
		user,
		todos: Todos.find({}, { sort: { idx: 1 } }).fetch(),
		expenses: Expenses.find({}, { sort: { createdAt: -1 } }).fetch(),
		cats_exp: Cats.find({ t: 'exp'}).fetch(),
		cats_rev: Cats.find({ t: 'rev'}).fetch(),
		revenues: Revenues.find({}, { sort: { createdAt: -1 } }).fetch(),
		loans: Loans.find({}, { sort: { idx: 1 } }).fetch(),
	}
})(App));
