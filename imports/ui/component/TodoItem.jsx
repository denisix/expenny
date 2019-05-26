import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import MDReactComponent from 'markdown-react-js';

export default class TodoItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editable: false
		}
		//console.log('props: ', props)
	}

	handleDelete() {
		if (confirm('Are you sure?')) {
			Meteor.call('todo.rem', this.props.item._id);
		}
	}

	setOpened = () => (e) => {
		Meteor.call('todo.opened', this.props.item._id);
	}

	setEditable = () => (e) => {
		this.props.item.opened ?
			this.setState({ editable: !this.state.editable })
			:
			Meteor.call('todo.opened', this.props.item._id, function() { this.setState({ editable: !this.state.editable }) }.bind(this));
	}

	updateTitle = () => (e) => {
		let title = prompt('Title: ', this.props.item.title);
		Meteor.call('todo.title', this.props.item._id, title);
	}

	updateDesc = () => (e) => {
		Meteor.call('todo.desc', this.props.item._id, this.desc.value);
		this.setState({ editable: false })
	}

	setMark = () => (e) => {
		let m = this.props.item.mark
		if (!m && m!==0) m = 0
		if (m < 5) {
			m++
		} else {
			m = 0
		}
		Meteor.call('todo.mark', this.props.item._id, m);
	}
	
	share = () => (e) => {
		let to = prompt('Share to user ID: ', '');
		Meteor.call('todo.share', this.props.item._id, to);
	}

	areaChanged = () => (e) => {
		this.save.className = 'badge badge-success'
	}

	render() {

		const {item, itemSelected, dragHandleProps} = this.props;
		const scale = itemSelected * 0.01 + 1;
		const shadow = itemSelected * 10 + 0;
		const dragged = itemSelected !== 0;

		let mark
		switch(item.mark) {
			case(0): mark = ''; break
			case(1): mark = 'bg-danger'; break
			case(2): mark = 'bg-success'; break
			case(3): mark = 'bg-warning'; break
			case(4): mark = 'bg-secondary'; break
			case(5): mark = 'bg-dark'; break
		}

		return (

			<div
				className={'item ' + (dragged?'dragged':'') + (item.opened?'':'hide') + ' '+mark}
				style={{
					transform: `scale(${scale})`,
					boxShadow: `rgba(0, 0, 0, 0.1) 0px ${shadow}px ${2 * shadow}px 0px`,
				}}
			>
				<div className="dragHandle" {...dragHandleProps} />

				<span className="badge badge-light text-info mr-1" title="ID">{item.idx+1}</span>
				<span className={'mr-1 oi oi-btn oi-'+(item.opened?'envelope-open':'envelope-closed')} onClick={this.setOpened()} title="Open/Hide"></span>
				<span className="badge badge-light mr-1" onClick={this.updateTitle()}>{item.title}</span>
				{this.state.editable ?
					<>
						<span className="badge badge-secondary mr-2" onClick={this.setEditable()}>Cancel</span>
						<span ref={i=>this.save=i} className="badge badge-secondary" onClick={this.updateDesc()}>Save</span>
					</>
					:
					<span className="badge badge-danger" onClick={this.setEditable()}>Edit</span>
				}
				<span className="badge badge-success"></span>
				<div style={{float:'right'}}>
					{item.shareId ?
						(this.props.commonProps._id === item.shareId ?
							<span className="badge badge-success mr-2" title="Shared with you">{item.shareFrom}</span>
							:
							<span className="badge badge-warning mr-2" onClick={this.share(false)} title="Share">{item.shareName}</span>
						)
						:
						<span className="mr-2 oi oi-btn oi-share text-info" onClick={this.share()} title="Share"></span>
					}

					<span className="mr-2 oi oi-btn oi-brush" onClick={this.setMark()} title="Mark"></span>

					<span className="badge badge-light ml-2 mr-2 rem" onClick={this.handleDelete.bind(this)}>x</span>
				</div>
				{this.state.editable ?
						<div className="mt-2">
							<div className="form-group">
								<textarea ref={i=>this.desc=i} className="form-control todo" id="area1" defaultValue={item.desc} onChange={this.areaChanged()}></textarea>
							</div>
						</div>
						:
						<div className="mt-2 bg-white" style={{ padding: "5px" }}>
							{/* <ReactMarkdown source={item.desc} /> */}
							<MDReactComponent text={item.desc} />
						</div>
				}
			</div>
		);
	}
}
