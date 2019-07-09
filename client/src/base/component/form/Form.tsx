import * as React from "react";
import {FormState} from "./FormState";
import {FormProps} from "./FormProps";
import {Errors} from "./Errors";
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

        const errors: Errors = {};
        const values: Values = {};
        this.state = {
            errors,
            values
        };
    }

    /**
     * Returns whether there are any errors in the errors object that is passed in
     * @param {Errors} errors - The field errors
     */
    private haveErrors(errors: Errors) {
        let haveError: boolean = false;
        Object.keys(errors).map((key: string) => {
            if (errors[key].length > 0) {
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

        console.log(this.state.values);

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
        // TODO - validate form
        return true;
    }

    /**
     * Submits the form to the http api
     * @returns {boolean} - Whether the form submission was successful or not
     */
    private async submitForm(): Promise<boolean> {
        // TODO - submit the form
        return true;
    }

    /**
     * Stores new field values in state
     * @param {IValues} values - The new field values
     */
    private setValues = (values: Values) => {
        this.setState({values: {...this.state.values, ...values}});
    };

    render() {
        const {submitSuccess, errors} = this.state;
        const context: FormContext = {
            ...this.state,
            setValues: this.setValues
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
                                disabled={this.haveErrors(errors)}
                            >
                                Submit
                            </button>
                        </div>
                        {submitSuccess && (
                            <div className="alert alert-info" role="alert">
                                The form was successfully submitted!
                            </div>
                        )}
                        {submitSuccess === false &&
                        !this.haveErrors(errors) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, an unexpected error has occurred
                            </div>
                        )}
                        {submitSuccess === false &&
                        this.haveErrors(errors) && (
                            <div className="alert alert-danger" role="alert">
                                Sorry, the form is invalid. Please review, adjust and try again
                            </div>
                        )}
                    </div>
                </form>
            </FormCtx.Provider>
        );
    }
}