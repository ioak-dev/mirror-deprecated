import React, { Component } from 'react';
import './OakDialog.scss';
import { sendMessage } from '../../events/MessageService';
import OakDialog from './OakDialog';

interface Props {
    visible: boolean,
    toggleVisibility: any,
    action: any
}

interface State {
}

class OakPrompt extends Component<Props, State> {    
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

    action = () => {
        this.props.action();
        this.props.toggleVisibility();
    }

    render() {
        return (
            <OakDialog small visible={this.props.visible} toggleVisibility={this.props.toggleVisibility}>
                <div className="dialog-body typography-4 space-top-4 space-bottom-4">
                    Are you sure you want to continue?
                </div>
                <div className="dialog-footer">
                    {this.props.children && this.props.children}
                    {!this.props.children && 
                        <>
                            <button onClick={this.props.toggleVisibility} className="default animate in right align-left"><i className="material-icons">close</i>No</button>
                            <button onClick={this.action} className="primary animate out right align-right"><i className="material-icons">double_arrow</i>Yes</button>
                        </>
                    }
                </div>
            </OakDialog>
        )
    }
}

export default OakPrompt;