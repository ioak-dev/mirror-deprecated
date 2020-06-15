import React from 'react';
import './style.scss';

interface Props {
  action: Function;
  label: string;
  icon: string;
}

const LoginMethod = (props: Props) => {
  return (
    <div className="login-method" onClick={() => props.action()}>
      <i className="material-icons">{props.icon}</i>
      <div className="typography-7">{props.label}</div>
    </div>
  );
};

export default LoginMethod;
