import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import OakRoute from '../../Auth/OakRoute';
import './style.scss';
import CreateArticle from '../CreateArticle';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  authorization: any;
  cookies: any;
}

const Dashboard = (props: Props) => {
  const categoryid = '5eca57296a086f066690011s';
  const history = useHistory();

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
    console.log(props.match.params.tenant);
  }, []);

  const nextPath = path => {
    history.push(path);
  };

  return (
    <div className="dashboard">
      <div>Helllooooooooooooooo</div>
      <button
        onClick={() =>
          nextPath(
            `/${props.profile.tenant}/article/create?categoryid=5eca57296a086f066690011s`
          )
        }
      >
        change path
      </button>
      {/* <Route
        path={`/:tenant/article/create?categoryid= ${categoryid}`}
        render={propsLocal => (
          <OakRoute
            {...propsLocal}
            {...props}
            component={CreateArticle}
            middleware={['authenticate']}
          />
        )}
      /> */}
    </div>
  );
};

export default Dashboard;
