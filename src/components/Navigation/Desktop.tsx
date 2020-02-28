import React, { useEffect, useState } from 'react';

import './style.scss';
import mirror_white from '../../images/mirror_white.svg';
import mirror_black from '../../images/mirror_black.svg';
import Links from './Links';
import { Authorization, Profile } from '../Types/GeneralTypes';
// import SearchBar from '../Ux/SearchBar';
import { receiveMessage } from '../../events/MessageService';
import SearchBar from '../../oakui/SearchBar';
import OakButton from '../../oakui/OakButton';

interface Props {    
    sendEvent: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    authorization: Authorization,
    getProfile: Function,
    profile: Profile,
    login: Function,
    transparent: boolean,
    logout: Function,
    toggleSettings: any
}

const Desktop = (props: Props) => {

    const [showSearchBar, setShowSearchBar] = useState(false);
    
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

    const signin = (type) => {
        props.login(type);
    }

    return (
        <div className={(props.transparent ? "navbar desktop transparent" : "navbar desktop")}>
            <div className="left">
                {!props.transparent && props.profile.theme === 'theme_light' && <img className="logo" src={mirror_white} alt="Curate logo" />}
                {(props.transparent || props.profile.theme === 'theme_dark') && <img className="logo" src={mirror_white} alt="Curate logo" />}
                <Links authorization={props.authorization} profile={props.profile}/>
                {showSearchBar && <SearchBar alt />}
            </div>
            <div className="right">
                <div className="action">
                    {props.authorization.isAuth && 
                        <OakButton theme="primary" variant="animate out" invert small action={props.logout()}><i className="material-icons">power_settings_new</i>Logout</OakButton>}
                    {!props.authorization.isAuth && 
                        <OakButton theme="primary" variant="animate in" invert align="left" small action={() => signin('signin')}><i className="material-icons">person</i>Login</OakButton>}
                    {!props.authorization.isAuth && 
                        <OakButton theme="primary" variant="animate in" invert align="right" small action={() => signin('signup')}><i className="material-icons">person_add</i>Signup</OakButton>}
                </div>
            </div>
        </div>
    );
}

export default Desktop;
