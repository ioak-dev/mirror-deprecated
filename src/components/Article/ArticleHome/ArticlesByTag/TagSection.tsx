import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import './style.scss';
import { ARTICLE_TAG_CLOUD } from '../../../Types/ArticleSchema';
import TagLink from './TagLink';

interface Props {
  handleChange: Function;
  history: any;
  asset: string;
}

const TagSection = (props: Props) => {
  const { data } = useQuery(ARTICLE_TAG_CLOUD, {
    fetchPolicy: 'cache-and-network',
  });

  const searchArticle = event => {
    props.history.push(`/${props.asset}/article/search`);
  };

  return (
    <div className="app-content">
      <div className="app-text">
        <div className="page-title">
          Articles by tag
          <div className="page-subtitle">
            <div className="browse-article-subtitle">
              <div className="hyperlink" onClick={searchArticle}>
                Or Search instead
              </div>
            </div>
          </div>
          <div className="page-highlight" />
        </div>
        <div className="tag-section">
          {data?.articleTagCloud?.map(item => (
            <TagLink
              key={item.name}
              tag={item}
              handleClick={() => props.handleChange(item.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagSection;
