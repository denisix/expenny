import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { Cats } from '../../api/db.js';

export default class SuggestCategory extends Component {

  constructor(props) {
	super(props);
	this.state = {
		value: '',
		suggestions: [],
		theme: {
			input: 'react-autosuggest__input form-control',
		},
	};
  }

  getSuggestions(value) {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
	return inputLength === 0 ? this.props.cats : this.props.cats.filter(x =>
		x.title.toLowerCase().slice(0, inputLength) === inputValue
	);
  }

  getSuggestionValue(suggestion) {
    return suggestion.title;
  }

  renderSuggestion(suggestion) {
    return (
	    <span>{suggestion.title}</span>
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
    let cats = this.props.cats;
  	return this.props.cats.map((e) => (
      <option key={e._id}> {e.title} </option>
    ));
  }
 
  shouldRenderSuggestions(value) {
  	// return value.trim().length > 2;
  	return true;
  }

  First(p) {
    if (typeof p === "object") {
        for(var i in p) {
            if (typeof p[i] === "object" && 'title' in p[i]) {
                return p[i].title;
            }
        }
    }
	return '';
  }

  componentDidMount() {
	
  }

  render() {
	const { value, suggestions } = this.state;
    const inputProps = {
        placeholder: "Category",
        value,
		suggestions: this.props.cats,
        onChange: this.onChange
    };

	return (
		<Autosuggest
			ref="ref1"
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
