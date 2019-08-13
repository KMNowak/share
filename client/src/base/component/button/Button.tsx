import * as React from "react";
import {ButtonProps} from "./ButtonProps";

export const Button = (props: ButtonProps) => {
    return (
        <button id={props.id} type={props.type} className={props.className} onClick={props.onClick} disabled={props.disabled}>
            <span>
                {props.iconCls && <i className={props.iconCls}/>}
                {props.value}
            </span>
        </button>
    );
};

Button.defaultProps = {
    type: "button",
    disabled: false,
    className:"btn btn-primary btn-block"
};