'use strict';
var AjaxForm = (function () {
    function AjaxForm(element) {
        this._customEventBefore = new CustomEvent('Onedrop.AjaxForm:before', { detail: element });
        this._customEventAfter = new CustomEvent('Onedrop.AjaxForm:after', { detail: element });
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
    AjaxForm.prototype.ajax = function (formData, callback) {
        if (this._request) {
            this._request.abort();
        }
        this._request = new XMLHttpRequest();
        this._request.overrideMimeType('multipart/form-data');
        this._request.open('POST', this._formUri, true);
        this._request.onreadystatechange = callback;
        this._request.send(formData);
    };
    AjaxForm.prototype.handleResponse = function () {
        var _this = this;
        if (this._request.status >= 200 && this._request.status < 400) {
            this._delegator.innerHTML = this._request.response;
            window.dispatchEvent(this._customEventAfter);
            this._form = this._delegator.querySelector('form');
            if (this._form) {
                this.bindFormSubmitListener();
            }
            else {
                if (this._request.response.indexOf('data-reset-form') > -1) {
                    window.setTimeout(function () {
                        _this.ajax(null, _this.handleResponse.bind(_this));
                    }, 5000);
                }
            }
        }
        else {
            console.error('Something went wrong with the ajax form request');
        }
    };
    AjaxForm.prototype.onFormSubmit = function (e) {
        e.preventDefault();
        var formData = new FormData(this._form);
        if (this._submitter) {
            formData.append(this._submitter.name, this._submitter.value);
            this._submitter = null;
        }
        window.dispatchEvent(this._customEventBefore);
        this.ajax(formData, this.handleResponse.bind(this));
    };
    AjaxForm.prototype.bindFormSubmitListener = function () {
        var _this = this;
        this._form.addEventListener('submit', function (e) { return _this.onFormSubmit(e); });
        var submittingElements = this._form.querySelectorAll('button[type="submit"],input[type="submit"]');
        for (var i = 0; i < submittingElements.length; i++) {
            submittingElements.item(i).addEventListener('click', function (se) {
                _this._submitter = se.target;
            });
        }
    };
    return AjaxForm;
}());
(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var ajaxForms = document.querySelectorAll('[data-ajax="ajax-form"]');
        for (var i = 0; i < ajaxForms.length; i++) {
            new AjaxForm(ajaxForms.item(i));
        }
    });
})();
