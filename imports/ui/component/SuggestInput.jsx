import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

export default class SuggestInput extends Component {

  constructor(props) {
	super(props);
	this.state = {
		value: '',
		suggestions: [],
		items: [],
	}
  }

  getSuggestions(value) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	return inputLength === 0 ? this.state.items : this.state.items.filter(x =>
		x.toLowerCase().slice(0, inputLength) === inputValue
	)
  }

  getSuggestionValue(suggestion) {
    return suggestion
  }

  renderSuggestion(suggestion) {
    return <span>{suggestion}</span>
  }

  onChange = (event, { newValue, method }) => {
	this.setState({ value: newValue })
  }

  onSuggestionsFetchRequested = ({ value }) => {
	this.setState({ suggestions: this.getSuggestions(value) })
  }

  onSuggestionsClearRequested = () => {
	this.setState({ suggestions: [] })
  }

  renderCategory() {
  	return this.state.items.map((e, i) => <option key={i}> {e} </option>)
  }
 
  shouldRenderSuggestions(value) {
  	// return value.trim().length > 2
  	return true
  }

  focus() {
	this.instance.input.focus()
  }
  
  clear() {
  	this.state.value = ''
	this.instance.input.value = ''
  }

  value(value) {
  	if (value) this.setState({ value })
	return this.state.value.trim()
  }

  render() {
	const { value, suggestions } = this.state

	let uniq = this.props.items
		.map((name) => {
	    	return {count: 1, name: name.title}
		})
		.reduce((a, b) => {
			a[b.name] = (a[b.name] || 0) + b.count
				return a
		}, {})

	this.state.items = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b])

	return <Autosuggest ref={i=>this.instance = i}
			suggestions={suggestions}
			onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
			onSuggestionsClearRequested={this.onSuggestionsClearRequested}
			getSuggestionValue={this.getSuggestionValue}
			renderSuggestion={this.renderSuggestion}
			inputProps={{
				placeholder: this.props.placeholder,
				value,
				suggestions: this.state.items,
				onChange: this.onChange
			}}
			highlightFirstSuggestion={true}
			focusInputOnSuggestionClick={true}
			shouldRenderSuggestions={this.shouldRenderSuggestions}
			/>
  }
}
