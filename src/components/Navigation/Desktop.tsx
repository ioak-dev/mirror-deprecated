import React, { Component } from 'react';

import './style.scss';
import mirror_white from '../../images/mirror_white.svg';
import mirror_black from '../../images/mirror_black.svg';
import Links from './Links';
import { Authorization, Profile } from '../Types/GeneralTypes';
// import SearchBar from '../Ux/SearchBar';
import { receiveMessage, sendMessage } from '../../events/MessageService';
import SearchBar from '../Ux/SearchBar';

interface Props {    
    sendEvent: Function,
    getAuth: Function,
    addAuth: Function,
    removeAuth: Function,
    authorization: Authorization
    getProfile: Function,
    profile: Profile,
    login: Function,
    transparent: boolean,
    logout: Function,
    toggleSettings: any,
    handleSearchTextChange: Function
}

interface State {
    showSettings: boolean,
    showSearchBar: boolean
}

class Desktop extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.props.getProfile();
        this.state = {
            showSearchBar: false,
            showSettings: false
        }
    }

    componentDidMount() {
        receiveMessage().subscribe(message => {
            if (message.name === 'show-navbar-element') {
                this.setState({
                    showSearchBar: message.signal
                })
            }
        });
    }

    signin = (type) => {
        this.props.login(type);
    }

    render() {
        return (
            <div className={(this.props.transparent ? "navbar desktop transparent" : "navbar desktop")}>
                <div className="left">
                    {!this.props.transparent && this.props.profile.theme === 'theme_light' && <img className="logo" src={mirror_white} alt="Curate logo" />}
                    {(this.props.transparent || this.props.profile.theme === 'theme_dark') && <img className="logo" src={mirror_white} alt="Curate logo" />}
                    <Links authorization={this.props.authorization} profile={this.props.profile}/>
                    {this.state.showSearchBar && <SearchBar value={this.props.profile.searchText} handleChange={this.props.handleSearchTextChange} />}
                </div>
                <div className="right">
                    <div className="action">
                        {/* <button className="default disabled small" onClick={this.props.toggleSettings}><i className="material-icons">palette</i>Theme</button> */}
                        {this.props.authorization.isAuth && 
                            <button className="primary animate in alt right small" onClick={this.props.toggleSettings}><i className="material-icons">brush</i>Action 1</button>}
                        {this.props.authorization.isAuth && 
                            <button className="primary animate out alt right small" onClick={this.props.logout()}><i className="material-icons">power_settings_new</i>Logout</button>}
                        {!this.props.authorization.isAuth && 
                            <button className="default animate in right small" onClick={() => this.signin('signin')}><i className="material-icons">person</i>Login</button>}
                        {!this.props.authorization.isAuth && 
                            <button className="default animate in right small" onClick={() => this.signin('signup')}><i className="material-icons">person_add</i>Signup</button>}
                    </div>
                </div>
            </div>
        );
    }
}

export default Desktop;