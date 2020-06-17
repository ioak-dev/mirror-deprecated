import React, { useEffect, useState } from 'react';
import './style.scss';
import PostSection from './PostSection';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  asset: string;
}

const queryString = require('query-string');

const BrowsePost = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    categoryid: '',
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  const searchPost = event => {
    props.history.push(`/${props.asset}/post/search`);
  };

  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text browse-post">
          <div className="page-title">
            Browse posts by timeline
            <div className="page-subtitle">
              <div className="browse-post-subtitle">
                <div className="hyperlink" onClick={searchPost}>
                  Or search instead
                </div>
              </div>
            </div>
            <div className="page-highlight" />
          </div>
          <div className="typography-4">
            Here you can explore the posts in forum, by publication month of the
            post
          </div>
          <div className="section-close" />
          <PostSection
            categoryId={urlParam.categoryid}
            history={props.history}
            asset={props.asset}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowsePost;
