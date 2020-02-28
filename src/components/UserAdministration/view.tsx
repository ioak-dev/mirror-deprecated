import React, { useState, useEffect } from 'react'
import { Authorization } from '../Types/GeneralTypes';
import './style.scss'
import OakDialog from '../../oakui/OakDialog';
import OakButton from '../../oakui/OakButton';
import OakCheckbox from '../../oakui/OakCheckbox';

interface Props {
    match: any,
    setProfile: Function,
    profile: any,
    authorization: Authorization,
    logout: Function,
    user: any,
    stages: any,
    saveUser: Function,
    isDialogOpen: boolean,
    toggleDialog: any
}

const UserAdministrationView = (props: Props) => {
    const administrativeRolesList = ['tenantAdministrator', 'userAdministrator'];

    const [data, setData] = useState({
        administrativeRoles: {},
        supportRoles: {}
    });

    useEffect(() => {    
        props.setProfile({...props.profile, tenant: props.match.params.tenant});
    }, []);

    useEffect(() => {
        if (props.user && props.stages) {
            let administrativeRoles = {};
            let supportRoles = {};
            administrativeRolesList.forEach((item) => {
                administrativeRoles[item] = props.user.roles && props.user.roles.indexOf(item) >= 0 ? true : false;
            });
            props.stages.forEach((item) => {
                supportRoles[item.name] = props.user.roles && props.user.roles.indexOf(item.name) >= 0 ? true : false;
            });
            setData({...data, 
                administrativeRoles: administrativeRoles,
                supportRoles: supportRoles
            });
        }
    }, [props.user, props.stages])

    const saveRequest = () => {
        let roles: string[] = [];
        Object.keys(data.administrativeRoles).forEach(item => {
            if(data.administrativeRoles[item]) {
                roles.push(item);
            }
        });
        Object.keys(data.supportRoles).forEach(item => {
            if(data.supportRoles[item]) {
                roles.push(item);
            }
        });
        
        props.saveUser({
            id: props.user._id,
            roles: roles
        }, true);
        props.toggleDialog();
    }

    const handleSupportRoleChange = (event) => {
        setData({...data,
            supportRoles: {
                ...data.supportRoles,
                [event.target.name]: event.target.value
            }
        });
    }

    const handleAdministrativeRoleChange = (event) => {
        setData({...data,
            administrativeRoles: {
                ...data.administrativeRoles,
                [event.target.name]: event.target.value
            }
        });
    }
   
    return (
        <div className="view-user">
            <OakDialog visible={props.isDialogOpen} toggleVisibility={props.toggleDialog} >
                <div className="dialog-body">
                    {props.user && 
                        <>
                            <div className="typography-4">User Data</div>
                            <div className="basic-data">
                                <div className="label">Email</div>
                                <div className="value">{props.user.email}</div>
                                <div className="label">Full Name</div>
                                <div className="value">John Doe</div>
                            </div>
                            <div className="typography-4 space-top-3">Administrative Roles</div>
                            <div className="role-container">
                                <OakCheckbox data={data.administrativeRoles} id="tenantAdministrator" label="Tenant Administrator" handleChange={handleAdministrativeRoleChange} theme="primary" />
                                <OakCheckbox data={data.administrativeRoles} id="userAdministrator" label="User Administrator" handleChange={handleAdministrativeRoleChange} theme="primary" />
                            </div>
                            <div className="typography-4 space-top-3">Support Roles</div>
                            <div className="role-container">
                                {props.stages.map(stage => 
                                        <OakCheckbox key={stage.name} data={data.supportRoles} id={stage.name} label={stage.name} handleChange={handleSupportRoleChange} theme="primary" />
                                )}
                            </div>
                        </>
                    }
                </div>
                <div className="dialog-footer">
                    <OakButton theme="primary" variant="outline" align="right" icon="save" action={saveRequest}>Save Changes</OakButton>
                </div>
            </OakDialog>
        </div>
    )
}

export default UserAdministrationView;
