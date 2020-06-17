import React from 'react';
import './style.scss';

interface Props {
  asset: string;
  history: any;
}

const AlternateSection = (props: Props) => {
  const browsePost = event => {
    props.history.push(`/${props.asset}/post/browse`);
  };

  return (
    <div className="search-alternate-section">
      <div className="typography-4 no-post-match-message">
        No posts found matching your search criteria
      </div>
      <div className="section-title">
        Here is what you can do next
        <div className="section-subtitle">Other ways of getting answer</div>
        <div className="section-highlight" />
      </div>
      <div className="no-post-match-action">
        <div className="hyperlink" onClick={browsePost}>
          Browse posts by category
        </div>
        <div className="hyperlink" onClick={browsePost}>
          Submit your question
        </div>
      </div>
    </div>
  );
};

export default AlternateSection;
