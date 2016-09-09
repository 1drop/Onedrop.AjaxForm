/**
 * Ajax forms using Onedrop.AjaxForm:Form
 */
(function($) {

	$.each($('div[data-ajax="ajax-loaded-form"]'), function (idx, ajaxForm) {
		var formIdentifier = $(ajaxForm).attr('data-identifier');
		var presetName = $(ajaxForm).attr('data-presetName');
		var locale = $(ajaxForm).attr('data-locale');
		// This route must be configured in the /Configuration/Routes.yaml of the project
		var formAjaxUrl = '/form/' + formIdentifier + '/' + presetName + '/' + locale;
		// Delegate the submit form event to the persistent ajax container
		$(ajaxForm).on('submit', 'form', function (e) {
			var formObj = $(this);
			var formURL = formObj.attr("action");
			var formData = new FormData(this);
			$.ajax({
				url: formURL,
				type: 'POST',
				data: formData,
				mimeType: "multipart/form-data",
				contentType: false,
				cache: false,
				processData: false,
				success: function (data) {
					// Replace the form with the replied content
					$(ajaxForm).hide();
					$(ajaxForm).find('.ajax-content').replaceWith(data);
					$(ajaxForm).fadeIn('slow');

					// If you provide a data-reset-form attribute in the Confirmation, the form will
					// reset it's state to original
					if (data.indexOf('data-reset-form') > -1) {
						window.setTimeout(function () {
							$(ajaxForm).hide();
							$(ajaxForm).load(formAjaxUrl + ' .ajax-content');
							$(ajaxForm).fadeIn('slow');
						}, 3000);
					}
				}
			});
			//Prevent the browser from submitting the form and cause page reload
			e.preventDefault();
		});

		// Load the form via ajax
		$(ajaxForm).load(formAjaxUrl + ' .ajax-content', function () {
			// Set hidden referer field, because form is loaded from different url
			$(ajaxForm).find('input[type="hidden"][name*="[page]"]').val(window.location.href);
		});
	});

})(jQuery);