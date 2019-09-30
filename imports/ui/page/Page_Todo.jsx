import React, { Component } from 'react'
import DraggableList from 'react-draggable-list'

import TodoItem from '../component/TodoItem'
import SuggestInput from '../component/SuggestInput'

export default class Page_Todo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			useContainer: false,
		}
	}

	render() {
		const user = this.props.user
		if (!user) return <p>Please login!</p>

		const {useContainer} = this.state	

		return <div>
			<div>
				<ul className="list-group">
					<li className="list-group-item">
						<form className="new-todo" onSubmit={this.handleAdd.bind(this)}>
							<div className="row">
								<div className="col-md-11">
									<SuggestInput ref="title" placeholder="Todo" style={{width:"95%", display:"inline-block"}} items={this.props.todos} />
								</div>
								<div className="col-md-1 summarize">
									<span className="mt-2 badge badge-light">{this.props.todos.length} todos</span>
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
					list={this.props.todos}
					itemKey="_id" 
					template={TodoItem} 
					onMoveEnd={(newList,item,oldIdx,newIdx) => Meteor.call('todo.move', item._id, oldIdx, newIdx)} 
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
		event.preventDefault();
		const inp_title = this.refs.title.value()

		//console.log('inp_title = '+inp_title)
		Meteor.call('todo.insert', inp_title, this.props.todos.length)
		this.refs.title.clear()
		this.refs.title.focus()
	}

	handlePrio = (todo, prio) => (e) => {
		e.preventDefault()
		console.log('prio todo', todo)
		Meteor.call('todo.prio', todo._id, prio)
	}

	handleDelete() {
		Meteor.call('todo.rem', this.props.todo._id)
	}

	Enter(e) {
		if (e.keyCode === 13) {
			e.preventDefault()
			this.handleAdd(event)
		}
	}
}
