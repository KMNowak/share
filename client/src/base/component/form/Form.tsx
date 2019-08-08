import * as React from "react";
import {FormState} from "./FormState";
import {FormProps} from "./FormProps";
import {Response} from "./Response";
import {Values} from "./Values";
import {FormContext} from "./FormContext";

/*
 * The context which allows state and functions to be shared with Field.
 * Note that we need to pass createContext a default value which is why undefined is unioned in the type
 */
export const FormCtx = React.createContext<FormContext | undefined>(
    undefined
);


export class Form extends React.Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);

        const response: Response = {message: '', errors: {}};
        const values: Values = {};
        this.state = {
            values,
            response
        };
    }

    /**
     * Executes the validation rule for the field and updates the form errors
     * @param {string} fieldName - The field to validate
     * @returns {string} - The error message
     */
    private validate = (fieldName: string): string => {
        let newError: string = "";

        if (
            this.props.fields[fieldName] &&
            this.props.fields[fieldName].validation
        ) {
            newError = this.props.fields[fieldName].validation!.rule(
                this.state.values,
                fieldName,
                this.props.fields[fieldName].validation!.args
            );
        }
        this.state.response.errors[fieldName] = newError;
        this.setState({
            response: {
                errors: {...this.state.response.errors, [fieldName]: newError}
            }
        });
        return newError;
    };

    /**
     * Returns whether there are any errors in the errors object that is passed in
     * @param {Response} response
     */
    private haveErrors(response: Response) {
        let haveError: boolean = false;
        Object.keys(response.errors).map((key: string) => {
            if (response.errors[key].length > 0) {
                haveError = true;
            }
        });
        return haveError;
    }

    /**
     * Handles form submission
     * @param {React.FormEvent<HTMLFormElement>} e - The form event
     */
    private handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();


        if (this.validateForm()) {
            const submitSuccess: boolean = await this.submitForm();
            this.setState({submitSuccess});
        }
    };

    /**
     * Executes the validation rules for all the fields on the form and sets the error state
     * @returns {boolean} - Whether the form is valid or not
     */
    private validateForm(): boolean {
        const response: Response = {errors: {}};
        Object.keys(this.props.fields).map((fieldName: string) => {
            response.errors[fieldName] = this.validate(fieldName);
        });
        this.setState({response});
        return !this.haveErrors(response);
    }

    /**
     * Submits the form to the http api
     * @returns {boolean} - Whether the form submission was successful or not
     */
    private async submitForm(): Promise<boolean> {
        try {
            const responseServer = await fetch(this.props.action, {
                method: "post",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }),
                body: JSON.stringify(this.state.values)
            });
            if (responseServer.status === 400) {
                /* Map the validation errors to Errors */
                let responseBody: any;
                responseBody = await responseServer.json();
                const response: Response = {message: responseBody.message, errors: {}};
                responseBody.errors.forEach((obj: any) => {
                    const fieldName = obj.field.toLowerCase();
                    response.errors[fieldName] = obj.message;
                });
                this.setState({response});
            }
            return responseServer.ok;
        } catch (ex) {
            return false;
        }
    }

    /**
     * Stores new field values in state
     * @param {IValues} values - The new field values
     */
    private setValues = (values: Values) => {
        this.setState({values: {...this.state.values, ...values}});
    };

    render() {
        const {submitSuccess, response} = this.state;
        const context: FormContext = {
            ...this.state,
            setValues: this.setValues,
            validate: this.validate
        };
        return (
            <FormCtx.Provider value={context}>
                <form onSubmit={this.handleSubmit} noValidate={true}>
                    <div className="container">

                        {this.props.render()}

                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={this.haveErrors(response)}
                            >
                                Submit
                            </button>
                        </div>
                        {submitSuccess && (
                            <div className="alert alert-info" role="alert">
                                The form was successfully submitted! {response.message}
                            </div>
                        )}
                        {submitSuccess === false &&
                        !this.haveErrors(response) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, an unexpected error has occurred {response.message}
                            </div>
                        )}
                        {submitSuccess === false &&
                        this.haveErrors(response) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, the form is invalid. Please review, adjust and try
                                again {response.message}
                            </div>
                        )}
                    </div>
                </form>
            </FormCtx.Provider>
        );
    }
}