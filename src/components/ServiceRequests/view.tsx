import React, { Component } from 'react'
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../Ux/OakDialog';
import OakText from '../Ux/OakText';
import OakButton from '../Ux/OakButton';
import OakSelect from '../Ux/OakSelect';
import { httpGet } from '../Lib/RestTemplate';
import { constants } from '../Constants';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    request: any,
    stages: any,
    saveRequest: Function,
    addLog: Function,
    user: any
}

interface State {
    request: any,
    isDialogOpen: boolean,
    nextStage?: string,
    previousStage?: any,
    logs: any
    log: any,
    newLog: any,
    editDialogLabel: string
}

export default class ServiceRequestView extends Component<Props, State> {
    constructor(props){
        super(props);
        this.state = {
            isDialogOpen: false,
            request: {
                title: '',
                description: '',
                priority: ''
            },
            logs: [],
            log: '',
            newLog: false,
            editDialogLabel: 'Add Comments'
        }
    }

    componentDidMount(){
        this.props.setProfile({
          ...this.props.profile,
          tenant: this.props.match.params.tenant
        })

        this.setState({
            newLog:false
        })
        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.request && this.state.request !== nextProps.request) {
            this.setState({
                request: nextProps.request,
                isDialogOpen: true
            })
        }

        if (nextProps.request) {
            this.initializeLogs(nextProps);
        }

        if (nextProps.request || nextProps.stages) {
            if (this.props.user && this.props.user.roles && this.props.stages.some(r=> this.props.user.roles.indexOf(r.name) >= 0)) {
                this.findNextStage(nextProps);
            }
        }
    }

    findNextStage = (props) => {console.log('next stage');
        if (props.request && props.request.stage && props.stages && props.stages.length > 0) {
            let index = props.stages.findIndex(x => x.name === props.request.stage);
            if (props.stages.length > index + 1) {
                this.setState({
                    nextStage: props.stages[index + 1].name
                });
            } else {
                this.setState({
                    nextStage: ''
                });
            }
        }
    }

    initializeLogs = (props) => {
        if (props.request&& props.request._id){
            httpGet(constants.API_URL_SR + '/' + 
            this.props.match.params.tenant + '/log' + '/' + props.request._id,
            {
                headers:{Authorization: this.props.authorization.token}
            })
            .then((response) => {
                this.setState({
                    logs: response.data.data
            })
        })
        .catch((error) => {
            if (error.response.status === 401) {
                this.props.logout(null, 'failure', 'Session expired. Login again');
            }
        })
        }
    }

    clearRequest = () => {
        this.setState({
            request: {
                title: '',
                description: '',
            },
            log: ''
        })
    }


    toggleDialog = () => {
        if (this.state.isDialogOpen) {
            this.clearRequest();
        }
        this.setState({
            isDialogOpen: !this.state.isDialogOpen,
            newLog: false,
            editDialogLabel: 'Add Comments'
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

    addLog = () => {
        this.props.addLog({
            id: this.state.request._id,
            comments: this.state.log
        })
        
        this.toggleDialog()
        
    }

    handleLog = (e) => {
        this.setState({
            newLog: !this.state.newLog
        })
        
    }
    
    editRequest = () =>{
        const that = this
        this.props.saveRequest({
            id : this.state.request._id,
            title: this.state.request.title,
            description: this.state.request.description,
            priority: this.state.request.priority,
            assignedTo: this.props.match.params.tenant
        }, true )
        
        this.toggleDialog()
        
    }

    nextStage = (stage) => {
        let index = this.props.stages.findIndex(x => x.name === stage);
        if(this.props.stages.length > index){
            this.props.saveRequest({
                id : this.state.request._id,
                title: this.state.request.title,
                description: this.state.request.description,
                priority: this.state.request.priority,
                updateTime: new Date().toLocaleString(),
                comment: this.state.request.comment,
                stage:stage,
                previousStage: this.props.stages[index - 1].name,
                assignedTo: this.props.match.params.tenant
            }, true )
        }
        
       this.toggleDialog()
    }
    
    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]:[event.target.value]
        })
    }
   
    render() {
        const newLogSection = <>
        {!this.state.newLog && 
            <>
                <OakButton theme="secondary" variant="animate none" align="right" icon="forum" small action={this.handleLog}>Add Comment</OakButton>
            </>
        }
        {this.state.newLog && 
            <>
                <OakText label="Comments" multiline data={this.state} id="log" handleChange={e => this.handleChange(e)} />
                <OakButton theme="secondary" variant="animate out" small align="right" icon="done" action={this.addLog}>Save Comment</OakButton>
                <OakButton theme="default" variant="animate in" small align="right" icon="close" action={this.handleLog}>Cancel</OakButton>
            </>
        }
        <div className="space-bottom-3" /></>
        return (
            <div className="view-request">
                <OakDialog fullscreen visible={this.state.isDialogOpen} toggleVisibility={this.toggleDialog} >
                    <div className="dialog-body">
                        <div className="typography-3 space-bottom-3">Request Details</div>
                        <div>
                            <OakText label="Request Id" data={this.state.request} disabled id="_id" handleChange={e => this.handleRequestChange(e)} />
                            <OakText label="Title" data={this.state.request} id="title" handleChange={e => this.handleRequestChange(e)} />
                            <OakText label="Description" data={this.state.request} id="description" handleChange={e => this.handleRequestChange(e)} />
                            <OakSelect label="Priority" data={this.state.request} id="priority" handleChange={e => this.handleRequestChange(e)} elements={["Low", "Medium","High"]} />
                        </div>
                        
                        <div className="typography-3 space-bottom-3 space-top-5">Comments and work log</div>
                        {newLogSection}
                        {this.state.logs && this.state.logs.length > 0 && this.state.logs.map((item)=>(
                            <div className="comment space-bottom-2">
                                <div className="comment-author typography-4 space-bottom-1">
                                    {/* <i className="material-icons">person</i> */}
                                    {item.lastModifiedByEmail}
                                    </div>
                                <div className="comment-text space-bottom-1">{item.comments}</div>
                                <div className="comment-date typography-6">
                                    {/* <i className="material-icons">access_time</i> */}
                                    {item.lastModifiedAt}
                                </div>
                            </div>
                        ))}
                        {this.state.logs.length > 10 && newLogSection}
                        
                    </div>
                    <div className="dialog-footer">
                        {this.state.nextStage && <OakButton theme="primary" variant="outline" align="left" icon="person_add" action={() => this.nextStage(this.state.nextStage)}>Assign to {this.state.nextStage}</OakButton>}
                        <OakButton theme="primary" variant="outline" align="right" icon="save" action={this.editRequest}>Save Changes</OakButton>
                    </div>
                </OakDialog>
            </div>
        )
    }
}
