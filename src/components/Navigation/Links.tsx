import React, { Component } from 'react';

import './style.scss';
import { NavLink } from 'react-router-dom';
import { Authorization, Profile } from '../Types/GeneralTypes';

interface Props {
    authorization: Authorization,
    profile: Profile
}

interface State {
    menu: boolean
}

class Links extends Component<Props, State> {
    toggleMenu = () => {
        this.setState({
            menu: !this.state.menu
        })
    }

    render() {
        return (
            <div className="links">
                {this.props.authorization.isAuth &&
                    <>
                    <NavLink to={"/" + this.props.profile.tenant + "/home"} className="navitem" activeClassName="active">Home</NavLink>
                    <NavLink to={"/" + this.props.profile.tenant + "/article"} className="navitem" activeClassName="active">Articles</NavLink>
                    <NavLink to={"/" + this.props.profile.tenant + "/request"} className="navitem" activeClassName="active">Requests</NavLink>
                    <NavLink to={"/" + this.props.profile.tenant + "/useradministration"} className="navitem" activeClassName="active">Manage User</NavLink>
                    <NavLink to={"/" + this.props.profile.tenant + "/settings"} className="navitem" activeClassName="active">Settings</NavLink>
                    </>
                }
            </div>
        );
    }
}

export default Links;