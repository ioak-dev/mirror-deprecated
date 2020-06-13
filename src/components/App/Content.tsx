import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';

import { InMemoryCache } from 'apollo-boost';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from '@apollo/react-hooks';
import { Route } from 'react-router-dom';
import './style.scss';
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { withCookies } from 'react-cookie';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Home from '../Home';
import Login from '../Auth/Login';
import Landing from '../Landing';
import { getAuth, addAuth, removeAuth } from '../../actions/AuthActions';
import { getUser, addUser } from '../../actions/UserActions';
import { getProfile, setProfile } from '../../actions/ProfileActions';

import Notification from '../Notification';
import Navigation from '../Navigation';
import { httpGet } from '../Lib/RestTemplate';
import { Authorization } from '../Types/GeneralTypes';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import Tenant from '../Tenant';
import Settings from '../Settings';
import ArticleList from '../Article/ArticleList';
import ServiceRequests from '../Request';
import UserAdministration from '../UserAdministration';
import constants from '../Constants';
import OakRoute from '../Auth/OakRoute';
import Unauthorized from '../Auth/Unauthorized';
import CreateArticle from '../Article/CreateArticle';
import ViewArticle from '../Article/ViewArticle';
import EditArticle from '../Article/EditArticle';
import BrowseArticle from '../Article/ArticleList/BrowseArticle';
import SearchArticle from '../Article/ArticleList/SearchArticle';
import ArticlesByTag from '../Article/ArticleList/ArticlesByTag';
import CreateAsset from '../Asset/CreateAsset/index';
import ViewAsset from '../Asset/ViewAsset/index';
import EditAsset from '../Asset/EditAsset';

const themes = {
  themecolor1: getTheme('#69A7BF'),
  themecolor2: getTheme('#99587B'),
  themecolor3: getTheme('#A66C26'),
  themecolor4: getTheme('#37AE82'),
};

function getTheme(color: string) {
  return createMuiTheme({
    palette: {
      primary: {
        main: color,
      },
      secondary: {
        main: color,
      },
    },
  });
}

interface Props {
  getProfile: Function;
  setProfile: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  getUser: Function;
  addUser: Function;
  cookies: any;

  // event: PropTypes.object,
  profile: any;
  authorization: Authorization;
}

const Content = (props: Props) => {
  const authorization = useSelector(state => state.authorization);

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authorization?.token || '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  useEffect(() => {
    props.getProfile();
  }, []);

  return (
    <ApolloProvider client={client}>
      <div
        className={`App ${props.profile.theme} ${props.profile.textSize} ${props.profile.themeColor}`}
      >
        <HashRouter>
          <div className="body">
            <div className="body-content">
              <Notification />
              <MuiThemeProvider theme={themes.themecolor1}>
                <Navigation {...props} />
                <Route
                  path="/login"
                  render={propsLocal => (
                    <OakRoute {...propsLocal} {...props} component={Login} />
                  )}
                />
                <Route
                  path="/:tenant/unauthorized"
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={Unauthorized}
                      middleware={['isAuthenticated']}
                    />
                  )}
                />
                <Route
                  path="/"
                  exact
                  render={propsLocal => (
                    <OakRoute {...propsLocal} {...props} component={Landing} />
                  )}
                />
                <Route
                  path="/home"
                  exact
                  render={propsLocal => (
                    <OakRoute {...propsLocal} {...props} component={Landing} />
                  )}
                />
                <Route
                  path="/tenant"
                  exact
                  render={propsLocal => (
                    <OakRoute {...propsLocal} {...props} component={Tenant} />
                  )}
                />
                <Route
                  path="/asset/create"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={CreateAsset}
                    />
                  )}
                />
                <Route
                  path="/:tenant/home"
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={Home}
                      middleware={['readAuthentication']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/article"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ArticleList}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/article/browse"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={BrowseArticle}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/article/search"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={SearchArticle}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/article/tag"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ArticlesByTag}
                      middleware={['authenticate']}
                    />
                  )}
                />

                <Route
                  path="/:tenant/article/view"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ViewArticle}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/article/create"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={CreateArticle}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/article/edit"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={EditArticle}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/asset/view"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ViewAsset}
                      // middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/asset/edit"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={EditAsset}
                      // middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/settings"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={Settings}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/request"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ServiceRequests}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:tenant/useradministration"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={UserAdministration}
                      middleware={['authenticate', 'isAdmin']}
                    />
                  )}
                />
                <Route
                  path="/:tenant"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={Home}
                      middleware={['readAuthentication']}
                    />
                  )}
                />
              </MuiThemeProvider>
            </div>
          </div>
        </HashRouter>
      </div>
    </ApolloProvider>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user,
  profile: state.profile, // ,
  //   event: state.event
});

export default connect(mapStateToProps, {
  getProfile,
  setProfile,
  getUser,
  addUser,
})(withCookies(Content));
