import React from 'react';
import './style.scss';

interface Props {
  editArticle: Function;
  confirmDeleteFaq: Function;
  article: any;
  id: string;
}

const ArticleItem = (props: Props) => {
  return (
    <div className="article-record">
      <div className="item-container">
        <div className="item-actions">
          <div className="item-edit">
            <i
              onClick={() => props.editArticle(props.article)}
              className="material-icons"
            >
              edit
            </i>
          </div>
          <div className="item-delete">
            <i
              onClick={() => props.confirmDeleteFaq(props.article._id)}
              className="material-icons"
            >
              delete
            </i>
          </div>
        </div>
        <div className="item-content">
          <div className="title typography-4">{props.article.question}</div>
          <div className="typography-6">{props.article.answer}</div>
        </div>
      </div>
    </div>
  );
};

export default ArticleItem;
