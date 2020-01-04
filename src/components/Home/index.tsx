import React from 'react';
import './style.scss';
import cover from '../../images/cover.jpg';
import SearchBar from '../Ux/SearchBar';
import { constants } from '../Constants';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import { searchTextChangedEvent$, searchEvent$ } from '../../events/SearchEvent';
import { getBanner } from '../Tenant/TenantService';
import { httpGet, httpPost, httpPut } from "../Lib/RestTemplate";
import { Authorization } from '../Types/GeneralTypes';

const pageYOffsetCutoff = 10;

interface Props {
  setProfile: Function,
  profile: any,
  match: any,
  authorization: Authorization
}

interface State {
  banner: any,
  prevScrollpos: number,
  showMainSearchBar: boolean,
  searchResults: any[]
}

export default class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      banner: null,
      prevScrollpos: window.pageYOffset,
      showMainSearchBar: true,
      searchResults: []
    };
  }

  componentDidMount() {
    // sendMessage('navbar-transparency', true);
    window.addEventListener("scroll", this.handleScroll);
    this.props.setProfile({
      ...this.props.profile,
      tenant: this.props.match.params.tenant
    })

    searchEvent$.subscribe(searchText => this.search(searchText))
  }

  search = (searchText: string) => {
    httpPost('/deeplearning/' + 
    this.props.match.params.tenant + constants.API_URL_PREDICT, searchText,
    {headers: {
        Authorization: this.props.authorization.token
    }}
    ).then ((response) => {
      let predictionMap: any = {};
      response.data.prediction.forEach(element => {
        predictionMap[element.rank] = element.label
      });
      httpGet(constants.API_URL_FAQ + '/' + 
      this.props.match.params.tenant + '/category/' + predictionMap[response.data.prediction.length - 1],
        {
          headers:{
            Authorization: this.props.authorization.token
          }
        })
        .then((faqs) => {
          console.log(faqs.data);
          this.setState({
            searchResults: faqs.data.data
          });
        })
    }).catch(() => {})
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
              <div className="action-bar">
                <button className="primary animate in right align-left">Helpful</button>
                <button className="primary animate in right align-right">Not Helpful</button>
              </div>
              {this.state.searchResults && this.state.searchResults.map(item =>
                <div key={item.question} className="result-record">
                  <div className="question typography-4 space-bottom-2">{item.question}</div>
                  <div className="answer typography-5">{item.answer}</div>
                </div>
              )}
            </div>
        </div>
      </>
    );
  }
}