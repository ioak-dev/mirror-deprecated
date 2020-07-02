import React from 'react';
import './style.scss';
import OakButton from '../../../oakui/OakButton';
import OakHeading from '../../../oakui/OakHeading';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  setProfile: Function;
  profile: any;
  match: any;
  location: any;
  history: any;
  asset: string;
}

const PostHome = (props: Props) => {
  const browsePost = event => {
    props.history.push(`/${props.asset}/post/browse`);
  };

  const searchPost = event => {
    props.history.push(`/${props.asset}/post/search`);
  };

  const viewByTags = event => {
    props.history.push(`/${props.asset}/post/tag`);
  };

  const createPost = event => {
    props.history.push(`/${props.asset}/post/create`);
  };

  return (
    <OakPage>
      <OakSection>
        <OakHeading
          title="Customer support forum"
          subtitle="Connecting seekers, contributors and customer support"
        />
        <div className="typography-4 space-bottom-4">
          <ol>
            <div className="typography-6">
              Report a problem and wait for a solution
            </div>
            <li>Post your problem</li>
            <li>A customer support should respond to you with a solution</li>
            <li>
              A community member like you would provide a solution, if they know
              the answer
            </li>
            <li>
              Either case, you should receive an email notification once someone
              responds to your post
            </li>
          </ol>
          <ol>
            <div className="typography-6 space-top-2">
              Search for already answered posts or similar posts
            </div>
            <li>Search posts that are similar to your problem</li>
            <li>
              Find an instant answer based on the already answered problem
            </li>
          </ol>
        </div>
        <div className="action-header">
          <OakButton theme="primary" variant="appear" action={searchPost}>
            Search forum
          </OakButton>
          <OakButton theme="primary" variant="appear" action={browsePost}>
            Browse by timeline
          </OakButton>
          <OakButton theme="primary" variant="appear" action={viewByTags}>
            View by tags
          </OakButton>
        </div>
        <div className="space-top-2 space-bottom-2 action-header">or</div>
        <div className="action-header">
          <OakButton theme="secondary" variant="drama" action={createPost}>
            Post your problem
          </OakButton>
        </div>
      </OakSection>
    </OakPage>
  );
};

export default PostHome;
