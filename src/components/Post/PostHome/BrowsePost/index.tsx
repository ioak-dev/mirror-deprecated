import React, { useEffect, useState } from 'react';
import './style.scss';
import PostSection from './PostSection';
import OakHeading from '../../../../oakui/OakHeading';
import OakPage from '../../../../oakui/OakPage';
import OakSection from '../../../../oakui/OakSection';

interface Props {
  setProfile: Function;
  profile: any;
  history: any;
  asset: string;
}

const BrowsePost = (props: Props) => {
  const searchPost = () => {
    props.history.push(`/${props.asset}/post/search`);
  };

  return (
    <OakPage>
      <OakSection>
        <div className="browse-post">
          <OakHeading
            title="Browse posts by timeline"
            links={[{ label: 'Or search instead', action: () => searchPost() }]}
          />
          <div className="typography-4">
            Here you can explore the posts in forum, by publication month of the
            post
          </div>
          <div className="section-close" />
          <PostSection history={props.history} asset={props.asset} />
        </div>
      </OakSection>
    </OakPage>
  );
};

export default BrowsePost;
