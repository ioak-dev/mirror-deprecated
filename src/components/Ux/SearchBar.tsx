import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.scss';
import { searchTextChangedEvent$, searchEvent$ } from '../../events/SearchEvent';

interface Props {
  alt?: boolean
}

interface State {
  searchText: string
}

class SearchBar extends Component<Props, State> {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      searchText: ""
    }
  }

  componentDidMount() {
    this._isMounted = true;
    searchTextChangedEvent$.subscribe(data => {
      if (this._isMounted) {
        this.setState({
          searchText: data
        })
      }
    })
  }

  componentWillUnmount() {
      this._isMounted = false;
  }

  onSubmit = (event) => {
    event.preventDefault();
    searchEvent$.next(this.state.searchText);
  }

  handleChange = (event) => {
    searchTextChangedEvent$.next(event.target.value);
  }

  render() {
    return (
      <form method="GET" onSubmit={this.onSubmit} noValidate>
        <div className={"search-bar" + (this.props.alt ? " alt" : "")}>
            <input name="searchText" spellCheck={false} autoComplete="off" autoFocus placeholder="Mirror, mirror, on the wall, who's the fairest of them all?" required value={this.state.searchText} onChange={this.handleChange}></input>
              <button className="icon">
                <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg></i>
              </button>
        </div>
      </form>
    )
  }
}

export default SearchBar;
