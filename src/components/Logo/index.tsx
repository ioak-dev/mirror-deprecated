import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import './style.scss';
import mirrorWhite from '../../images/mirror_white.svg';

const Logo = () => {
  const authorization = useSelector(state => state.authorization);

  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

  return (
    <div className="logo">
      <img className="logo--image" src={mirrorWhite} alt="Oneauth logo" />
    </div>
  );
};

export default Logo;
