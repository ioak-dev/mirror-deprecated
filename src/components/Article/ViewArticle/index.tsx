import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.scss';
import ArticleItem from './ArticleItem';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  space: string;
}

const queryString = require('query-string');

const ViewArticle = (props: Props) => {
  const authorization = useSelector(state => state.authorization);

  const [urlParam, setUrlParam] = useState({
    id: '',
  });

  useEffect(() => {
    props.setProfile({
      ...props.profile,
      tenant: props.match.params.tenant,
    });
  }, []);

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <ArticleItem
            {...props}
            authorization={authorization}
            id={urlParam.id}
            space={props.space}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewArticle;
