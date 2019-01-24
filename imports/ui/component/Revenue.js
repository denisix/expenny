import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Revenues } from '../../api/db.js';
import { withTracker } from 'meteor/react-meteor-data';

export default class Revenue extends Component {
  constructor(props) {
  	super(props);
  }

  handleDelete() {
  	Meteor.call('rev.remove', this.props.rev._id);
  }

  render() {
    return (
      <li className="list-group-item">
	  	<span className="badge badge-light">{this.props.rev.title}</span>
		<div style={{float:'right'}}>
			<span className="badge badge-secondary mr-3">{this.props.category}</span>
	        { this.props.order ?
			    <span className="badge badge-success">{this.props.sign} {this.props.rev.price}</span>
	        :
            	<span className="badge badge-success">{this.props.rev.price} {this.props.sign}</span>
    	    }
			<span className="badge badge-light ml-2 rem" onClick={this.handleDelete.bind(this)}>x</span>
		</div>
	  </li>
    );
  }
}
