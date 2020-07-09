import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import OakPrompt from '../../../oakui/OakPrompt';
import { Post } from '../../../types/graphql';
import OakViewer from '../../../oakui/OakViewer';
import TagContainer from '../ViewPost/TagContainer';
import { DELETE_POST } from '../../Types/PostSchema';
import OakHeading from '../../../oakui/OakHeading';

interface Props {
  id: string;
  history: any;
  post: Post;
  asset: string;
}

const MyPostsItem = (props: Props) => {
  return (
    <>
      <div>
        <OakViewer>{props.post.description}</OakViewer>
      </div>
    </>
  );
};

export default MyPostsItem;
