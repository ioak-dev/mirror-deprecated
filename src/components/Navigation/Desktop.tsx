import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './style.scss';
import mirrorWhite from '../../images/mirror_white.svg';
import mirrorBlack from '../../images/mirror_black.svg';
import Links from './Links';
import { Authorization, Profile } from '../Types/GeneralTypes';
// import SearchBar from '../Ux/SearchBar';
import { receiveMessage } from '../../events/MessageService';
import SearchBar from '../../oakui/SearchBar';
import OakButton from '../../oakui/OakButton';

interface Props {
  sendEvent: Function;
  getAuth: Function;
  addAuth: Function;
  removeAuth: Function;
  getProfile: Function;
  toggleDarkMode: Function;
  profile: Profile;
  space: string;
  login: Function;
  transparent: boolean;
  logout: Function;
  toggleSettings: any;
}

const Desktop = (props: Props) => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const authorization = useSelector(state => state.authorization);

  useEffect(() => {
    props.getProfile();
  }, []);

  useEffect(() => {
    receiveMessage().subscribe(message => {
      if (message.name === 'show-navbar-element') {
        setShowSearchBar(message.signal);
      }
    });
  }, []);

  const signin = type => {
    props.login(type);
  };

  return (
    <div
      className={
        props.transparent ? 'navbar desktop transparent' : 'navbar desktop'
      }
    >
      <div className="left">
        {!props.transparent && props.profile.theme === 'theme_light' && (
          <img className="logo" src={mirrorBlack} alt="Mirror logo" />
        )}
        {(props.transparent || props.profile.theme === 'theme_dark') && (
          <img className="logo" src={mirrorWhite} alt="Mirror logo" />
        )}
        <Links authorization={authorization} space={props.space} />
        {showSearchBar && <SearchBar alt />}
      </div>
      <div className="right">
        <div className="dark-mode">
          <i className="material-icons" onClick={() => props.toggleDarkMode()}>
            brightness_6
          </i>
        </div>
        <div className="action">
          {authorization.isAuth && (
            <OakButton
              theme="primary"
              variant="disappear"
              small
              action={props.logout}
            >
              <i className="material-icons">power_settings_new</i>Logout
            </OakButton>
          )}
          {!authorization.isAuth && (
            <OakButton
              theme="primary"
              variant="appear"
              align="left"
              small
              action={() => signin('signin')}
            >
              <i className="material-icons">person</i>Login
            </OakButton>
          )}
          {!authorization.isAuth && (
            <OakButton
              theme="primary"
              variant="appear"
              align="right"
              small
              action={() => signin('signup')}
            >
              <i className="material-icons">person_add</i>Signup
            </OakButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Desktop;
