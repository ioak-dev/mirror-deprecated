import React, { Component, useEffect, useState } from 'react'
import './style.scss';
import OakText from '../../oakui/OakText';
import { Authorization } from '../Types/GeneralTypes';
import { httpGet, httpPost, httpPut } from "../Lib/RestTemplate";
import { constants } from '../Constants';
import { sendMessage } from '../../events/MessageService';
import OakButton from '../../oakui/OakButton';

interface Props {
    match: any,
    authorization: Authorization
}

interface State { 
    stage: any
}
    
const Stages = (props: Props) => {
    const [stage, setStage] = useState([{name: ''}]);

    useEffect(() => {
        if(props.authorization.isAuth){
            initializeStages();
        }
    }, []);

    useEffect(() => {
        if(props.authorization.isAuth){
            initializeStages();
        }
    }, [props.authorization.isAuth]);
    
    const initializeStages = () =>{
        httpGet(constants.API_URL_STAGE + '/' + 
        props.match.params.tenant + '/', 
        {headers: {
            Authorization: props.authorization.token
        }}
        ).then ((response) => {
            setStage(response.data.stage);
        }).catch(() => {})
    }

    const handleAddStage = () => {
        setStage(stage.concat([{name: "" }]));
    }

    const handleChangeStage = (evt, idx) => {
        const localStage = [...stage]
        localStage[idx] = {...localStage[idx], name:evt.target.value}
        setStage(localStage);
    }

    const handleRemoveStage = idx => () => {
        setStage(stage.filter((s,sidx) => idx !== sidx));
    } 

    const saveStages = () => {
        return httpPut(constants.API_URL_STAGE + '/' + props.match.params.tenant + '/', 
        stage ,{
            headers: {
                Authorization: props.authorization.token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    sendMessage('notification', true, {message: 'Stages Updated successfully', type: 'success', duration: 3000});
                } else if (response.status === 500) {
                    sendMessage('notification', true, {message: 'Stages Updation failed', type: 'failure', duration: 3000});
                } else {
                    sendMessage('notification', true, {message: 'Unknown response from server. Please try again or at a later time', type: 'failure', duration: 3000});
                }
        })
    }

    return (
        <div>
            <div className="form">
                <OakButton theme="secondary" variant="animate out" align="left" action={ handleAddStage }><i className="material-icons">label_important</i>New Stage</OakButton>
                <OakButton theme="primary" variant="animate out" align="center" action={saveStages}><i className="material-icons">save_alt</i>Save</OakButton>
                <OakButton theme="default" variant="animate in" align="right" action={initializeStages}><i className="material-icons">undo</i>Reset</OakButton>
                <div className="space-bottom-2"></div>
                    {stage?.map((item, idx) => (
                        <div className="stage-row" key={idx}>
                            <div><OakText  id="name" label={`Level ${idx+1}`} data={item} handleChange ={ (e) =>handleChangeStage(e, idx) } /></div>
                            <div className="space-bottom-2"><OakButton theme="secondary" variant="animate in" action={handleRemoveStage(idx)}><i className="material-icons">delete</i>Remove</OakButton></div>
                        </div>
                    ))}
                    {(!stage || stage.length === 0) && <div>No custom stages defined</div>}
                </div>
        </div>
    )
}

export default Stages;