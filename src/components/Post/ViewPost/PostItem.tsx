import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import OakPrompt from '../../../oakui/OakPrompt';
import { Post } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';
import TagContainer from './TagContainer';
import { DELETE_POST } from '../../Types/PostSchema';
import CommentHome from '../../Comment';

interface Props {
  id: string;
  history: any;
  post: Post;
  asset: string;
}

const PostItem = (props: Props) => {
  const [deletePost] = useMutation(DELETE_POST, {
    variables: { id: props.post.id },
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const editPost = () => {
    props.history.push(`/${props.asset}/post/edit?id=${props.id}`);
  };

  const goBack = () => {
    props.history.goBack();
  };

  const searchPost = () => {
    props.history.push(`/${props.asset}/post/search`);
  };

  const deletePostPrompt = () => {
    setConfirmDelete(true);
  };

  const deletePostdata = async () => {
    deletePost().then(() => {
      if (props.history.length > 2) {
        goBack();
      } else {
        searchPost();
      }
    });
  };

  return (
    <>
      <div className="view-post-item">
        <div className="page-title">
          {props.post.title}
          <div className="page-subtitle">
            <div className="post-item-actions typography-5">
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
                <div className="hyperlink" onClick={editPost}>
                  Edit
                </div>
              </div>
              <div className="align-horizontal hyperlink-container">
                <i className="material-icons typography-6">delete_outline</i>
                <div className="hyperlink" onClick={deletePostPrompt}>
                  Delete
                </div>
              </div>
            </div>
          </div>
          <div className="page-highlight" />
        </div>
        <TagContainer
          tags={props.post.tags || []}
          history={props.history}
          asset={props.asset}
        />
        <OakViewer>{props.post.description}</OakViewer>
      </div>
      <OakPrompt
        action={() => deletePostdata()}
        visible={confirmDelete}
        toggleVisibility={() => setConfirmDelete(!confirmDelete)}
      />
    </>
  );
};

export default PostItem;
