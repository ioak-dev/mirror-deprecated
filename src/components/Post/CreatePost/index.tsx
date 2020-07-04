import React from 'react';
import './style.scss';
import CreateItem from './CreateItem';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  history: any;
  asset: string;
}

const CreatePost = (props: Props) => {
  return (
    <OakPage>
      <OakSection>
        <CreateItem history={props.history} asset={props.asset} />
      </OakSection>
    </OakPage>
  );
};

export default CreatePost;
