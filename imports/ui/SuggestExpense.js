import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { Expenses } from '../api/db.js';

export default class SuggestExpense extends Component {

  constructor(props) {
	super(props);
	this.state = {
		value: '',
		suggestions: [],
		exps: [],
	};
  }

  getSuggestions(value) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	return inputLength === 0 ? this.state.exps : this.state.exps.filter(x =>
		x.toLowerCase().slice(0, inputLength) === inputValue
	);
  }

  getSuggestionValue(suggestion) {
    return suggestion;
  }

  renderSuggestion(suggestion) {
    return (
	    <span>{suggestion}</span>
	);
  }

  onChange = (event, { newValue, method }) => {
	this.setState({
		value: newValue
	});
  };

  onSuggestionsFetchRequested = ({ value }) => {
	this.setState({
		suggestions: this.getSuggestions(value)
	});
  };

  onSuggestionsClearRequested = () => {
	this.setState({
		suggestions: []
	});
  };

  renderCategory() {
    let exps = this.state.exps;
  	return this.state.exps.map((e, i) => (
      <option key={i}> {e} </option>
    ));
  }
 
  shouldRenderSuggestions(value) {
  	// return value.trim().length > 2;
  	return true;
  }

  render() {
	const { value, suggestions } = this.state;

	var uniq = this.props.exps
		.map((name) => {
	    	return {count: 1, name: name.title}
		})
		.reduce((a, b) => {
			a[b.name] = (a[b.name] || 0) + b.count
				return a
		}, {})
	var sorted = Object.keys(uniq).sort((a, b) => uniq[a] < uniq[b]);
	this.state.exps = sorted;

	//console.log(sorted);
    const inputProps = {
        placeholder: "Expense",
        value,
		suggestions: this.state.exps,
        onChange: this.onChange
    };


	return (
		<Autosuggest 
			suggestions={suggestions}
			onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
			onSuggestionsClearRequested={this.onSuggestionsClearRequested}
			getSuggestionValue={this.getSuggestionValue}
			renderSuggestion={this.renderSuggestion}
			inputProps={inputProps}
			highlightFirstSuggestion={true}
			focusInputOnSuggestionClick={true}
			shouldRenderSuggestions={this.shouldRenderSuggestions}
			/>
    );
  }
}
