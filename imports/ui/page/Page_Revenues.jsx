import React, { Component } from 'react'

import Revenue from '../component/Revenue'
import SuggestCategory from '../component/SuggestCategory'
import SuggestInput from '../component/SuggestInput'

export default class Page_Revenues extends Component {
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
			case 'today': this.revenues = props.revenues.filter(i => i.createdAt > this.t_day); break
			case 'week': this.revenues = props.revenues.filter(i => i.createdAt > this.t_week); break
			case 'month': this.revenues = props.revenues.filter(i => i.createdAt > this.t_mon); break
			case 'year': this.revenues = props.revenues.filter(i => i.createdAt > this.t_year); break
			default: this.revenues = props.revenues
		}
	} else {
		this.revenues = props.revenues
	}
  }

  shouldComponentUpdate(p) {
	if (p.params && p.params.type) {
		switch(p.params.type) {
			case 'today': this.revenues = p.revenues.filter(i => i.createdAt > this.t_day); break
			case 'week': this.revenues = p.revenues.filter(i => i.createdAt > this.t_week); break
			case 'month': this.revenues = p.revenues.filter(i => i.createdAt > this.t_mon); break
			case 'year': this.revenues = p.revenues.filter(i => i.createdAt > this.t_year); break
			default: this.revenues = p.revenues
		}
	} else {
		this.revenues = p.revenues
	}
	return true
  }

  handleSubmit(event) {
    event.preventDefault()
	const inp_title = this.refs.title.value()
	const inp_category = this.refs.category.value()
	const inp_price = parseFloat(this.refs.price.value.trim())

	if (isNaN(inp_price)) {
		this.refs.price.focus()
	} else {
		Meteor.call('rev.insert', inp_title, inp_category, inp_price)
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
	const c = this.props.cats_rev.filter(function(v){ return v._id == catId})
	if (c && c[0] && c[0].title) return c[0].title
	return '-'
  }

  getRevSum() {
	return parseInt(this.revenues.reduce((a,i) => a + i.price, 0)*100)/100
  }

  render() {
	const user = this.props.user
    if (!user) return <p>Please login!</p>

	let sign = '$';
	let order = true;
    if (user && user.profile) {
		if (user.profile.sign) sign = user.profile.sign
		if (user.profile.signOrder) order = !user.profile.signOrder
    }

    return <div>
            <ul className="list-group">
				<li className="list-group-item">
					<form className="new-revenue" onSubmit={this.handleSubmit.bind(this)}>
					<div className="row">
						<div className="col-4">
					  		<SuggestInput ref="title" placeholder="Revenue" style={{width:"60%", display:"inline-block"}} items={this.revenues} />
					  	</div>
						<div className="col-4">
					  		<SuggestCategory ref="category" style={{width:"30%"}} cats={this.props.cats_rev} />
					  	</div>
						<div className="col-4">
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
									<span className="mt-2 badge badge-light">{this.revenues.length} rev</span>&nbsp;/&nbsp; 
									{order ? (
										<span className="mt-2 badge badge-success">
										{sign} {this.getRevSum()}
										</span>
									) : (
										<span className="mt-2 badge badge-success">
										{this.getRevSum()} {sign}
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
					</form>
				</li>
                {this.revenues.map(r => <Revenue key={r._id} rev={r} category={this.getCategoryById(r.catId)} sign={sign} order={order} />)}
            </ul>
        </div>
  }
}
