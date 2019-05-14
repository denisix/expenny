import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Expense from '../component/Expense.js';
import SuggestCategory from '../component/SuggestCategory.js';
import SuggestExpense from '../component/SuggestExpense.js';

export default class Page_Expenses extends Component {
  constructor(props) {
  	super(props)

	console.log('props => ', props)

	const t = new Date()
	const Y = t.getYear()+1900
	const M = t.getMonth()
	const D = t.getDate()
	let Day = t.getDay()
	if (Day === 0) Day = 7

	const Dweek = t.getDate() - Day + 1

	this.t_day	= new Date(Y, M, D, 0, 0, 0);
	this.t_week= new Date(Y, M, Dweek, 0, 0, 0)
	this.t_mon = new Date(Y, M, 0, 0, 0, 0);
	this.t_year= new Date(Y, 0, 0, 0, 0, 0);
	this.expenses = []


	if (props.params && props.params.type) {
		switch(props.params.type) {
			case 'today': this.expenses = this.props.expenses.filter(i => i.createdAt > this.t_day); break
			case 'week': this.expenses = this.props.expenses.filter(i => i.createdAt > this.t_week); break
			case 'month': this.expenses = this.props.expenses.filter(i => i.createdAt > this.t_mon); break
			case 'year': this.expenses = this.props.expenses.filter(i => i.createdAt > this.t_year); break
			default: this.expenses = this.props.expenses
		}
	}
  }

  shouldComponentUpdate(p) {
	if (p.params && p.params.type) {
		switch(p.params.type) {
			case 'today': this.expenses = p.expenses.filter(i => i.createdAt > this.t_day); break
			case 'week': this.expenses = p.expenses.filter(i => i.createdAt > this.t_week); break
			case 'month': this.expenses = p.expenses.filter(i => i.createdAt > this.t_mon); break
			case 'year': this.expenses = p.expenses.filter(i => i.createdAt > this.t_year); break
			default: this.expenses = p.expenses
		}
	}
	return true
  }

  handleSubmit(event) {
    event.preventDefault();
	let inp_date = '';

	if ('date' in this.refs) {
		inp_date = ReactDOM.findDOMNode(this.refs.date).value.trim();
		console.log('inp_date = '+inp_date);
	}

	const inp_title = this.refs.title.state.value.trim();
	const inp_category = this.refs.category.state.value.trim();
	const inp_price = parseFloat(ReactDOM.findDOMNode(this.refs.price).value.trim());

	if (isNaN(inp_price)) {
		ReactDOM.findDOMNode(this.refs.price).value = '0';
		ReactDOM.findDOMNode(this.refs.price).focus();
	} else {
		Meteor.call('exp.insert', inp_title, inp_category, inp_price, inp_date);

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
	const c = this.props.cats_exp.filter(function(v){ return v._id == catId});
	if (c && typeof c === "object" && 0 in c) {
		//console.log(' category '+ catId +' => '+c[0].title);
		return c[0].title;
	}
	return '-';
  }

  getExpCount() {
	return this.expenses.length;
  }

  getExpSum() {
    var sum = 0;
	this.expenses.forEach((e) => {
		sum += e.price;
	});
	return Math.round(sum*100)/100;
  }

  render() {

	const user = this.props.user
    if (!user || typeof user !== "object") return <p>Please login!</p>;

	let sign = '$';
	let order = true;
	let customDate = false;
    if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object") {
		if ("sign" in user.profile) sign = user.profile.sign;
		if ("signOrder" in user.profile) order = !user.profile.signOrder;
		if ("customDate" in user.profile) customDate = user.profile.customDate;
    }
	const col = customDate ? "col-3 inp-max" : "col-4 inp-max";

    return (
        <div>
            <ul className="list-group">
				<li className="list-group-item">
					<form className="new-expense" onSubmit={this.handleSubmit.bind(this)}>
					<div className="row">
						{ customDate && (
						<div className="col-2 inp-max">
							<input type="text" ref="date" placeholder="2018.12.27" style={{width:"100%", display:"inline-block", padding:"7px 5px"}} />
						</div>
						)}

						<div className={col}>
					  		<SuggestExpense ref="title" placeholder="Expense" style={{width:"60%", display:"inline-block"}} exps={this.expenses} />
					  	</div>
						<div className={col}>
					  		<SuggestCategory ref="category" style={{width:"30%"}} cats={this.props.cats_exp} />
					  	</div>
						<div className={col}>
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
                {this.expenses.map((expense) => (
            		<Expense key={expense._id} expense={expense} category={this.getCategoryById(expense.catId)} sign={sign} order={order} />
                ))}
            </ul>
        </div>
    );
  }
}
