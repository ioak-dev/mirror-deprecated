import React, { useState } from 'react';
import OakPrompt from '../../../oakui/OakPrompt';
import { Article } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';
import TagContainer from './TagContainer';

interface Props {
  id: string;
  history: any;
  article: Article;
  space: string;
}

const ArticleItem = (props: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editArticle = () => {
    props.history.push(`/${props.space}/article/edit?id=${props.id}`);
  };

  const goBack = () => {
    props.history.goBack();
  };

  const deleteArticlePrompt = () => {
    setConfirmDelete(true);
  };
  const deleteArticledata = async () => {
    // const { outcome } = await deleteArticle(
    //   props.space,
    //   props.id,
    //   props.authorization
    // );
    // if (outcome) {
    //   setConfirmDelete(false);
    // }
  };

  return (
    <>
      <div className="view-article-item">
        <div className="page-title">
          {props.article.title}
          <div className="page-subtitle">
            <div className="article-item-actions typography-5">
              {props.history.length > 2 && (
                <div
                  className="align-horizontal hyperlink-container"
                  onClick={goBack}
                >
                  <i className="material-icons typography-6">reply</i>
                  <div className="hyperlink">Go back</div>
                </div>
              )}
              <div className="align-horizontal hyperlink-container">
                <i className="material-icons typography-6">edit</i>
                <div className="hyperlink" onClick={editArticle}>
                  Edit
                </div>
              </div>
              <div className="align-horizontal hyperlink-container">
                <i className="material-icons typography-6">delete_outline</i>
                <div className="hyperlink" onClick={deleteArticlePrompt}>
                  Delete
                </div>
              </div>
            </div>
            {/* <CategoryTree
          category={data?.categories?.find(
            (item: Category) => item.id === urlParam.categoryid
          )}
          categories={data?.categories}
          handleChange={handleChange}
        /> */}
          </div>
          <div className="page-highlight" />
        </div>
        <TagContainer tags={props.article.tags || []} />
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
