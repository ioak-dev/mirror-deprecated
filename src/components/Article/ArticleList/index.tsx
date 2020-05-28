import React, { useEffect, useState } from 'react';
import './style.scss';
import OakButton from '../../../oakui/OakButton';

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

  const createArticleLink = event => {
    props.history.push(`/${props.space}/article/create`);
  };

  const viewArticleLink = event => {
    props.history.push(`/${props.space}/article/view`);
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="action-header">
            <OakButton
              theme="primary"
              variant="regular"
              action={createArticleLink}
            >
              Create
            </OakButton>
            <OakButton
              theme="primary"
              variant="regular"
              action={viewArticleLink}
            >
              Simulate click of an article from list
            </OakButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
