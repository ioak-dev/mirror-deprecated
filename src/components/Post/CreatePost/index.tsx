import React from 'react';
import './style.scss';
import CreateItem from './CreateItem';

interface Props {
  history: any;
  asset: string;
}

const CreatePost = (props: Props) => {
  return (
    <div className="app-page">
      <div className="app-content">
        <div className="app-text">
          <CreateItem history={props.history} asset={props.asset} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
