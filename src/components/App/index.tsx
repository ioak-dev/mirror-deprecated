import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from '../../store';
import './style.scss';
import './metric.scss';
import Content from './Content';
import HealthCheckFailed from '../AppFallback/HealthCheckFailed';
import HealthCheckProgress from '../AppFallback/HealthCheckProgress';
import { httpGet } from '../Lib/RestTemplate';
import constants from '../Constants';

const App = props => {
  const [healthCheck, setHealthCheck] = useState({
    oneauthVerified: false,
    oneauthReachable: false,
  });

  const [mirrorHealthCheck, setMirrorHealthCheck] = useState({
    mirrorVerified: false,
    mirrorReachable: false,
  });

  useEffect(() => {
    httpGet(
      constants.API_HEALTHCHECK_HELLO,
      null,
      process.env.REACT_APP_ONEAUTH_API_URL
    )
      .then(response => {
        if (response.status === 200) {
          setHealthCheck({
            ...healthCheck,
            oneauthVerified: true,
            oneauthReachable: true,
          });
        } else {
          setHealthCheck({
            ...healthCheck,
            oneauthVerified: true,
            oneauthReachable: false,
          });
        }
      })
      .catch(error => {
        setHealthCheck({
          ...healthCheck,
          oneauthVerified: true,
          oneauthReachable: false,
        });
      });
  }, []);

  useEffect(() => {
    httpGet(
      constants.API_MIRROR_HEALTHCHECK_HELLO,
      null,
      process.env.REACT_APP_API_HEALTHCHECK_URL
    )
      .then(response => {
        if (response.status === 200) {
          setMirrorHealthCheck({
            ...healthCheck,
            mirrorVerified: true,
            mirrorReachable: true,
          });
        } else {
          setMirrorHealthCheck({
            ...healthCheck,
            mirrorVerified: true,
            mirrorReachable: false,
          });
        }
      })
      .catch(error => {
        setMirrorHealthCheck({
          ...healthCheck,
          mirrorVerified: true,
          mirrorReachable: false,
        });
      });
  }, []);

  return (
    <Provider store={store}>
      {mirrorHealthCheck.mirrorVerified &&
        mirrorHealthCheck.mirrorReachable &&
        healthCheck.oneauthVerified &&
        healthCheck.oneauthReachable && <Content {...props} />}

      {(mirrorHealthCheck.mirrorVerified || healthCheck.oneauthVerified) &&
        (!mirrorHealthCheck.mirrorReachable ||
          !healthCheck.oneauthReachable) && <HealthCheckFailed />}

      {(!mirrorHealthCheck.mirrorVerified || !healthCheck.oneauthVerified) && (
        <HealthCheckProgress />
      )}
    </Provider>
  );
};

export default App;
