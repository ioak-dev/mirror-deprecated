import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import EditItem from './EditItem';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history?: any;
}

const queryString = require('query-string');

const EditArticle = (props: Props) => {
  const authorization = useSelector(state => state.authorization);
  const [urlParam, setUrlParam] = useState({
    articleid: '',
  });

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
    setUrlParam(queryString.parse(props.location.search));
  }, []);

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <EditItem
            history={props.history}
            urlParam={urlParam}
            tenant={props.profile.tenant}
            authorization={authorization}
          />
        </div>
      </div>
    </div>
  );
};

export default EditArticle;
