import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
//import { Expenses } from '../api/db.js';
import { withTracker } from 'meteor/react-meteor-data';


class Settings extends Component {

  constructor(props) {
	super(props);
	this.state = {
		value: '',
	};
  }

  getSign() {
  	const user = this.props.currentUser;
    if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "sign" in user.profile) {
        return user.profile.sign;
    }
    return '$';
  }

  getSignOrder(lr) {
	const user = this.props.currentUser;
    if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "signOrder" in user.profile) {
		return (lr == 'l') ? !user.profile.signOrder : user.profile.signOrder;
    }
    return lr == 'l' ? true : false;
  }

  handleSettings(event) {
    console.log('settings..');
    event.preventDefault();
    const inp_sign = ReactDOM.findDOMNode(this.refs.sign).value.trim();
    const inp_signOrder = ReactDOM.findDOMNode(this.refs.signOrder).value.trim();

    console.log('inp_sign = '+inp_sign);
    Meteor.users.update({_id: Meteor.userId()}, {$set: {
		"profile.sign": inp_sign,
		"profile.signOrder": inp_signOrder == 1 ? true : false,
	}});

	this.setState({
		value: 'Updated.'
	});
  }

  render() {

	if (!this.props.currentUser) return <p>Please login!</p>;

    return (
		<div>
			<form onSubmit={this.handleSettings.bind(this)}>
				<table width="100%">
				<tbody>
					<tr>
						<td>Financial sign:</td>
						<td><input className="sign" ref="sign" size="5" placeholder={this.getSign()} defaultValue={this.getSign()} /></td>
						<td>
							<input type="radio" ref="signOrder" name="signOrder" defaultValue="0" defaultChecked={this.getSignOrder('l')} /> Left
							&nbsp;
							<input type="radio" ref="signOrder" name="signOrder" defaultValue="1" defaultChecked={this.getSignOrder('r')} /> Right
						</td>
					</tr>
					<tr>
						<td colSpan="3" className="right"><b>{this.state.value}</b> &nbsp; <input className="btn-apply" type="submit" defaultValue="Save" /></td>
					</tr>
				</tbody>
				</table>
				<a className="ver">ver.0.0.1</a>
			</form>
		</div>
	);
  }
}

export default withTracker(() => {
	const user = Meteor.user();
	return {
		loading: !user,
		currentUser: user,
	};
})(Settings);
