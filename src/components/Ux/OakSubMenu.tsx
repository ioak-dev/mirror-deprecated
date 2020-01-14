import React, { Component } from 'react';
import './OakSubMenu.scss';

interface Props {
    data: any,
    variant?: string
}

interface State {
    menuActive: boolean
}

class OakSubMenu extends Component<Props, State> {    

    constructor (props: Props) {
        super(props);
        this.state = {
            menuActive: false
        }
    }

    toggleMenu = () => {
        this.setState({
            menuActive: !this.state.menuActive
        })        
    }

    render() {
        return (
            <div className={this.props.variant ? "oak-sub-menu " + this.props.variant : "oak-sub-menu"}>
                {/* <div className="label" onClick={this.toggleMenu}>Label <i className="material-icons">keyboard_arrow_down</i></div> */}
                <button className={this.props.variant ? "noborder icon animate none " + this.props.variant : "noborder icon animate none"} onClick={this.toggleMenu}><i className="material-icons">open_in_new</i></button>
                <div className={this.state.menuActive ? "content active" : "content"}>
                    {this.props.data.map(element =>
                        <div className="menuitem">{element}</div>
                    )}
                </div>
            </div>
        )
    }
}

export default OakSubMenu;