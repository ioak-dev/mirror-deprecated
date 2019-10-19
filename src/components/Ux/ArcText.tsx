import React from 'react';
import './ArcText.scss';

interface Props {
    label: string,
    id: string,
    data: any,
    handleChange: any
}
function ArcText(props: Props) {
    return (
        <div className="arc-text-field">
            <label>{props.label}</label>
            <input type="text" name={props.id} value={props.data[props.id]} onChange={props.handleChange}></input>
        </div>
    )
}

ArcText.propTypes = {
};

export default ArcText;
