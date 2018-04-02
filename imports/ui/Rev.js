import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Revenues, Cats } from '../api/db.js';
import Revenue from './Revenue.js';
import SuggestCategory from './SuggestCategory.js';
import SuggestRevenue from './SuggestRevenue.js';

class Rev extends Component {
  handleSubmit(event) {
    event.preventDefault();
	const inp_title = this.refs.title.state.value.trim();
	const inp_category = this.refs.category.state.value.trim();
	const inp_price = parseFloat(ReactDOM.findDOMNode(this.refs.price).value.trim());

	if (isNaN(inp_price)) {
		ReactDOM.findDOMNode(this.refs.price).value = '0';
		ReactDOM.findDOMNode(this.refs.price).focus();
	} else {
		Meteor.call('rev.insert', inp_title, inp_category, inp_price);
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

  getRevSum() {
    var sum = 0;
	this.props.revenues.forEach((e) => {
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
					<form className="new-revenue" onSubmit={this.handleSubmit.bind(this)}>
					<div className="row">
						<div className="col-4 inp-max">
					  		<SuggestRevenue ref="title" placeholder="Revenue" style={{width:"60%", display:"inline-block"}} revs={this.props.revenues} />
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
									<span className="mt-2 badge badge-light">{this.props.revenues.length} rev</span>&nbsp;/&nbsp; 
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
                {this.props.revenues.map((rev) => (
            		<Revenue key={rev._id} rev={rev} category={this.getCategoryById(rev.catId)} sign={sign} order={order} />
                ))}
            </ul>
        </div>
    );
  }
}

export default withTracker(() => {
	Meteor.subscribe('revs');
	Meteor.subscribe('cats');
	return {
		revenues: Revenues.find({}, { sort: { createdAt: -1 } }).fetch(),
		cats: Cats.find({ t: 'rev' }).fetch(),
		currentUser: Meteor.user(),
	};
})(Rev);
