import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import './style.scss';
import PostItem from './PostItem';
import { GET_POST } from '../../Types/PostSchema';
import OakButton from '../../../oakui/OakButton';
import FeedbackView from './FeedbackView';
import OakSpinner from '../../../oakui/OakSpinner';
import CommentSection from './CommentSection';
import StatusChip from '../../Common/StatusChip';
import { days } from '../../Lib/DateUtils';

interface Props {
  location: any;
  history: any;
  asset: string;
}

const queryString = require('query-string');

const ViewPost = (props: Props) => {
  const [urlParam, setUrlParam] = useState({
    id: '',
  });
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: urlParam.id },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setUrlParam(queryString.parse(props.location.search));
  }, [props.location.search]);

  return (
    <>
      <div className="app-page">
        <div className="app-content">
          <div className="app-text">
            {loading && <OakSpinner />}
            {!loading && !error && (
              <>
                <div className="post-status-header">
                  <StatusChip
                    label="Closed"
                    color="success"
                    icon="check_circle"
                  />
                  <div className="typography-4 post-status-label">
                    {`Answered ${Math.round(
                      Math.abs(days(data.post.createdAt))
                    )} days ago`}
                  </div>
                </div>
                <div className="post-status-header space-top-1">
                  <StatusChip label="Open" color="failure" icon="help" />
                  <div className="typography-4 post-status-label">
                    {`Reported ${Math.round(
                      Math.abs(days(data.post.createdAt))
                    )} days ago`}
                  </div>
                </div>
                <PostItem
                  history={props.history}
                  id={urlParam.id}
                  asset={props.asset}
                  post={data.post}
                />
                <FeedbackView post={data.post} />
              </>
            )}
            {error && <div className="typography-6">Post does not exist</div>}
          </div>
        </div>

        <div className="app-content comment-section-wrapper">
          <div className="app-text">
            <CommentSection postId={urlParam.id} />
          </div>
        </div>
      </div>
      {/* <div className="app-page">
      </div> */}
    </>
  );
};

export default ViewPost;
