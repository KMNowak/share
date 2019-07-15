import * as React from "react";
import {Textbox} from "../textbox/Textbox";
import {Dropdown} from "../dropdown/Dropdown";
import {FieldProps} from "./FieldProps";
import {Errors} from "../form/Errors";
import {FormContext} from "../form/FormContext";
import {FormCtx} from "../form/Form";
import {MultiTextbox} from "../textbox/MultiTextbox";


export const Field = ({id, label, editor, options, value}: FieldProps) => {

    /**
     * Gets the validation error for the field
     * @param {IErrors} errors - All the errors from the form
     * @returns {string[]} - The validation error
     */
    const getError = (errors: Errors): string => (errors ? errors[id] : "");

    /** Gets the inline styles for editor
     * @param {IErrors} errors - All the errors from the form
     * @returns {any} - The style object
     */
    const getEditorStyle = (errors: Errors): any =>
        getError(errors) ? { borderColor: "red" } : {};

    return (
        <FormCtx.Consumer>
            {(context: FormContext) => (
                <div className="form-group">
                    {label && <label htmlFor={id}>{label}</label>}

                    {editor!.toLowerCase() === "textbox" && <Textbox id={id} value={value} style={getEditorStyle(context.errors)} context={context}  />}

                    {editor!.toLowerCase() === "multilinetextbox" && <MultiTextbox id={id} value={value} style={getEditorStyle(context.errors)} context={context}/>}

                    {editor!.toLowerCase() === "dropdown" && <Dropdown id={id} value={value} options={options} style={getEditorStyle(context.errors)} context={context}/>}

                    {/* TODO - display validation error */}
                    {getError(context.errors) && (
                        <div style={{color: "red", fontSize: "80%"}}>
                            <p>{getError(context.errors)}</p>
                        </div>
                    )}
                </div>
            )}
        </FormCtx.Consumer>
    );
};
Field.defaultProps = {
    editor: "textbox"
};