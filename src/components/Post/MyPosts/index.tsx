import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakSpinner from '../../../oakui/OakSpinner';
import { MY_POSTS } from '../../Types/PostSchema';
import OakHeading from '../../../oakui/OakHeading';
import PostLink from '../PostLink';
import './style.scss';

interface Props {
  history: any;
  asset: string;
}

const MyPosts = (props: Props) => {
  const { loading, error, data } = useQuery(MY_POSTS, {
    variables: { pageSize: 10, pageNo: 0 },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <OakPage>
      <OakSection>
        <OakHeading
          title="My posts"
          subtitle="Posts submitted by me. Posts that I am following"
        />
        {loading && <OakSpinner />}
        {!loading && !error && (
          <div className="my-posts">
            {data.myPosts.results.map(item => (
              <PostLink
                post={item}
                asset={props.asset}
                history={props.history}
                key={item.id}
              />
            ))}
          </div>
        )}
        {error && <div className="typography-6">Post does not exist</div>}
      </OakSection>
    </OakPage>
  );
};
export default MyPosts;
