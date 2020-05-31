import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import OakButton from '../../../oakui/OakButton';
import CategoryTree from '../../Category/CategoryTree';
import { fetchArticle, deleteArticle } from '../ArticleService';
import OakPrompt from '../../../oakui/OakPrompt';
import { Article } from '../../../types/graphql';

const domain = 'Article';

interface Props {
  id: string;
  history?: any;
  // tenant: any;
  authorization: any;
  location: any;
  article: Article;
  space: string;
}

const ArticleItem = (props: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editArticle = () => {
    props.history.push(`/${props.space}/article/edit?id=${props.id}`);
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  const deleteArticlePrompt = () => {
    setConfirmDelete(true);
  };
  const deleteArticledata = async () => {
    const { outcome } = await deleteArticle(
      props.space,
      props.id,
      props.authorization
    );

    if (outcome) {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="create-article-item">
      <div className="action-header position-right">
        <OakButton
          action={() => {
            editArticle();
          }}
          theme="primary"
          variant="appear"
        >
          <i className="material-icons">double_arrow</i>Edit
        </OakButton>

        {props.history.length > 2 && (
          <>
            <OakButton
              action={() => cancelCreation()}
              theme="default"
              variant="appear"
            >
              <i className="material-icons">close</i>Close
            </OakButton>
          </>
        )}
        <OakButton
          action={() => deleteArticlePrompt()}
          theme="secondary"
          variant="block"
        >
          <i className="material-icons">delete</i>Delete
        </OakButton>
        {confirmDelete}
        <OakPrompt
          action={() => deleteArticledata()}
          visible={confirmDelete}
          toggleVisibility={() => setConfirmDelete(!confirmDelete)}
        />
      </div>
      <CategoryTree id={props.id} pageid="leafNode" />

      <div className="typography-7">{props.article.title}</div>
      <div
        className="typography-4"
        dangerouslySetInnerHTML={{ __html: props.article.description || '' }}
      />
      {/* {props.article.tags && (
        <div className="typography-4">{props.article.tags}</div>
      )} */}
    </div>
  );
};

export default ArticleItem;
