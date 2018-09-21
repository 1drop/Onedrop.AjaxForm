/**
 * AjaxForm loader
 *
 * Activation like
 *
 * import { AjaxForm } from '../../../../../Packages/Application/Onedrop.AjaxForm/Resources/Public/JavaScript/form.esm';
 *
 * let ajaxForms = document.querySelectorAll('[data-ajax="ajax-form"]');
 * for (let i = 0; i < ajaxForms.length; i++) {
 *     new AjaxForm(ajaxForms.item(i));
 * }
 *
 */
export class AjaxForm {
    constructor(element) {
        this._customEventBefore = new Event('Onedrop.AjaxForm:before');
        this._customEventAfter = new Event('Onedrop.AjaxForm:after');
        this._delegator = element;
        if (element.hasAttribute('data-ajax-uri')) {
            this._formUri = element.getAttribute('data-ajax-uri');
        }
        this._form = element.querySelector('form');
        if (!this._form) {
            throw new Error('No form element found in ajax container');
        }
        else {
            this.bindFormSubmitListener();
        }
    }
    ajax(formData, callback) {
        if (this._request) {
            this._request.abort();
        }
        this._request = new XMLHttpRequest();
        this._request.overrideMimeType('multipart/form-data');
        this._request.open('POST', this._formUri, true);
        this._request.onreadystatechange = callback;
        this._request.send(formData);
    }
    handleResponse() {
        if (this._request.status >= 200 && this._request.status < 400) {
            this._delegator.innerHTML = this._request.response;
            window.dispatchEvent(this._customEventAfter);
            this._form = this._delegator.querySelector('form');
            if (this._form) {
                this.bindFormSubmitListener();
            }
            else {
                if (this._request.response.indexOf('data-reset-form') > -1) {
                    window.setTimeout(() => {
                        this.ajax(null, this.handleResponse.bind(this));
                    }, 5000);
                }
            }
        }
        else {
            console.error('Something went wrong with the ajax form request');
        }
    }
    onFormSubmit(e) {
        e.preventDefault();
        let formData = new FormData(this._form);
        if (this._submitter) {
            formData.append(this._submitter.name, this._submitter.value);
            this._submitter = null;
        }
        window.dispatchEvent(this._customEventBefore);
        this.ajax(formData, this.handleResponse.bind(this));
    }
    bindFormSubmitListener() {
        this._form.addEventListener('submit', (e) => this.onFormSubmit(e));
        let submittingElements = this._form.querySelectorAll('button[type="submit"],input[type="submit"]');
        for (let i = 0; i < submittingElements.length; i++) {
            submittingElements.item(i).addEventListener('click', (se) => {
                this._submitter = se.target;
            });
        }
    }
}
