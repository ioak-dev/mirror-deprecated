import React from 'react';
import CreateItem from './CreateItem';

interface Props {
  history: any;
}

const CreateAsset = (props: Props) => {
  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <CreateItem history={props.history} />
        </div>
      </div>
    </div>
  );
};

export default CreateAsset;
