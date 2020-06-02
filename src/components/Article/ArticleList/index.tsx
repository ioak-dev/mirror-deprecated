import React, { useEffect, useState } from 'react';
import './style.scss';
import OakButton from '../../../oakui/OakButton';
import ArticleSection from './ArticleSection';
import CategorySection from './CategorySection';

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
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  const createArticleLink = event => {
    props.history.push(
      `/${props.space}/article/create?categoryid=${urlParam.categoryid}`
    );
  };

  const viewArticleLink = event => {
    props.history.push(`/${props.space}/article/view`);
  };

  const handleCategoryChange = id => {
    props.history.push({
      pathname: props.location.pathname,
      search: `?categoryid=${id}`,
    });
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
          <CategorySection
            categoryId={urlParam.categoryid}
            handleChange={handleCategoryChange}
          />
          <ArticleSection
            categoryId={urlParam.categoryid}
            history={props.history}
            space={props.space}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
