import React, { useState, useEffect } from 'react';
import './styles/oak-heading.scss';

interface Props {
  link: {
    label: string;
    icon?: string;
    action: any;
  };
}

const OakHeadingLink = (props: Props) => {
  return (
    <div
      className="oak-heading-link typography-4"
      onClick={() => props.link.action()}
    >
      <i className="material-icons typography-6">{props.link.icon}</i>
      <div className="heading-link-label">{props.link.label}</div>
    </div>
  );
};

export default OakHeadingLink;
