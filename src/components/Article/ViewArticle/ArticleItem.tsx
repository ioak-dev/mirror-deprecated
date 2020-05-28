import React, { useState, useEffect } from 'react';
import OakButton from '../../../oakui/OakButton';
import CategoryTree from '../../Category/CategoryTree';
import { fetchArticle, deleteArticle } from '../ArticleService';
import OakPrompt from '../../../oakui/OakPrompt';
import { receiveMessage, sendMessage } from '../../../events/MessageService';

const domain = 'Article';

interface Props {
  urlParam: any;
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
    const eventBus = receiveMessage().subscribe(message => {
      if (message.name === domain && message.signal) {
        sendMessage('notification', true, {
          type: 'success',
          message: `${domain} ${message.data.action}`,
          duration: 5000,
        });

        setData({
          title: '',
          description: '',
          tags: '',
        });
      }
    });
    return () => eventBus.unsubscribe();
  });

  useEffect(() => {
    if (props.authorization.token && props.urlParam.articleid) {
      fetchArticle(props.space, props.urlParam.articleid, {
        headers: {
          Authorization: props.authorization.token,
        },
      }).then(response => {
        if (response.data) {
          response.data.map(item => {
            setData({
              title: item.title,
              description: item.description,
              tags: item.tags,
            });
          });
        }
      });
    }
  }, [props.urlParam, props.authorization]);

  const Editing = () => {
    console.log(props.history);
    // props.history.push(`/${props.space}/article/edit?id=articleid`);
  };

  const cancelCreation = () => {
    props.history.goBack();
  };

  const deleteArticlePrompt = () => {
    setConfirmDelete(true);
  };
  const deleteArticledata = () => {
    deleteArticle(props.space, props.urlParam.articleid, {
      headers: {
        Authorization: props.authorization.token,
      },
    }).then(response => {
      setConfirmDelete(false);
    });
  };

  return (
    <div className="create-article-item">
      <div className="action-header position-right">
        <OakButton
          action={() => {
            Editing();
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
      <CategoryTree id={props.urlParam.articleid} pageid="leafNode" />

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
