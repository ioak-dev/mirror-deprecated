import React from 'react';
import './ArcText.scss';

interface Props {
    label: string,
    id: string,
    data: any,
    type?: string,
    handleChange: any,
    errorFields?: any
}
function ArcText(props: Props) {
    console.log(props.errorFields)
    return (
        <div className="arc-text-field">
            <label>{props.label}</label>
            <input className={props.errorFields && props.errorFields[props.id] ? "error" : ""}type={props.type ? props.type : "text"} name={props.id} value={props.data[props.id]} onChange={props.handleChange}></input>
        </div>
    )
}

ArcText.propTypes = {
};

export default ArcText;
