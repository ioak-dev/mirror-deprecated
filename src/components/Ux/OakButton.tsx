import React, { Component } from 'react';
import './OakButton.scss';

interface Props {
    icon?: string,
    action?: any,
    variant?: 'block' | 'outline' | 'animate' | 'animate out'
    theme?: 'primary' | 'secondary' | 'default',
    align?: 'left' | 'right' | 'center',
    small?: boolean,
    invert?: boolean
}

interface State {
}

class OakButton extends Component<Props, State> {    

    constructor (props: Props) {
        super(props);
        this.state = {
            menuActive: false
        }
    }

    getStyle = () => {
        let style = this.props.theme ? this.props.theme : "";

        if (this.props.variant === "animate out") {
            style = style + " animate out";
        } else if (this.props.variant === "animate") {
            style = style + " animate in";
        } else if (this.props.variant === "block") {
            style = style + " noborder animate none";
        } else if (this.props.variant === "outline") {
            style = style + " animate none";
        }

        if (!this.props.children) {
            style = style + " icon";
        }

        style = style + (this.props.invert ? " alt": "");

        style = style + (this.props.small ? " small" : "");

        style = style + (this.props.align ? " align-" + this.props.align : "");

        return style;
    }

    render() {
        return (
            <button className={"oak-button " + this.getStyle()} onClick={this.props.action}>
                {this.props.icon && <i className="material-icons">{this.props.icon}</i>}
                {this.props.children && this.props.children}
            </button>
        )
    }
}

export default OakButton;