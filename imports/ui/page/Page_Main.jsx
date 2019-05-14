import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

import Expense from '../component/Expense.js';
import SuggestCategory from '../component/SuggestCategory.js';
import SuggestExpense from '../component/SuggestExpense.js';

export default class Page_Main extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		if (!this.props.user) return <p>Please login!</p>;
		const user = this.props.user

		console.log('exp => ', this.props.expenses)
		window.EXP = this.props.expenses

		const t = new Date()
		const Y = t.getYear()+1900
		const M = t.getMonth()
		const D = t.getDate()
		let Day = t.getDay()
		if (Day === 0) Day = 7

		const Dweek = t.getDate() - Day + 1

		const t_day	= new Date(Y, M, D, 0, 0, 0);
		const t_week= new Date(Y, M, Dweek, 0, 0, 0)
		const t_mon = new Date(Y, M, 0, 0, 0, 0);
		const t_year= new Date(Y, 0, 0, 0, 0, 0);

		let sign = '$', order = true, customDate = false;
		if (user && user.profile) {
			if (user.profile.sign) sign = user.profile.sign
			if (user.profile.signOrder) order = !user.profile.signOrder
			if (user.profile.customDate) customDate = user.profile.customDate
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
									<SuggestExpense ref="title" placeholder="Expense" style={{width:"60%", display:"inline-block"}} exps={this.props.expenses} />
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
				</ul>

				<div className="row">

					<div className="col-md-4 col-sm-12 mt-3">
						<div className="list-group mx-3">
							<Link to="/expenses" className="list-group-item list-group-item-action active">
								<div className="d-flex w-100 justify-content-between">
									<h5 className="mb-1">Expenses &nbsp; </h5>
									<small></small>
								</div>
							</Link>

							<Link to="/expenses/today" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">Today
								<span className="badge badge-primary">{this.props.expenses.filter(i => i.createdAt > t_day).reduce((a,v) => a+v.price, 0)}</span>
							</Link>
							<Link to="/expenses/week" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">This week
								<span className="badge badge-primary">{this.props.expenses.filter(i => i.createdAt > t_week).reduce((a,v) => a+v.price, 0)}</span>
							</Link>
							<Link to="/expenses/month" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">This month
								<span className="badge badge-primary">{this.props.expenses.filter(i => i.createdAt > t_mon).reduce((a,v) => a+v.price, 0)}</span>
							</Link>
							<Link to="/expenses/year" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">This year
								<span className="badge badge-primary">{this.props.expenses.filter(i => i.createdAt > t_year).reduce((a,v) => a+v.price, 0)}</span>
							</Link>
						</div>
					</div>




					<div className="col-md-4 col-sm-12 mt-3">
						<div className="list-group mx-3">
							<Link to="/exp" className="list-group-item list-group-item-action bg-info text-light">
								<div className="d-flex w-100 justify-content-between">
									<h5 className="mb-1">ToDo &nbsp; </h5>
									<small>3 days ago</small>
								</div>
							</Link>

							<div className="list-group-item d-flex justify-content-between align-items-center">За сегодня <span className="badge badge-info">14</span></div>
							<div className="list-group-item d-flex justify-content-between align-items-center">За неделю <span className="badge badge-info">14</span></div>
							<div className="list-group-item d-flex justify-content-between align-items-center">За месяц <span className="badge badge-info">14</span></div>
							<div className="list-group-item d-flex justify-content-between align-items-center">За год <span className="badge badge-info">14</span></div>
						</div>
					</div>

				</div>
			</div>
		);
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
		return this.props.expenses.length;
	}

	getExpSum() {
		var sum = 0;
		this.props.expenses.forEach((e) => {
			sum += e.price;
		});
		return Math.round(sum*100)/100;
	}
}
