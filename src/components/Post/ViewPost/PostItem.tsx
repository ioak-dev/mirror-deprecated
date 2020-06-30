import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import OakPrompt from '../../../oakui/OakPrompt';
import { Post } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';
import TagContainer from './TagContainer';
import { DELETE_POST } from '../../Types/PostSchema';
import OakHeading from '../../../oakui/OakHeading';

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

  const getHeadingLinks = () => {
    const links: any[] = [];
    if (props.history.length > 2) {
      links.push({
        label: 'Go back',
        icon: 'reply',
        action: () => goBack(),
      });
    }
    links.push({ label: 'Edit', icon: 'edit', action: () => editPost() });
    links.push({
      label: 'Delete',
      icon: 'delete_outline',
      action: () => deletePostPrompt(),
    });
    return links;
  };

  return (
    <>
      <div className="view-post-item">
        <OakHeading
          title={props.post.title || ''}
          links={getHeadingLinks()}
          linkSize="large"
        />
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
