import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../../oakui/OakDialog';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import OakSelect from '../../oakui/OakSelect';
import { fetchRequestLog, saveRequestLog } from '../../actions/RequestActions';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import { isEmptyOrSpaces } from '../Utils';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    request: any,
    stages: any,
    saveRequest: Function,
    user: any,
    toggleEditDialog: Function,
    editDialogOpen: boolean,
    requestLog: any,
    fetchRequestLog: Function,
    saveRequestLog: Function
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

const domainLog = 'servicerequests log';

const emptyRequest = {
    _id: '',
    title: '',
    description: '',
    priority: ''
}

const ServiceRequestView = (props: Props) => {

    const [data, setData] = useState({request: emptyRequest, log: '', nextStage: ''});
    const [newLog, setNewLog] = useState(false);

    useEffect(() => {
        const eventBus = receiveMessage().subscribe(message => {
          if (message.name === domainLog && message.signal) {
            sendMessage('notification', true, {
              type: 'success',
              message: `${domainLog} ${message.data.action}`,
              duration: 5000,
            });
            if (message.data.action !== 'deleted') {
              setNewLog(false);
              setData({...data, log: ''});
            }
          }
        });
        return () => eventBus.unsubscribe();
      });

    useEffect(() => {
        if (props.request._id){
            props.fetchRequestLog(props.match.params.tenant, props.authorization, props.request._id);
        }
    }, [props.request?._id]);

    useEffect(() => {
        setData({...data, request: props.request});
        if (props.user && props.user.roles && props.stages.some(r=> props.user.roles.indexOf(r.name) >= 0)) {
            findNextStage();
        }
    }, [props.request]);

    const findNextStage = () => {
        if (props.request && props.request.stage && props.stages && props.stages.length > 0) {
            let index = props.stages.findIndex(x => x.name === props.request.stage);
            if (props.stages.length > index + 1) {
                setData({...data, nextStage: props.stages[index + 1].name});
            } else {
                setData({...data, nextStage: ''});
            }
        }
    }

    const addLog = () => {
        const log = {
            requestId: data.request._id,
            comments: data.log
        }
        if (isEmptyOrSpaces(log.comments[0])) {
            sendMessage('notification', true, {type: 'failure', message: 'Nothing to add', duration: 5000});
            return;
        }
        props.saveRequestLog(props.match.params.tenant, props.authorization, log);
    }

    const clearRequest = () => {
        setData({...data, request: emptyRequest, log: ''});
    }

    const handleRequestChange = (event) => {
        setData(
            {
                ...data,
                request: {
                    ...data.request,
                    [event.target.name]: event.target.value
                }
            }
        )
    }

    const handleChange = (event) => {
        setData({...data, [event.target.name]: event.target.value});
    }
    
    const saveRequest = () => {
        props.saveRequest({
            id : data.request._id,
            title: data.request.title,
            description: data.request.description,
            priority: data.request.priority,
            assignedTo: props.match.params.tenant
        }, true );
    }

    const nextStage = (stage) => {
        let index = props.stages.findIndex(x => x.name === stage);
        if(props.stages.length > index){
            props.saveRequest({
                id : data.request._id,
                title: data.request.title,
                description: data.request.description,
                priority: data.request.priority,
                updateTime: new Date().toLocaleString(),
                stage:stage,
                previousStage: props.stages[index - 1].name,
                assignedTo: props.match.params.tenant
            }, true )
        }
    }
   
    const newLogSection = <>
        {!newLog && 
            <>
                <OakButton theme="secondary" variant="animate none" align="right" icon="forum" small action={() => setNewLog(!newLog)}>Add Comment</OakButton>
            </>
        }
        {newLog && 
            <>
                <OakText label="Comments" multiline data={data} id="log" handleChange={e => handleChange(e)} />
                <OakButton theme="secondary" variant="animate out" small align="right" icon="done" action={addLog}>Save Comment</OakButton>
                <OakButton theme="default" variant="animate in" small align="right" icon="close" action={() => setNewLog(!newLog)}>Cancel</OakButton>
            </>
        }
        <div className="space-bottom-3" />
    </>
    return (
        <div className="view-request">
            <OakDialog fullscreen visible={props.editDialogOpen} toggleVisibility={props.toggleEditDialog} >
                <div className="dialog-body">
                    <div className="typography-3 space-bottom-3">Request Details</div>
                    <div>
                        <OakText label="Request Id" data={data.request} disabled id="_id" handleChange={e => handleRequestChange(e)} />
                        <OakText label="Title" data={data.request} id="title" handleChange={e => handleRequestChange(e)} />
                        <OakText label="Description" data={data.request} id="description" handleChange={e => handleRequestChange(e)} />
                        <OakSelect label="Priority" data={data.request} id="priority" handleChange={e => handleRequestChange(e)} elements={["Low", "Medium","High"]} />
                    </div>
                    
                    <div className="typography-3 space-bottom-3 space-top-5">Comments and work log</div>
                    {newLogSection}
                    {props.requestLog.logs && props.requestLog.logs.length > 0 && props.requestLog.logs.map((item)=>(
                        <div className="comment space-bottom-2" key={item._id}>
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
                    {props.requestLog.logs.length > 10 && newLogSection}
                    
                </div>
                <div className="dialog-footer">
                    {data.nextStage && <OakButton theme="primary" variant="outline" align="left" icon="person_add" action={() => nextStage(data.nextStage)}>Assign to {data.nextStage}</OakButton>}
                    <OakButton theme="primary" variant="outline" align="right" icon="save" action={saveRequest}>Save Changes</OakButton>
                </div>
            </OakDialog>
        </div>
    )
}

const mapStateToProps = state => ({
    requestLog: state.request
});
  
export default connect(mapStateToProps, {
    fetchRequestLog,
    saveRequestLog
})(ServiceRequestView);
  