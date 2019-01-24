import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
	    const path = this.props.history.location.pathname;
		console.log('user', this.props.user)
        return(

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="#">
                    <img src="/img/brand.png" width="30" height="30" className="d-inline-block align-top" alt="" />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <span className="navbar-text badge badge-success mr-3 text-dark">
						{this.props.user.username}
                    </span>

                    {this.props.user && (
                        <ul className="navbar-nav mr-auto float-right">
                            <li className={(path=='/exp' || path == '/')?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/exp">Expenses</Link>
                            </li>
                            <li className={path=='/rev'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/rev">Revenues</Link>
                            </li>
                            <li className={path=='/todo'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/todo">Todo</Link>
                            </li>
                            <li className={path=='/chart'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/chart">Chart</Link>
                            </li>
                            <li className={path=='/chart2'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/chart2">Stats</Link>
                            </li>
                            <li className={path=='/settings'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/settings">Settings</Link>
                            </li>
                        </ul>
                    )}

                    {!Meteor.isCordova && (
                        <span className="nav-item">
                            <a href="/Exp.apk" className="nav-link" title="Android App (not signed)"><div className="android-div"></div> For Android</a>
                        </span>
                    )}

                </div>
            </nav>
        )
    }
}
