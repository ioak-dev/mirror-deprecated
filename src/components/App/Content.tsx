import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import './style.scss';
import { HashRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
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
import ArticleController from '../Article_Backup/ArticleController';
import ServiceRequests from '../Request';
import UserAdministration from '../UserAdministration';
import constants from '../Constants';
import OakRoute from '../Auth/OakRoute';
import Unauthorized from '../Auth/Unauthorized';
import Dashboard from '../Article/Dashboard';
import CreateArticle from '../Article/CreateArticle';

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
  useEffect(() => {
    props.getProfile();
    props.getAuth();
  }, []);

  return (
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
                    component={Dashboard}
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
  );
};

const mapStateToProps = (state: any) => ({
  authorization: state.authorization,
  user: state.user,
  profile: state.profile, // ,
  //   event: state.event
});

export default connect(mapStateToProps, {
  getAuth,
  addAuth,
  removeAuth,
  getProfile,
  setProfile,
  getUser,
  addUser,
})(withCookies(Content));
