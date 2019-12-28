import React, { Component } from 'react';
import './ArcDialog.scss';
import { sendMessage } from '../../events/MessageService';

interface Props {
    visible: boolean,
    title: string,
    toggleVisibility: any
}

interface State {
    views: any,
    body?: any,
    footer?: any
}

class ArcDialog extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            views: this.props.children
        }
    }

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

    componentWillMount() {
        this.initializeViews();
    }
    
    componentWillUnmount(){
      document.removeEventListener("keydown", this.escFunction, false);
    }

    initializeViews() {
        let body: any[] = [];
        let footer: any;
        React.Children.toArray(this.state.views).forEach((node) => {
            if (node.props.className === 'actions' || node.props.className === 'footer') {
                footer = node;
            } else {
                body.push(node);
            }
        })
        
        this.setState({
            body: body,
            footer: footer
        })

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
            <>
            <div className="arc-dialog">
                <div className={(this.props.visible ? "dialog show" : "dialog hide")}>
                    <div className={(this.props.visible ? "container": "container hidetext")}>
                        <div className="dialog-header" onClick={this.props.toggleVisibility}><i className="material-icons">close</i><div className="text-esc">esc</div></div>
                        {/* <div className="header-space"></div> */}
                        {/* {this.props.title && <div className="header">{this.props.title}<i className="material-icons" onClick={this.props.toggleVisibility}>close</i></div>} */}
                        <div className="dialog-body">
                            {this.state.body}
                        </div>
                        <div className="dialog-footer">
                            {this.state.footer}
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

export default ArcDialog;