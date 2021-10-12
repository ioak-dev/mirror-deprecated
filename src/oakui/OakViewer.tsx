import React, { useState } from 'react';
import './OakViewer.scss';

interface Props {
  children: any;
  customStyle?: boolean;
}
const OakViewer = (props: Props) => {
  return (
    <div className={props.customStyle ? '' : 'oak-viewer'}>
      <div dangerouslySetInnerHTML={{ __html: props.children || '' }} />
    </div>
  );
};

export default OakViewer;
