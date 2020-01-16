import React, { Component } from 'react';
import './OakDialog.scss';
import { sendMessage } from '../../events/MessageService';

interface Props {
    visible: boolean,
    toggleVisibility: any,
    small?: boolean,
    fullscreen?: boolean
}

interface State {
}

class OakDialog extends Component<Props, State> {
    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible) {
            if (nextProps.visible) {
                sendMessage('dialog');
                window.scrollTo(500, 0);
            } else {
                sendMessage('dialog', false);
            }
        }
    }
    
    componentDidMount(){
      document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillUnmount(){
      document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction = (event) => {
        if(event.keyCode === 27) {
          if (this.props.visible) {
            this.props.toggleVisibility();
          }
        }
    }

    getDialogStyle = () => {
        let style = "";
        style = style + (this.props.small ? " small" : "");
        style = style + (this.props.fullscreen ? " fullscreen" : "");
        return style;
    }

    render() {
        return (
            <div className="oak-dialog">
                <div className={(this.props.visible ? "dialog show " + this.getDialogStyle() : "dialog hide " + this.getDialogStyle())}>
                    <div className={(this.props.visible ? "container": "container hidetext")}>
                        <div className="dialog-header">
                            <div className="container" onClick={this.props.toggleVisibility}>
                                <i className="material-icons">close</i><div className="text-esc">esc</div>
                            </div>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default OakDialog;
