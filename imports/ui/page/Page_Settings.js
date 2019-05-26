import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Page_Settings extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
		};
	}

	getSign() {
		const user = this.props.user;
		if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "sign" in user.profile) {
			return user.profile.sign;
		}
		return '$';
	}

	getSignOrder(lr) {
		const user = this.props.user;
		if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "signOrder" in user.profile) {
			return (lr == 'l') ? !user.profile.signOrder : user.profile.signOrder;
		}
		return lr == 'l' ? true : false;
	}

	getCustomDate() {
		const user = this.props.user;
		if (user && typeof user === "object" && "profile" in user && typeof user.profile === "object" && "customDate" in user.profile) {
			return user.profile.customDate;
		}
		return false;
	}

	handleSettings(event) {
		console.log('settings..');
		event.preventDefault();
		const inp_sign = ReactDOM.findDOMNode(this.refs.sign).value.trim();
		const inp_signOrderL = ReactDOM.findDOMNode(this.refs.signOrderL).checked;
		const inp_customDate = ReactDOM.findDOMNode(this.refs.customDate).checked;

		console.log('inp_sign = '+inp_sign+' inp_signOrderL='+inp_signOrderL+' inp_customDate='+inp_customDate);
		Meteor.users.update({_id: Meteor.userId()}, {$set: {
			"profile.sign": inp_sign,
			"profile.signOrder": !inp_signOrderL,
			"profile.customDate": inp_customDate,
		}});

		this.setState({
			value: 'Updated.'
		});
	}

	handleLogout = () => (e) => {
		console.log('- logout..');
		e.preventDefault();
		const self = this
		Meteor.logout(err => {
			if (err) {
				console.log( err.reason );
			} else {
				//self.header.classList.remove('loged');
				//self.header.classList.add('notloged')
				setTimeout( () => { self.props.history.push('/') }, 1000);
			}
		});
	}


	render() {

		if (!this.props.user) return <p>Please login!</p>;

		return (
			<div className="py-3 px-3">
				<form onSubmit={this.handleSettings.bind(this)}>
					<p>Your user ID: <b>{this.props.user._id}</b></p>

					<table width="100%">
						<tbody>
							<tr>
								<td>Financial sign:</td>
								<td><input className="sign" ref="sign" size="5" placeholder={this.getSign()} defaultValue={this.getSign()} /></td>
							</tr>
							<tr>
								<td>Sign at left side:</td>
								<td>
									<input type="checkbox" ref="signOrderL" defaultChecked={this.getSignOrder('l')} /> Left side
								</td>
							</tr>
							<tr>
								<td>Allow custom date:</td>
								<td><input type="checkbox" ref="customDate" defaultChecked={this.getCustomDate()} /></td>
							</tr>
							<tr>
								<td colSpan="3" className="right"><b>{this.state.value}</b> &nbsp; <button className="btn btn-primary" type="submit">Save</button></td>
							</tr>
						</tbody>
					</table>
					<a className="ver">ver.0.0.2</a>
				</form>

				<button className="btn btn-danger" onClick={this.handleLogout()}>Logout</button>
			</div>
		);
	}
}
