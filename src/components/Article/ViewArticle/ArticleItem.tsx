import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/OakButton';
import CategoryTree from '../../Category/CategoryTree';
import { fetchArticle, deleteArticle } from '../ArticleService';
import OakPrompt from '../../../oakui/OakPrompt';
import { receiveMessage, sendMessage } from '../../../events/MessageService';

const domain = 'Article';

interface Props {
  id: string;
  history?: any;
  // tenant: any;
  authorization: any;
  location: any;
  space: string;
}

const ArticleItem = (props: Props) => {
  const [data, setData] = useState({
    title: '',
    description: '',
    tags: '',
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    (async function anonymous() {
      if (props.authorization.token && props.id) {
        const { outcome, response } = await fetchArticle(
          props.space,
          props.id,
          props.authorization
        );

        if (outcome) {
          setData(response.data.data);
        } else {
          sendMessage('notification', true, {
            type: 'failure',
            message:
              response?.response?.status === 404
                ? 'Article does not exist. You will be redirected to articles page'
                : response?.response?.status,
          });
          setTimeout(() => {
            if (props.history.length > 2) {
              props.history.goBack();
            } else {
              props.history.push(`/${props.space}/article`);
            }
          }, 1000);
        }
      }
    })();
  }, [props.id, props.authorization]);

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

      <div
        className="typography-7"
        dangerouslySetInnerHTML={{ __html: data.title }}
      />
      <div
        className="typography-4"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />

      {data.tags && (
        <div
          className="typography-4"
          dangerouslySetInnerHTML={{ __html: data.tags }}
        />
      )}
    </div>
  );
};

export default ArticleItem;
