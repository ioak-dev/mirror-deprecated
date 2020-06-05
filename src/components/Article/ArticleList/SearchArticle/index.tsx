import React, { useEffect, useState } from 'react';
import './style.scss';
import SearchSection from './SearchSection';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  space: string;
}

const queryString = require('query-string');

const SearchArticle = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    text: '',
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  const browseArticle = event => {
    props.history.push(`/${props.space}/article/browse`);
  };

  const handleSearchTextChange = text => {
    props.history.push(`/${props.space}/article/search?text=${text}`);
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text browse-article">
          <div className="page-title">
            Search articles
            <div className="page-subtitle">
              <div className="browse-article-subtitle">
                <div className="hyperlink" onClick={browseArticle}>
                  Or Browse by category instead
                </div>
              </div>
            </div>
            <div className="page-highlight" />
          </div>
          {/* <div className="typography-4 align-horizontal">
            Find your questions answered, from the knowledge base. If you
            don&apos;t get your desired answers, you can post your question for
            response from our customer support team or a community member
          </div> */}
          <SearchSection
            space={props.space}
            history={props.history}
            text={urlParam.text}
            handleSearchTextChange={handleSearchTextChange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchArticle;
