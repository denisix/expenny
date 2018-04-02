import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Expenses } from '../api/db.js';
import { withTracker } from 'meteor/react-meteor-data';

export default class Expense extends Component {
  constructor(props) {
  	super(props);
  }

  handleDelete() {
  	Meteor.call('exp.remove', this.props.expense._id);
  }

  render() {
    return (
      <li className="list-group-item">
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
