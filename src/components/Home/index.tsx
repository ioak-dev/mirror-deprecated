import React from 'react';
import './style.scss';
import cover from '../../images/cover.jpg';
import SearchBar from '../Ux/SearchBar';

import { sendMessage, receiveMessage } from '../../events/MessageService';
import { getBanner } from '../Tenant/TenantService';


const pageYOffsetCutoff = 10;

interface Props {
  setProfile: Function,
  profile: any,
  match: any
}

interface State {
  banner: any,
  prevScrollpos: number,
  showMainSearchBar: boolean
}

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      banner: null,
      prevScrollpos: window.pageYOffset,
      showMainSearchBar: true
    };
  }

  componentDidMount() {
    // sendMessage('navbar-transparency', true);
    window.addEventListener("scroll", this.handleScroll);
    this.props.setProfile({
      ...this.props.profile,
      tenant: this.props.match.params.tenant
    })
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    sendMessage('show-navbar-element', false);
    // sendMessage('navbar-transparency', false);
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.authorization) {
        getBanner(this.props.match.params.tenant,  {
          headers: {
              Authorization: nextProps.authorization.token
          }
        }).then ((response) => {
          if (response.status === 200 && response.data) {
            this.setState({banner: 'data:image/jpeg;base64,' + response.data});
          } else {
            this.setState({banner: cover});
          }
        }).catch(() => {
          this.setState({banner: cover});
        })
      }
  }


  handleSearchTextChange = (event) => {
    this.props.setProfile({
      ...this.props.profile,
      searchText: event.target.value
    })
  }

  handleScroll = () => {
    // const { prevScrollpos } = this.state;
  
    const currentScrollPos = window.pageYOffset;
    const showMainSearchBar = currentScrollPos < pageYOffsetCutoff;

    if (this.state.showMainSearchBar !== showMainSearchBar) {
      if (!showMainSearchBar) {
        // sendMessage('navbar-transparency', false);
        sendMessage('show-navbar-element', true, {
          element: 
            <>
              <input name="searchText" autoFocus placeholder="Mirror, mirror, on the wall, who's the fairest of them all?" required value={this.props.profile.searchText} onChange={(event) => this.handleSearchTextChange(event)}></input>
              <button className="icon">
                {/* <i className="material-icons">search</i> */}
                <i><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg></i>
              </button>
            </>
        });
      } else {
        // sendMessage('navbar-transparency', true);
        sendMessage('show-navbar-element', false);
      }
    }
  
    this.setState({
      prevScrollpos: currentScrollPos,
      showMainSearchBar
    });
  };

  render() {
    return (
      <>
        <div className="home full">
            <div className='cover'>
              {/* <img src={cover}/> */}
              <img src={this.state.banner} alt="Red dot" />
            </div>
            {this.state.showMainSearchBar && <SearchBar value={this.props.profile.searchText} handleChange={this.handleSearchTextChange} />}
            <br /> Search results goes here
        </div>
      </>
    );
  }
}