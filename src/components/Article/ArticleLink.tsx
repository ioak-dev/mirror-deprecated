import React, { useEffect } from 'react';
import format from 'date-fns/format';
import './style.scss';
import { Article } from '../../types/graphql';
import { formatDateText } from '../Lib/DateUtils';

interface Props {
  article: Article;
  history: any;
  asset: string;
}

const ArticleLink = (props: Props) => {
  const viewArticle = () => {
    props.history.push(`/${props.asset}/article/view?id=${props.article.id}`);
  };

  return (
    <div className="article-link">
      <div className="article-title typography-7">
        <div className="link hyperlink-drama" onClick={viewArticle}>
          {props.article?.title}
        </div>
      </div>
      <div className="article-meta">
        {props.article?.createdAt && (
          <div className="article-date">
            Published on {formatDateText(props.article?.createdAt)}
          </div>
        )}
        {props.article?.views > 0 && (
          <div className="article-statistic-chip">
            {`${props.article?.views} ${
              props.article?.views === 1 ? 'view' : 'views'
            }`}
          </div>
        )}
        {props.article?.helpful > 0 && (
          <div className="article-statistic-chip helpful">
            {props.article?.helpful}
            <i className="material-icons">thumb_up</i>
          </div>
        )}
        {props.article?.notHelpful > 0 && (
          <div className="article-statistic-chip not-helpful">
            {props.article?.notHelpful}
            <i className="material-icons">thumb_down</i>
          </div>
        )}
      </div>

      <div className="article-description typography-4 three-liner">
        {props.article.description}
      </div>
    </div>
  );
};

export default ArticleLink;
