import React from 'react';
import './style.scss';
import OakButton from '../../../oakui/OakButton';
import OakHeading from '../../../oakui/OakHeading';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  asset: string;
}

const ArticleHome = (props: Props) => {
  const browseArticle = event => {
    props.history.push(`/${props.asset}/article/browse`);
  };

  const searchArticle = event => {
    props.history.push(`/${props.asset}/article/search`);
  };

  const viewByTags = event => {
    props.history.push(`/${props.asset}/article/tag`);
  };

  return (
    <OakPage>
      <OakSection>
        <OakHeading
          title="Article knowledge base"
          subtitle="Home of knowledge"
        />
        <div className="typography-4 space-bottom-4">
          Welcome to the world of knowledge. Here you will find articles that
          will answer the question on your mind about this application. You can
          access the articles by different means. Start to explore by picking
          one of the below choices to navigate and reach your desired article.
        </div>
        <div className="action-header">
          <OakButton theme="primary" variant="appear" action={searchArticle}>
            Search article
          </OakButton>
          <OakButton theme="primary" variant="appear" action={browseArticle}>
            Browse by category
          </OakButton>
          <OakButton theme="primary" variant="appear" action={viewByTags}>
            View by tags
          </OakButton>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default ArticleHome;
