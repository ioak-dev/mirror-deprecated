import React, { useEffect, useState } from 'react';
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
import OakRouteGraph from '../Auth/OakRouteGraph';
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
import { receiveMessage } from '../../events/MessageService';
import EditPost from '../Post/EditPost';
import CreatePost from '../Post/CreatePost';
import ViewPost from '../Post/ViewPost';
import PostsByTag from '../Post/PostHome/PostsByTag';
import SearchPost from '../Post/PostHome/SearchPost';
import BrowsePost from '../Post/PostHome/BrowsePost';
import PostHome from '../Post/PostHome';
import AssetCreateSuccess from '../Asset/CreateAsset/AssetCreateSuccess';
import MyPosts from '../Post/MyPosts/index';
import ListAssets from '../Asset/ListAssets';

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
  const [asset, setAsset] = useState('');

  useEffect(() => {
    receiveMessage().subscribe(event => {
      if (event.name === 'spaceChange') {
        setAsset(event.data);
      }
    });
  }, []);

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_GRAPHQL_URL,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `${asset} ${authorization?.token}` || '',
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
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={OaLogin}
                    />
                  )}
                />
                <Route
                  path="/:asset/unauthorized"
                  render={propsLocal => (
                    <OakRouteGraph
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
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={Landing}
                    />
                  )}
                />
                <Route
                  path="/home"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={Landing}
                    />
                  )}
                />
                <Route
                  path="/tenant"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={Tenant}
                    />
                  )}
                />
                <Route
                  path="/asset/create"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={CreateAsset}
                    />
                  )}
                />
                <Route
                  path="/asset/list"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={ListAssets}
                    />
                  )}
                />
                <Route
                  path="/asset/summary"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={AssetCreateSuccess}
                    />
                  )}
                />
                <Route
                  path="/:asset/home"
                  render={propsLocal => (
                    <OakRouteGraph
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
                    <OakRouteGraph
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
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={ExternLogin}
                    />
                  )}
                />
                <Route
                  path="/:asset/login/oa"
                  render={propsLocal => (
                    <OakRouteGraph
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
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={Email}
                      // middleware={['readAuthentication']}
                    />
                  )}
                />
                {/* Article URLs */}
                <Route
                  path="/:asset/article"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
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
                    <OakRouteGraph
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
                    <OakRouteGraph
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
                    <OakRouteGraph
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
                    <OakRouteGraph
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
                    <OakRouteGraph
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
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={EditArticle}
                      middleware={['authenticate']}
                    />
                  )}
                />

                {/* Post URLs */}
                <Route
                  path="/:asset/post"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={PostHome}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/post/browse"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={BrowsePost}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/post/search"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={SearchPost}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/post/tag"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={PostsByTag}
                      middleware={['authenticate']}
                    />
                  )}
                />

                <Route
                  path="/:asset/post/view"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={ViewPost}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/post/create"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={CreatePost}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/post/edit"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={EditPost}
                      middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset/mypost/mypost"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={MyPosts}
                      middleware={['authenticate']}
                    />
                  )}
                />

                <Route
                  path="/:asset/asset/view"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
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
                    <OakRouteGraph
                      {...propsLocal}
                      {...props}
                      component={EditAsset}
                      // middleware={['authenticate']}
                    />
                  )}
                />
                <Route
                  path="/:asset"
                  exact
                  render={propsLocal => (
                    <OakRouteGraph
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
