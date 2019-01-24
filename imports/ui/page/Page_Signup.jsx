import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

export default class Page_Signup extends PureComponent {
  constructor(props){
    super(props);
  }

  render() {
    console.log('- Page_Signup');

    return (
			<div className="login-wrap d-flex align-items-center">
        <div className="bg-login"></div>
        <div className="container paddingnone">
          <div className="row">
            <div className="col-md-11 col-xl-9 mx-auto">
              <div className="card-login">
                <div className="row">
                  <div className="col-12 col-md-4 info-side">
                  </div>
                  <div className="col-12 col-md-8 p-5 form-side">
                    <div className="row">
                      <div className="col-12">
                        <ul className="nav nav-tabs" role="tablist">
                          <li className="nav-item">
                            <Link to="signin" className="nav-link">Sign in</Link>
                          </li>
                          <li>/</li>
                          <li className="nav-item">
                            <Link to="/signup" className="nav-link active">Sign up</Link>
                          </li>
                          <li>/</li>
                          <li className="nav-item">
                            <Link to="/forgot" className="nav-link">Forgot</Link>
                          </li>
                        </ul>
                      </div>
                      <div className="col-12 col-sm-5 mt-4 mt-sm-5">
                        <div className="tab-content">
                          <div className="tab-pane active" id="signup-form" role="tabpanel">
                            <h6>We need...</h6>
                            <form id="login-form" className="form col-md-12 center-block" onSubmit={this.handleSubmit}>
								<input ref={i=>this.name=i} label="Your Name" autoComplete="username" tabIndex="1" autoFocus={true} />
								<input ref={i=>this.email=i} type="email" label="E-mail" autoComplete="email" tabIndex="2" />
								<input ref={i=>this.pass=i} type="password" label="Password" autoComplete="new-password" tabIndex="3" />
								<input ref={i=>this.pass2=i} type="password" label="Repeat the password" autoComplete="new-password" tabIndex="4" />
								<button type="submit" className="btn btn-primary btn-lg btn-block waves-effect waves-light mt-4" tabIndex="5"><i className="icon icon-arrow-right"></i>Sign up</button>
							</form>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
	);
  }

  handleSubmit = (e) => {
    e.preventDefault();
	let name = this.name.value();
	let email = this.email.value();
	let pass = this.pass.value();
	let pass2 = this.pass2.value();

	if (pass!=pass2) {
		window.Toast('Password mismatch!', 'err');
		return false;
	}

	Accounts.createUser({email: email, username: name, password: pass}, (err) => {
		if(err){
			window.Toast(err.toString(), 'err');
		} else {
			window.Toast('Welcome!', 'ok');
			document.body.classList.remove('notloged')
            document.body.classList.add('loged');
			this.props.history.push('/account/dashboard');
		}
	});
  }
}
