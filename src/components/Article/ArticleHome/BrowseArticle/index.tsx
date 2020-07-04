import React, { useEffect, useState } from 'react';
import './style.scss';
import OakButton from '../../../../oakui/OakButton';
import ArticleSection from './ArticleSection';
import CategorySection from './CategorySection';
import OakHeading from '../../../../oakui/OakHeading';
import OakPage from '../../../../oakui/OakPage';
import OakSection from '../../../../oakui/OakSection';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  asset: string;
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
      `/${props.asset}/article/create?categoryid=${urlParam.categoryid}`
    );
  };

  const searchArticle = () => {
    props.history.push(`/${props.asset}/article/search`);
  };

  const handleCategoryChange = id => {
    props.history.push({
      pathname: props.location.pathname,
      search: id ? `?categoryid=${id}` : '',
    });
  };

  return (
    <OakPage>
      <OakSection>
        <div className="browse-article">
          <OakHeading
            title="Browse articles by category"
            links={[
              { label: 'Or Search instead', action: () => searchArticle() },
            ]}
          />
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
            asset={props.asset}
          />
          <ArticleSection
            categoryId={urlParam.categoryid}
            history={props.history}
            asset={props.asset}
          />
        </div>
      </OakSection>
    </OakPage>
  );
};

export default BrowseArticle;
