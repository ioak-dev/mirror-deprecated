import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';
import OakSpinner from '../../../oakui/OakSpinner';
import { MY_POSTS } from '../../Types/PostSchema';
import OakHeading from '../../../oakui/OakHeading';
import OakViewer from '../../../oakui/OakViewer';

const MyPosts = () => {
  const { loading, error, data } = useQuery(MY_POSTS, {
    variables: { pageSize: 10, pageNo: 0 },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <OakPage>
      <OakSection>
        <OakHeading title="My posts" />
        {loading && <OakSpinner />}
        {!loading && !error && (
          <>
            {data.myPosts.results.map(item => (
              <>
                <OakHeading title={item.title || ''} linkSize="large" />

                <OakViewer>{item.description}</OakViewer>
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
