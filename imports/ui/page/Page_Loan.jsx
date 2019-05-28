import React, { Component } from 'react';
import DraggableList from 'react-draggable-list'

import LoanItem from '../component/LoanItem'

export default class Page_Loan extends Component {
	constructor(props) {
		super(props);
		this.state = {
			useContainer: false,
		}
	}

	render() {
		const user = this.props.user
		if (!user || typeof user !== "object") return <p>Please login!</p>

			const {useContainer} = this.state	

		return <div>
			<div>
				<ul className="list-group">
					<li className="list-group-item">
						<form className="new-loan" onSubmit={this.handleAdd.bind(this)}>
							<div className="row">
								<div className="col-md-7 inp-max">
									<input ref="who" className="form-control" placeholder="Who" />
								</div>
								<div className="col-md-4 summarize">
									<input ref="amount" className="form-control" placeholder="Amount" />
								</div>
								<div className="col-md-1 summarize">
									<button type="submit" className="btn btn-primary">Add</button>
								</div>
							</div>
						</form>
					</li>
				</ul>
			</div>

			<div className="list" ref={el => this._container = el }
				style={{
					overflow: useContainer ? 'auto' : '',
					height: useContainer ? '200px' : '',
					border: useContainer ? '1px solid rgba(0,0,0,0.1)' : ''
				}}>
				<DraggableList 
					list={this.props.loans}
					itemKey="_id" 
					template={LoanItem} 
					onMoveEnd={(newList,item,oldIdx,newIdx) => Meteor.call('loan.move', item._id, oldIdx, newIdx)} 
					container={()=>useContainer ? this._container : document.body}
					padding={0}
					commonProps={this.props.user} />
			</div>
		</div>
	}

	dragEnd = (newList,moved,oldIdx,newIdx) => (e) => {
		e.preventDefault()
		console.log('moved: old='+oldIdx+' new='+newIdx+' newList:', newList)
	}

	handleAdd(event) {
		event.preventDefault()
		const who = this.refs.who.value.trim()
		const amount = parseFloat(this.refs.amount.value.trim())

		Meteor.call('loan.insert', who, amount, this.props.loans.length)
		this.refs.who.value = ''
		this.refs.amount.value = ''
		this.refs.who.focus()
	}

	handlePrio = (loan, prio) => (e) => {
		e.preventDefault()
		Meteor.call('loan.prio', loan._id, prio)
	}

	handleDelete() {
		Meteor.call('loan.rem', this.props.loan._id)
	}

	Enter(e) {
		if (e.keyCode === 13) {
			e.preventDefault()
			this.handleAdd(event)
		}
	}
}
