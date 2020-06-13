import React from 'react';
import './style.scss';

interface Props {
  asset: string;
  history: any;
}

const AlternateSection = (props: Props) => {
  const browseArticle = event => {
    props.history.push(`/${props.asset}/article/browse`);
  };

  const browsePost = event => {
    props.history.push(`/${props.asset}/post`);
  };

  const createPost = event => {
    props.history.push(`/${props.asset}/post/create`);
  };

  return (
    <div className="search-alternate-section">
      <div className="typography-4 no-article-match-message">
        No articles found matching your search criteria
      </div>
      <div className="section-title">
        Here is what you can do next
        <div className="section-subtitle">Other ways of getting answer</div>
        <div className="section-highlight" />
      </div>
      <div className="no-article-match-action">
        <div className="hyperlink" onClick={browseArticle}>
          Browse articles by category
        </div>
        <div className="hyperlink" onClick={browsePost}>
          Search posts from other users
        </div>
        <div className="hyperlink" onClick={browsePost}>
          Submit your question
        </div>
      </div>
    </div>
  );
};

export default AlternateSection;
