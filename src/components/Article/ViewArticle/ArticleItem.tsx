import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import OakPrompt from '../../../oakui/OakPrompt';
import { Article } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';
import TagContainer from './TagContainer';
import { DELETE_ARTICLE } from '../../Types/ArticleSchema';
import OakHeading from '../../../oakui/OakHeading';

interface Props {
  id: string;
  history: any;
  article: Article;
  asset: string;
}

const ArticleItem = (props: Props) => {
  const [deleteArticle] = useMutation(DELETE_ARTICLE, {
    variables: { id: props.article.id },
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editArticle = () => {
    props.history.push(`/${props.asset}/article/edit?id=${props.id}`);
  };

  const goBack = () => {
    props.history.goBack();
  };

  const searchArticle = () => {
    props.history.push(`/${props.asset}/article/search`);
  };

  const deleteArticlePrompt = () => {
    setConfirmDelete(true);
  };

  const deleteArticledata = async () => {
    deleteArticle().then(() => {
      if (props.history.length > 2) {
        goBack();
      } else {
        searchArticle();
      }
    });
  };

  const getHeadingLinks = () => {
    const links: any[] = [];
    if (props.history.length > 2) {
      links.push({
        label: 'Go back',
        icon: 'reply',
        action: () => goBack(),
      });
    }
    links.push({ label: 'Edit', icon: 'edit', action: () => editArticle() });
    links.push({
      label: 'Delete',
      icon: 'delete_outline',
      action: () => deleteArticlePrompt(),
    });
    return links;
  };

  return (
    <>
      <div className="view-article-item">
        <OakHeading
          title={props.article.title || ''}
          links={getHeadingLinks()}
          linkSize="large"
        />
        <TagContainer
          tags={props.article.tags || []}
          history={props.history}
          asset={props.asset}
        />
        <OakViewer>{props.article.description}</OakViewer>
      </div>
      <OakPrompt
        action={() => deleteArticledata()}
        visible={confirmDelete}
        toggleVisibility={() => setConfirmDelete(!confirmDelete)}
      />
    </>
  );
};

export default ArticleItem;
