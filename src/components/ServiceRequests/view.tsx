import React, { Component } from 'react'
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../Ux/OakDialog';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    request: any,
    stages: any
}

interface State {
    request: any,
    isDialogOpen: boolean,
    nextStage?: string
}

export default class ServiceRequestView extends Component<Props, State> {
    constructor(props){
        super(props);
        this.state = {
            isDialogOpen: false,
            request: {
                title: '',
                description: ''
            }
        }
    }

    componentDidMount(){
        this.props.setProfile({
          ...this.props.profile,
          tenant: this.props.match.params.tenant
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.request && this.state.request !== nextProps.request) {
            this.setState({
                request: nextProps.request,
                isDialogOpen: true
            })
        }
        if (nextProps.request || nextProps.stages) {
            this.findNextStage(nextProps);
        }
    }

    findNextStage = (props) => {
        if (props.request && props.request.stage && props.stages && props.stages.length > 0) {
            let index = props.stages.findIndex(x => x.name === props.request.stage);
            if (props.stages.length > index + 1) {
                this.setState({
                    nextStage: props.stages[index + 1].name
                });
            }
        }
    }

    clearRequest = () => {
        this.setState({
            request: {
                title: '',
                description: ''
            }
        })
    }


    toggleDialog = () => {
        if (this.state.isDialogOpen) {
            this.clearRequest();
        }
        this.setState({
            isDialogOpen: !this.state.isDialogOpen,
            // editDialogLabel: 'Add'
        })
    }

    handleRequestChange = (event) => {
        this.setState(
            {
                request: {
                    ...this.state.request,
                    [event.target.name]: event.target.value
                }
            }
        )
    }

    nextStage = (stage) => {
        console.log(stage);
    }

    render() {
        return (
            <div className="view-request">
                <OakDialog visible={this.state.isDialogOpen} toggleVisibility={this.toggleDialog} fullscreen>
                    <div className="dialog-body">
                        <OakText label="Title" data={this.state.request} id="title" handleChange={e => this.handleRequestChange(e)} />
                        <OakText label="Description" data={this.state.request} id="description" handleChange={e => this.handleRequestChange(e)} />
                    </div>
                    <div className="dialog-footer">
                        {this.state.nextStage && <OakButton theme="primary" variant="outline" align="left" icon="person_add" action={() => this.nextStage(this.state.nextStage)}>Assign to {this.state.nextStage}</OakButton>}
                        <OakButton theme="primary" variant="outline" align="right" icon="save">Save Changes</OakButton>
                    </div>
                </OakDialog>
            </div>
        )
    }
}
