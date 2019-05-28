import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    render() {
	    const path = this.props.history.location.pathname;
		//console.log('user', this.props.user)
        return(

            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/">
                    <img src="/img/brand.png" width="30" height="30" className="d-inline-block align-top" alt="" />
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <Link className={'navbar-text badge badge-success mr-3 text-dark'+(path==='/settings'?'active':'')} to="/settings">
						{this.props.user.username}
                    </Link>

                    {this.props.user && (
                        <ul className="navbar-nav mr-auto float-right">
                            <li className={path=='/expenses'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/expenses">Expenses</Link>
                            </li>
                            <li className={path=='/revenues'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/revenues">Revenues</Link>
                            </li>
                            <li className={path=='/todo'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/todo">Todo</Link>
                            </li>
                            <li className={path=='/loan'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/loan">Loans</Link>
                            </li>
{/*                            <li className={path=='/chart'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/chart">Chart</Link>
                            </li>
							*/}
                            <li className={path=='/stats'?"nav-item active":"nav-item"}>
                                <Link className="nav-link" to="/stats">Stats</Link>
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
