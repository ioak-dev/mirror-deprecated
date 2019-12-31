import React from 'react';
import './OakText.scss';

interface Props {
    label: string,
    id: string,
    data: any,
    type?: string,
    handleChange: any,
    errorFields?: any,
    disabled?: boolean
}
function OakText(props: Props) {
    return (
        <div className="arc-text-field">
            <label>{props.label}</label>
            <input disabled={props.disabled} autoComplete="off"
                className={(props.errorFields && props.errorFields[props.id] ? "error" : "") + (props.disabled ? " disabled" : "")}
                type={props.type ? props.type : "text"} name={props.id} value={props.data[props.id]} onChange={props.handleChange}></input>
        </div>
    )
}

OakText.propTypes = {
};

export default OakText;
