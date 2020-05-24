import React, { useEffect, useState } from 'react';
import './style.scss';
import CategoryTree from '../CategoryTree';
import CreateItem from './CreateItem';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
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
    <div className="createArticle">
      <div className="typography-4">
        <CategoryTree id={urlParam.categoryid} />
      </div>
      <div className="article-container">
        <CreateItem {...props} />
      </div>
    </div>
  );
};

export default CreateArticle;
