import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Expenses } from '../../api/db.js';
import { withTracker } from 'meteor/react-meteor-data';

export default class Expense extends Component {
  constructor(props) {
  	super(props);
  }

  handleDelete() {
  	Meteor.call('exp.remove', this.props.expense._id);
  }

  getDate(dt) {
  	const now = new Date();
	const y = dt.getFullYear();
	let m = dt.getMonth() + 1;
	if (m < 10) m = "0"+m;
	let d = dt.getDate();
	if (d < 10) d = "0"+d;
	if (y == now.getFullYear()) {
		return m+"."+d;
	} else {
		return y+"."+m+"."+d;
	}
  }

  render() {
    return (
      <li className="list-group-item">
	  	<span style={{"fontSize":"0.5em", "marginRight":"5px", "marginLeft":"-15px", "color":"#777"}} title={this.props.expense.createdAt.toDateString()}>{this.getDate(this.props.expense.createdAt)}</span>
	  	<span className="badge badge-light">{this.props.expense.title}</span>
		<div style={{float:'right'}}>
			<span className="badge badge-secondary mr-3">{this.props.category}</span>
	        { this.props.order ?
			    <span className="badge badge-warning">{this.props.sign} {this.props.expense.price}</span>
	        :
            	<span className="badge badge-warning">{this.props.expense.price} {this.props.sign}</span>
    	    }
			<span className="badge badge-light ml-2 rem" onClick={this.handleDelete.bind(this)}>x</span>
		</div>
	  </li>
    );
  }
}
