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
import OaLogin from '../Auth/OaLogin';
import Landing from '../Landing';
import { getUser, addUser } from '../../actions/UserActions';
import { getProfile, setProfile } from '../../actions/ProfileActions';

import Notification from '../Notification';
import Navigation from '../Navigation';
import { Authorization } from '../Types/GeneralTypes';
import Tenant from '../Tenant';
import ArticleHome from '../Article/ArticleHome';
import UserAdministration from '../UserAdministration';
import OakRoute from '../Auth/OakRoute';
import Unauthorized from '../Auth/Unauthorized';
import CreateArticle from '../Article/CreateArticle';
import ViewArticle from '../Article/ViewArticle';
import EditArticle from '../Article/EditArticle';
import BrowseArticle from '../Article/ArticleHome/BrowseArticle';
import SearchArticle from '../Article/ArticleHome/SearchArticle';
import ArticlesByTag from '../Article/ArticleHome/ArticlesByTag';
import CreateAsset from '../Asset/CreateAsset/index';
import ViewAsset from '../Asset/ViewAsset/index';
import EditAsset from '../Asset/EditAsset';
import OneAuth from '../Login/OneAuth/index';
import Email from '../Login/Email/index';
import Login from '../Login/index';
import ExternLogin from '../Auth/ExternLogin';

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
                    <OakRoute {...propsLocal} {...props} component={OaLogin} />
                  )}
                />
                <Route
                  path="/:asset/unauthorized"
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
                  path="/:asset/home"
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
                  path="/:asset/login/home"
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={Login}
                      // middleware={['readAuthentication']}
                    />
                  )}
                />
                <Route
                  path="/:asset/login/extern"
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ExternLogin}
                    />
                  )}
                />
                <Route
                  path="/:asset/login/oa"
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={OneAuth}
                      // middleware={['readAuthentication']}
                    />
                  )}
                />
                <Route
                  path="/:asset/login/email"
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={Email}
                      // middleware={['readAuthentication']}
                    />
                  )}
                />
                <Route
                  path="/:asset/article"
                  exact
                  render={propsLocal => (
                    <OakRoute
                      {...propsLocal}
                      {...props}
                      component={ArticleHome}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/article/browse"
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
                  path="/:asset/article/search"
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
                  path="/:asset/article/tag"
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
                  path="/:asset/article/view"
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
                  path="/:asset/article/create"
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
                  path="/:asset/article/edit"
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
                  path="/:asset/useradministration"
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
                  path="/:asset"
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
