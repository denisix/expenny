import React, { Component } from 'react'

import Expense from '../component/Expense'
import SuggestCategory from '../component/SuggestCategory'
import SuggestInput from '../component/SuggestInput'

export default class Page_Expenses extends Component {
  constructor(props) {
  	super(props)
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

	if (props.params && props.params.type) {
		switch(props.params.type) {
			case 'today': this.expenses = props.expenses.filter(i => i.createdAt > this.t_day); break
			case 'week': this.expenses = props.expenses.filter(i => i.createdAt > this.t_week); break
			case 'month': this.expenses = props.expenses.filter(i => i.createdAt > this.t_mon); break
			case 'year': this.expenses = props.expenses.filter(i => i.createdAt > this.t_year); break
			default: this.expenses = props.expenses
		}
	} else {
		this.expenses = props.expenses
	}

	//console.log('props exp => ', props.expenses)
	//console.log('exp => ', this.expenses)
  }

  shouldComponentUpdate(p) {
  	//console.log('- exp should', p)
	if (p.params && p.params.type) {
		switch(p.params.type) {
			case 'today': this.expenses = p.expenses.filter(i => i.createdAt > this.t_day); break
			case 'week': this.expenses = p.expenses.filter(i => i.createdAt > this.t_week); break
			case 'month': this.expenses = p.expenses.filter(i => i.createdAt > this.t_mon); break
			case 'year': this.expenses = p.expenses.filter(i => i.createdAt > this.t_year); break
			default: this.expenses = p.expenses
		}
	} else {
		this.expenses = p.expenses
	}
	return true
  }

  handleSubmit(event) {
    event.preventDefault()
	let inp_date = ''

	if (this.refs.date) {
		inp_date = this.refs.date.value.trim()
		//console.log('inp_date = '+inp_date)
	}

	const inp_title = this.refs.title.value()
	const inp_category = this.refs.category.value()
	const inp_price = parseFloat(this.refs.price.value.trim())

	//console.log('inp: ', inp_title, inp_category, inp_price)

	if (isNaN(inp_price)) {
		this.refs.price.focus()
	} else {
		Meteor.call('exp.insert', inp_title, inp_category, inp_price, inp_date)
		this.refs.title.clear()
		this.refs.title.focus()
	}
	this.refs.price.value = ''
  }

  Enter(event) {
    if (event.keyCode === 13) {
  		event.preventDefault()
		this.handleSubmit(event)
    }
  }

  getCategoryById(catId) {
	const c = this.props.cats_exp.filter(function(v){ return v._id == catId});
	if (c && c[0] && c[0].title) return c[0].title
	return '-'
  }

  getExpSum() {
	return parseInt(this.expenses.reduce((a,i) => a + i.price, 0)*100)/100
  }

  render() {
	const user = this.props.user
    if (!user) return <p>Please login!</p>;

	let sign = '$';
	let order = true;
	let customDate = false;
    if (user && user.profile) {
		if (user.profile.sign) sign = user.profile.sign
		if (user.profile.signOrder) order = !user.profile.signOrder
		if (user.profile.customDate) customDate = user.profile.customDate
    }
	const col = customDate ? "col-3 inp-max" : "col-4 inp-max";
	//console.log('render => ', this.expenses)

    return <div>
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
					  		<SuggestInput ref="title" placeholder="Expense" style={{width:"60%", display:"inline-block"}} items={this.expenses} />
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
									<span className="mt-2 badge badge-light">{this.expenses.length} exp</span>&nbsp;/&nbsp;  
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
                {this.expenses.map(e => <Expense key={e._id} expense={e} category={this.getCategoryById(e.catId)} sign={sign} order={order} />)}
            </ul>
        </div>
  }
}
