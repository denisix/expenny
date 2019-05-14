import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import cx from 'classnames';
import MDReactComponent from 'markdown-react-js';

export default class TodoItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editable: false
		}
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
				className={cx('item', {dragged, hide: !item.opened}) + ' '+mark}
				style={{
					transform: `scale(${scale})`,
					boxShadow: `rgba(0, 0, 0, 0.1) 0px ${shadow}px ${2 * shadow}px 0px`,
				}}
			>
				<div className="dragHandle" {...dragHandleProps} />

				<span className="badge badge-info mr-1">{item.idx+1}</span>
				<span className="badge badge-dark mr-1" onClick={this.setOpened()}>{item.opened?'O':'...'}</span>
				<span className="badge badge-light mr-1">{item.title}</span>
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
					<span className="badge badge-dark mr-2" onClick={this.setMark()}>M</span>

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
