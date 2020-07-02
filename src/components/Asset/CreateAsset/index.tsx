import React from 'react';
import CreateItem from './CreateItem';
import OakPage from '../../../oakui/OakPage';
import OakSection from '../../../oakui/OakSection';

interface Props {
  history: any;
}

const CreateAsset = (props: Props) => {
  return (
    <OakPage>
      <OakSection>
        <CreateItem history={props.history} />
      </OakSection>
    </OakPage>
  );
};

export default CreateAsset;
