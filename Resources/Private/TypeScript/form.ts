'use strict';

class AjaxForm {

    private _formUri: string;
    private _delegator: Element;
    private _form: HTMLFormElement;
    private _request: XMLHttpRequest;
    private _submitter: HTMLInputElement;

    constructor(element: Element) {
        this._delegator = element;
        if (element.hasAttribute('data-ajax-uri')) {
            this._formUri = element.getAttribute('data-ajax-uri');
        }
        this._form = <HTMLFormElement>element.querySelector('form');
        if (!this._form) {
            throw new Error('No form element found in ajax container');
        } else {
            this.bindFormSubmitListener();
        }
    }

    /**
     *  Ajax helper to send only one simultaneous request
     * @param {FormData} formData
     * @param {Function} callback
     */
    private ajax(formData: FormData, callback: any) {
        if (this._request) {
            this._request.abort();
        }
        this._request = new XMLHttpRequest();
        this._request.overrideMimeType('multipart/form-data');
        this._request.open('POST', this._formUri, true);
        this._request.onreadystatechange = callback;
        this._request.send(formData);
    }

    /**
     * Handle the response of a form submission => replace HTML content with response
     */
    private handleResponse() {
        if (this._request.status >= 200 && this._request.status < 400) {
            this._delegator.innerHTML = this._request.response;
            this._form = <HTMLFormElement>this._delegator.querySelector('form');
            // another form step has been returned, so we keep handling the form
            if (this._form) {
                this.bindFormSubmitListener();
            } else {
                // the form has been finally submitted
                if (this._request.response.indexOf('data-reset-form') > -1) {
                    // reset the form after 3 seconds to its original state
                    window.setTimeout(() => {
                        this.ajax(null, this.handleResponse.bind(this));
                    }, 5000);
                }
            }
        } else {
            console.error('Something went wrong with the ajax form request');
        }
    }

    /**
     * Capture the form submission and convert it to a ajax operation
     * @param {Event} e
     */
    private onFormSubmit(e: Event) {
        e.preventDefault();
        let formData = new FormData(this._form);
        if (this._submitter) {
            formData.append(this._submitter.name, this._submitter.value);
            this._submitter = null;
        }
        this.ajax(formData, this.handleResponse.bind(this));
    }

    /**
     * Bind the submit event to the form that is assigned to this instance
     */
    private bindFormSubmitListener() {
        this._form.addEventListener('submit', (e) => this.onFormSubmit(e));

        // firefox workaround (doesn't transmit submit value, so we need to track the submitting element)
        let submittingElements = this._form.querySelectorAll('button[type="submit"],input[type="submit"]');
        for (let i = 0; i < submittingElements.length; i++) {
            submittingElements.item(i).addEventListener('click', (se) => {
                this._submitter = <HTMLInputElement>se.target;
            })
        }
    }
}

/*
 * INITIALIZE ALL ELEMENTS
 */
(function () {
    document.addEventListener("DOMContentLoaded", function() {
        let ajaxForms = document.querySelectorAll('[data-ajax="ajax-form"]');
        for (let i = 0; i < ajaxForms.length; i++) {
            new AjaxForm(ajaxForms.item(i));
        }
    });
})();
