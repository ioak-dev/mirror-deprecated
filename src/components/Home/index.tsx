import React from 'react';
import './style.scss';
import cover from '../../images/cover.jpg';
import SearchBar from '../Ux/SearchBar';

import { sendMessage, receiveMessage } from '../../events/MessageService';
import { searchTextChangedEvent$, searchEvent$ } from '../../events/SearchEvent';
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
  showMainSearchBar: boolean,
  searchText: string
}

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      banner: null,
      prevScrollpos: window.pageYOffset,
      showMainSearchBar: true,
      searchText: ""
    };
  }

  componentDidMount() {
    // sendMessage('navbar-transparency', true);
    window.addEventListener("scroll", this.handleScroll);
    this.props.setProfile({
      ...this.props.profile,
      tenant: this.props.match.params.tenant
    })

    searchEvent$.subscribe(searchText => {
      this.setState({
        searchText: searchText
      });
    })
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    sendMessage('show-navbar-element', false);
    searchTextChangedEvent$.next("");
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

  handleScroll = () => {
    // const { prevScrollpos } = this.state;
  
    const currentScrollPos = window.pageYOffset;
    const showMainSearchBar = currentScrollPos < pageYOffsetCutoff;

    if (this.state.showMainSearchBar !== showMainSearchBar) {
      if (!showMainSearchBar) {
        // sendMessage('navbar-transparency', false);
        sendMessage('show-navbar-element', true);
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
            {this.state.showMainSearchBar && <SearchBar />}

            <div className='search-results'>
              <br /> Search results goes here
              <br /> {this.state.searchText}
            </div>
        </div>
      </>
    );
  }
}