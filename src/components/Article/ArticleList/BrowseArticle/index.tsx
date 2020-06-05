import React, { useEffect, useState } from 'react';
import './style.scss';
import OakButton from '../../../../oakui/OakButton';
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

const BrowseArticle = (props: Props) => {
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

  const searchArticle = event => {
    props.history.push(`/${props.space}/article/search`);
  };

  const handleCategoryChange = id => {
    props.history.push({
      pathname: props.location.pathname,
      search: id ? `?categoryid=${id}` : '',
    });
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text browse-article">
          <div className="page-title">
            Browse articles by category
            <div className="page-subtitle">
              <div className="browse-article-subtitle">
                <div className="hyperlink" onClick={searchArticle}>
                  Or search instead
                </div>
              </div>
            </div>
            <div className="page-highlight" />
          </div>
          <div className="typography-4">
            Articles are grouped based on a logical hierarchy for easier
            navigation. Here you can explore the articles by narrowing down your
            search context in the predefined category structure
          </div>
          <div className="section-close" />
          <CategorySection
            categoryId={urlParam.categoryid}
            handleChange={handleCategoryChange}
            history={props.history}
            space={props.space}
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

export default BrowseArticle;
