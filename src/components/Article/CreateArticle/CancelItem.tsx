import React from 'react';
import OakButton from '../../../oakui/OakButton';

interface Props {
  history: any;
}
const CancelItem = (props: Props) => {
  const cancelCreation = () => {
    props.history.goBack();
  };

  return (
    <OakButton
      action={() => cancelCreation()}
      theme="primary"
      variant="disappear"
      align="right"
    >
      <i className="material-icons secondary">double_arrow</i>Cancel
    </OakButton>
  );
};

export default CancelItem;
