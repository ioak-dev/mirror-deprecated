import React, {useState} from 'react';
import './OakSubMenu.scss';

interface Props {
    data: any,
    variant?: string
}

const OakSubMenu = (props: Props) => {

    const [menuActive, setMenuActive] = useState(false);

    return (
        <div className={props.variant ? "oak-sub-menu " + props.variant : "oak-sub-menu"}>
            {/* <div className="label" onClick={this.toggleMenu}>Label <i className="material-icons">keyboard_arrow_down</i></div> */}
            <button className={props.variant ? "noborder icon animate none " + props.variant : "noborder icon animate none"} onClick={() => setMenuActive(!menuActive)}><i className="material-icons">open_in_new</i></button>
            <div className={menuActive ? "content active" : "content"}>
                {props.data.map(element =>
                    <div className="menuitem">{element}</div>
                )}
            </div>
        </div>
    )
}

export default OakSubMenu;
