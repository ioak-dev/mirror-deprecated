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

const ArticleList = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  const browseArticle = event => {
    props.history.push(`/${props.space}/article/browse`);
  };

  const searchArticle = event => {
    props.history.push(`/${props.space}/article/search`);
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <div className="page-title">
            Article knowledge base
            <div className="page-subtitle">Home of knowledge</div>
            <div className="page-highlight" />
          </div>
          <div className="typography-4 space-bottom-4">
            Welcome to the world of knowledge. Here you will find articles that
            will answer the question on your mind about this application. You
            can access the articles by different means. Start to explore by
            picking one of the below choices to navigate and reach your desired
            article.
          </div>
          <div className="action-header">
            <OakButton theme="primary" variant="appear" action={searchArticle}>
              Search article
            </OakButton>
            <OakButton theme="primary" variant="appear" action={browseArticle}>
              Browse by category
            </OakButton>
            <OakButton theme="primary" variant="appear" action={browseArticle}>
              View by tags
            </OakButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleList;
