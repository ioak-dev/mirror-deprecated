import React, { Component } from 'react';
import './ArcDialog.scss';
import { sendMessage } from '../../events/MessageService';

interface Props {
    visible: boolean,
    title: string,
    toggleVisibility: any
}

interface State {
}

class ArcDialog extends Component<Props, State> {
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

    render() {
        return (
            <div className="arc-dialog">
                <div className={(this.props.visible ? "dialog show" : "dialog hide")}>
                    <div className={(this.props.visible ? "container": "container hidetext")}>
                        <div className="dialog-header" onClick={this.props.toggleVisibility}><i className="material-icons">close</i><div className="text-esc">esc</div></div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default ArcDialog;