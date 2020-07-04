import React from 'react';
import './style.scss';
import OakSubheading from '../../../../oakui/OakSubheading';

interface Props {
  asset: string;
  history: any;
}

const AlternateSection = (props: Props) => {
  const browsePost = () => {
    props.history.push(`/${props.asset}/post/browse`);
  };

  return (
    <div className="search-alternate-section">
      <div className="typography-4 no-post-match-message">
        No posts found matching your search criteria
      </div>
      <OakSubheading
        title="Here is what you can do next"
        subtitle="Other ways of getting answer"
      />
      <div className="no-post-match-action">
        <div className="hyperlink" onClick={browsePost}>
          Browse posts by timeline
        </div>
        <div className="hyperlink" onClick={browsePost}>
          Submit your question
        </div>
      </div>
    </div>
  );
};

export default AlternateSection;
