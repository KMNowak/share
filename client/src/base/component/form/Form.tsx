import * as React from "react";

interface FormProps {
    /* The http path that the form will be posted to */
    action: string;

    /* A prop which allows content to be injected */
    render: () => React.ReactNode
}

export interface Values {
    /* Key value pairs for all the field values with key being the field name */
    [key: string]: any;
}

export interface Errors {
    /* The validation error messages for each field (key is the field name */
    [key: string]: string;
}

export interface FormState {
    /* The field values */
    values: Values;

    /* The field validation error messages */
    errors: Errors;

    /* Whether the form has been successfully submitted */
    submitSuccess?: boolean;
}

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

        if (this.validateForm()) {
            const submitSuccess: boolean = await this.submitForm();
            this.setState({ submitSuccess });
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

    render() {
        const { submitSuccess, errors } = this.state;
        return (
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
        );
    }
}