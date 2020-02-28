import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import './style.scss';
import OakText from '../../oakui/OakText';
import { Authorization } from '../Types/GeneralTypes';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import OakButton from '../../oakui/OakButton';
import { fetchStage, saveStage } from '../../actions/StageActions';

interface Props {
    match: any,
    authorization: Authorization,
    stage: any,
    fetchStage: Function,
    saveStage: Function
}

const domain = "stages";

const Stages = (props: Props) => {
    const [stage, setStage] = useState([{name: ''}]);


    useEffect(() => {
        const eventBus = receiveMessage().subscribe(message => {
          if (message.name === domain && message.signal) {
            sendMessage('notification', true, {
              type: 'success',
              message: `${domain} ${message.data.action}`,
              duration: 5000,
            });
          }
        });
        return () => eventBus.unsubscribe();
      });

    useEffect(() => {
        if(props.authorization.isAuth){
            props.fetchStage(props.match.params.tenant, props.authorization);
        }
    }, []);

    useEffect(() => {
        if(props.authorization.isAuth){
            props.fetchStage(props.match.params.tenant, props.authorization);
        }
    }, [props.authorization.isAuth]);

    useEffect(() => {
        setStage(props.stage.data);
    }, [props.stage])

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
        props.saveStage(props.match.params.tenant, props.authorization, stage);
    }

    return (
        <div>
            <div className="form">
                <OakButton theme="secondary" variant="animate out" align="left" action={ handleAddStage }><i className="material-icons">label_important</i>New Stage</OakButton>
                <OakButton theme="primary" variant="animate out" align="center" action={saveStages}><i className="material-icons">save_alt</i>Save</OakButton>
                <OakButton theme="default" variant="animate in" align="right" action={() => props.fetchStage(props.match.params.tenant, props.authorization)}><i className="material-icons">undo</i>Reset</OakButton>
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

const mapStateToProps = state => ({
    stage: state.stage
});

export default connect(mapStateToProps, {
fetchStage, saveStage
})(Stages);
  