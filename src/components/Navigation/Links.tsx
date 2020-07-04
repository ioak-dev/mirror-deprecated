import React from 'react';

import './style.scss';
import { NavLink } from 'react-router-dom';
import { Authorization } from '../Types/GeneralTypes';

interface Props {
  authorization: Authorization;
  asset: string;
}

const Links = (props: Props) => {
  return (
    <div className="links">
      {props.authorization.isAuth && (
        <>
          <NavLink
            to={`/${props.asset}/home`}
            className="navitem"
            activeClassName="active"
          >
            Home
          </NavLink>
          <NavLink
            to={`/${props.asset}/article`}
            className="navitem"
            activeClassName="active"
          >
            Articles
          </NavLink>
          <NavLink
            to={`/${props.asset}/post`}
            className="navitem"
            activeClassName="active"
          >
            Forum
          </NavLink>

          <NavLink
            to={`/${props.asset}/asset/view`}
            className="navitem"
            activeClassName="active"
          >
            Asset
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Links;
