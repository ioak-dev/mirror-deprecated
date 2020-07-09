import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakSpinner from '../../../oakui/OakSpinner';
import { MY_POSTS } from '../../Types/PostSchema';
import StatusView from '../ViewPost/StatusView';
import FollowerView from '../ViewPost/FollowerView';
import OakHeading from '../../../oakui/OakHeading';
import FeedbackView from '../ViewPost/FeedbackView';
import MyPostsItem from './MyPostsItem';
import TagContainer from '../ViewPost/TagContainer';

interface Props {
  location: any;
  history: any;
  asset: string;
}

const queryString = require('query-string');

const MyPosts = (props: Props) => {
  const { loading, error, data } = useQuery(MY_POSTS, {
    variables: { pageSize: 10, pageNo: 0 },
    fetchPolicy: 'cache-and-network',
  });
  const goBack = () => {
    props.history.goBack();
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
    return links;
  };

  return (
    <OakPage>
      <OakSection>
        {loading && <OakSpinner />}
        {!loading && !error && (
          <>
            {data.myPosts.results.map(item => (
              <>
                <OakHeading title={item.title || ''} linkSize="large" />

                <MyPostsItem
                  history={props.history}
                  id={item.id}
                  asset={props.asset}
                  post={item}
                />
              </>
            ))}
          </>
        )}
        {error && <div className="typography-6">Post does not exist</div>}
      </OakSection>
    </OakPage>
  );
};
export default MyPosts;
