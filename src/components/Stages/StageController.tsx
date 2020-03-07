import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import StageItem from './StageItem';
import OakDialog from '../../oakui/OakDialog';
import OakViewResolver from '../../oakui/OakViewResolver';
import OakView from '../../oakui/OakView';
import { isEmptyOrSpaces } from '../Utils';
import { sendMessage, receiveMessage } from '../../events/MessageService';
import OakPrompt from '../../oakui/OakPrompt';
import OakText from '../../oakui/OakText';
import OakButton from '../../oakui/OakButton';
import { fetchStage, saveStage, deleteStage } from '../../actions/StageActions';

interface Props {
  match: any;
  setProfile: Function;
  profile: any;
  authorization: any;
  logout: Function;
  stage: any;
  fetchStage: Function;
  saveStage: Function;
  deleteStage: Function;
}

const domain = 'stage';

const StageController = (props: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [data, setData] = useState({
    id: undefined,
    name: '',
  });

  useEffect(() => {
    const eventBus = receiveMessage().subscribe(message => {
      if (message.name === domain && message.signal) {
        sendMessage('notification', true, {
          type: 'success',
          message: `${domain} ${message.data.action}`,
          duration: 5000,
        });
        if (message.data.action !== 'deleted') {
          setEditDialogOpen(!editDialogOpen);
        }
      }
    });
    return () => eventBus.unsubscribe();
  });

  useEffect(() => {
    if (props.authorization.isAuth) {
      props.fetchStage(props.match.params.tenant, props.authorization);
    }
  }, []);

  useEffect(() => {
    if (props.authorization.isAuth) {
      props.fetchStage(props.match.params.tenant, props.authorization);
    }
  }, [props.authorization.isAuth]);

  useEffect(() => {
    setData(props.stage.data);
  }, [props.stage]);

  useEffect(() => {
    if (!editDialogOpen) {
      setData({
        id: undefined,
        name: '',
      });
    }
  }, [editDialogOpen]);

  const editStage = stage => {
    setEditDialogOpen(true);
    setData({
      id: stage._id,
      name: stage.name,
    });
  };

  const confirmDeleteStage = id => {
    if (Object.keys(data).length === 1) {
      setDeleteDialogOpen(false);
      return;
    }
    setData({
      ...data,
      id,
    });
    setDeleteDialogOpen(true);
  };

  const deleteStage = () => {
    props.deleteStage(props.match.params.tenant, props.authorization, data.id);
  };

  const addStage = () => {
    const stage = {
      id: data.id,
      name: data.name,
    };
    if (isEmptyOrSpaces(stage.name)) {
      sendMessage('notification', true, {
        type: 'failure',
        message: 'Name is missing',
        duration: 5000,
      });
      return;
    }
    props.saveStage(props.match.params.tenant, props.authorization, stage);
  };

  const handleChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const listview = props.stage.data.map((item, idx) => (
    <div key={item._id}>
      <StageItem
        id={item._id}
        stage={item}
        index={idx}
        editStage={editStage}
        confirmDeleteStage={() => confirmDeleteStage(item._id)}
      />
      <br />
    </div>
  ));

  return (
    <div className="stage">
      <OakDialog
        visible={editDialogOpen}
        toggleVisibility={() => setEditDialogOpen(!editDialogOpen)}
      >
        <div className="dialog-body">
          <OakText
            label="Stage Name"
            data={data}
            id="name"
            handleChange={e => handleChange(e)}
          />
        </div>
        <div className="dialog-footer">
          <OakButton
            action={() => setEditDialogOpen(!editDialogOpen)}
            theme="default"
            variant="animate in"
            align="left"
          >
            <i className="material-icons">close</i>Cancel
          </OakButton>
          <OakButton
            action={() => addStage()}
            theme="primary"
            variant="animate out"
            align="right"
          >
            <i className="material-icons">double_arrow</i>Create
          </OakButton>
        </div>
      </OakDialog>

      {deleteDialogOpen}
      <OakPrompt
        action={() => deleteStage()}
        visible={deleteDialogOpen}
        toggleVisibility={() => setDeleteDialogOpen(!deleteDialogOpen)}
      />

      <OakViewResolver>
        <OakView main>
          <OakButton
            action={() => setEditDialogOpen(!editDialogOpen)}
            theme="default"
            variant="animate in"
            align="left"
            icon="add"
          >
            Create New Stage
          </OakButton>
          {listview}
        </OakView>
      </OakViewResolver>
    </div>
  );
};

const mapStateToProps = state => ({
  stage: state.stage,
});

export default connect(mapStateToProps, {
  fetchStage,
  saveStage,
  deleteStage,
})(StageController);
