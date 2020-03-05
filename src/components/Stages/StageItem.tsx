import React from 'react';
import './style.scss';

interface Props {
  editStage: Function;
  confirmDeleteStage: Function;
  stage: any;
  id: string;
  index: number;
}

const StageItem = (props: Props) => {
  return (
    <div className="stage-record">
      <div className="item-container">
        <div className="item-actions">
          <div className="item-edit">
            <i
              onClick={() => props.editStage(props.stage)}
              className="material-icons"
            >
              edit
            </i>
          </div>
          <div className="item-delete">
            <i
              onClick={() => props.confirmDeleteStage(props.stage._id)}
              className="material-icons"
            >
              delete
            </i>
          </div>
        </div>
        <div className="item-content">
          <div className="title typography-6">Stage {props.index + 1} : </div>
          <div className="title typography-4">{props.stage.name}</div>
        </div>
      </div>
    </div>
  );
};

export default StageItem;
