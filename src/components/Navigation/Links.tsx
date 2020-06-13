import React from 'react';

import './style.scss';
import { NavLink } from 'react-router-dom';
import { Authorization, Profile } from '../Types/GeneralTypes';

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
            to={`/${props.asset}/asset/view`}
            className="navitem"
            activeClassName="active"
          >
            View Asset
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Links;
