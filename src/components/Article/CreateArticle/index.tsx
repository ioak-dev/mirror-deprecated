import React, { useEffect, useState } from 'react';
import './style.scss';
import CreateItem from './CreateItem';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  space: string;
}

const queryString = require('query-string');

const CreateArticle = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
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
          <CreateItem {...props} urlParam={urlParam} space={props.space} />
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
