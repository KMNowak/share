import * as React from "react";
import {Fields} from "./Fields";
import {Values} from "./Values";
import {Response} from "./Response";

export interface FormProps {
    /* The http path that the form will be posted to */
    action: string;

    /* The props for all the fields on the form */
    fields: Fields;

    /* A prop which allows content to be injected */
    render: () => React.ReactNode
    className? : string;
    submitBtnValue?: string;
}

export interface FormState {
    /* The field values */
    values: Values;

    /* The field validation error messages */
    response: Response;

    /* Whether the form has been successfully submitted */
    submitSuccess?: boolean;
}
