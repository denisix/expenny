import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Expenses, Cats } from '../api/db.js';
import Expense from './Expense.js';
import SuggestCategory from './SuggestCategory.js';
import SuggestExpense from './SuggestExpense.js';

class Exp extends Component {
  handleSubmit(event) {
    event.preventDefault();
	const inp_title = this.refs.title.state.value.trim();
	const inp_category = this.refs.category.state.value.trim();
	const inp_price = parseFloat(ReactDOM.findDOMNode(this.refs.price).value.trim());

	if (isNaN(inp_price)) {
		ReactDOM.findDOMNode(this.refs.price).value = '0';
		ReactDOM.findDOMNode(this.refs.price).focus();
	} else {
		Meteor.call('exp.insert', inp_title, inp_category, inp_price);

		ReactDOM.findDOMNode(this.refs.title).value = '';
		ReactDOM.findDOMNode(this.refs.price).value = '';
		ReactDOM.findDOMNode(this.refs.title).focus();
	}
  }

  Enter(event) {
    if (event.keyCode === 13) {
  		event.preventDefault();
		//console.log('- enter!');
		this.handleSubmit(event);
    }
  }

  getCategoryById(catId) {
	const c = this.props.cats.filter(function(v){ return v._id == catId});
	if (c && typeof c === "object" && 0 in c) {
		//console.log(' category '+ catId +' => '+c[0].title);
		return c[0].title;
	}
	return '-';
  }

  getExpCount() {
	return this.props.expenses.length;
  }

  getExpSum() {
    var sum = 0;
	this.props.expenses.forEach((e) => {
		sum += e.price;
	});
	return Math.round(sum*100)/100;
  }

  render() {

	const user = this.props.currentUser;
    if (!user || typeof user !== "object") return <p>Please login!</p>;

	let sign = '$';
	let order = true;
    if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object") {
		if ("sign" in user.profile) sign = user.profile.sign;
		if ("signOrder" in user.profile) order = !user.profile.signOrder;
    }

    return (
        <div>
            <ul className="list-group">
				<li className="list-group-item">
					<form className="new-expense" onSubmit={this.handleSubmit.bind(this)}>
					<div className="row">
						<div className="col-4 inp-max">
					  		<SuggestExpense ref="title" placeholder="Expense" style={{width:"60%", display:"inline-block"}} exps={this.props.expenses} />
					  	</div>
						<div className="col-4 inp-max">
					  		<SuggestCategory ref="category" style={{width:"30%"}} cats={this.props.cats} />
					  	</div>
						<div className="col-4 inp-max">
							<div className="row">
								<div className="col-md">
									{order ? (
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">{sign}</span>
										</div>
										<input type="text" className="form-control" ref="price" placeholder="0.00" style={{width:"10%", display:"inline-block"}} onKeyDown={this.Enter.bind(this)} />
									</div>
									) : (
									<div className="input-group">
										<input type="text" className="form-control" ref="price" placeholder="0.00" style={{width:"10%", display:"inline-block"}} onKeyDown={this.Enter.bind(this)} />
										<div className="input-group-prepend">
											<span className="input-group-text">{sign}</span>
										</div>
									</div>
									)}
								</div>
								<div className="col-6 summarize">
									<span className="mt-2 badge badge-light">{this.getExpCount()} exp</span>&nbsp;/&nbsp;  
									{order ? (
										<span className="mt-2 badge badge-warning">
										{sign} {this.getExpSum()}
										</span>
									) : (
										<span className="mt-2 badge badge-warning">
										{this.getExpSum()} {sign}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
					</form>
				</li>
                {this.props.expenses.map((expense) => (
            		<Expense key={expense._id} expense={expense} category={this.getCategoryById(expense.catId)} sign={sign} order={order} />
                ))}
            </ul>
        </div>
    );
  }
}

export default withTracker(() => {
	Meteor.subscribe('exps');
	Meteor.subscribe('cats');
	return {
		expenses: Expenses.find({}, { sort: { createdAt: -1 } }).fetch(),
		cats: Cats.find({ t: 'exp'}).fetch(),
		currentUser: Meteor.user(),
	};
})(Exp);
