import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Page_Signin extends PureComponent {
	constructor(props){
		super(props);
		this.state = {
			focus: (Meteor.isClient && window && window.innerWidth > 575),
		}
	}

	render() {
		console.log('- Page_Signin');

		return (
			<div className="container">
				<div className="row justify-content-center align-items-center" style={{height:'100vh'}}>
					<div className="col-xs-12 col-sm-8 col-md-6 col-lg-4 col-xl-4">
						<div className="card">
							<div className="card-body">
								<form action="" autoComplete="off" onSubmit={this.submit()}>
									<div className="form-group">
                                        <label htmlFor="login">E-mail</label>
										<input ref={i=>this.l=i} type="text" className="form-control" name="username" id="login" />
									</div>
									<div className="form-group">
                                        <label htmlFor="pw">Pass</label>
										<input ref={i=>this.pw=i} type="password" className="form-control" name="password" id="pw" />
									</div>
                                    <div className="form-check mb-3">
                                        <input ref={i=>this.reg=i} className="form-check-input" type="checkbox" value="" id="reg" />
                                        <label className="form-check-label" htmlFor="reg">Register?</label>
                                    </div>

									{this.state.ok && <div className="alert alert-primary" role="alert">{this.state.ok}</div>}
									{this.state.err && <div className="alert alert-danger" role="alert">{this.state.err}</div>}

									<button onClick={this.submit()} type="button" className="btn btn-primary">Login</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	submit = () => (e) => {
		e.preventDefault()
		let em = this.l.value
		let pw = this.pw.value
		let reg = this.reg.checked
		console.log('- login ('+em+', '+pw+')')

		if (reg) {
			Accounts.createUser({email: em, username: em.split('@')[0], password: pw}, (err) => {
				if(err){
					this.setState({err: err.toString() })
				} else {
					this.setState({ok: 'Welcome!'})
				}
			})

		} else {

			Meteor.loginWithPassword(em, pw, (err) => {
				if (err) {
					this.setState({err: err.toString() })
				} else {
					this.setState({ok: 'Successfully logining..'})
				}
			})
		}
	}
}
