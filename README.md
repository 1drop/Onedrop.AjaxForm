# Onedrop.AjaxForm

This package provides an additional form element which can be used as a replacement 
of ``TYPO3.Neos.NodeTypes:Form`` to serve every form asynchronously via javascript.

It's built according to the principle of progressive enhancement and will fallback to 
the default behavior of the `Form` element.

This is especially useful if you serve your form inside a modal dialog or an accordion
and the regular form causes a page reload which makes the confirmation message invisible
to your user.

This package adds additional javascript to the end of the body of every page which provides
the functionality. 

**This javascript does not require jQuery, it's plain vanilla.**  

## How-To:

### Install: 

Use the command ``composer require onedrop/ajaxform`` to add this package as a requirement to your Neos project.  
(Or: Download the zip and unpack it to ``Packages/Application/Onedrop.AjaxForm``)

### Routes.yaml:

This package provides an additional Flow Route to serve only the html part of the forms,
so they can be loaded via Ajax and replace the HTML placeholder content on the page, which
is served from the TS object.

To make this work, you need to copy the content of the file ``Routes.yaml`` from this package
into the Routes.yaml of your Neos project.  

Your ``Routes.yaml`` inside your project-root directory ``myproject/Configuration/Routes.yaml``
should then look like this:


    #                                                                        #
    # Routes configuration                                                   #
    #                                                                        #
    # This file contains the configuration for the MVC router.               #
    # Just add your own modifications as necessary.                          #
    #                                                                        #
    # Please refer to the Flow manual for possible configuration options.    #
    #                                                                        #
    
    ##
    # TYPO3 Neos subroutes
    -
      name: 'Onedrop - AjaxForm'
      uriPattern: '<OnedropAjaxFormSubRoutes>'
      subRoutes:
        'OnedropAjaxFormSubRoutes':
          package: 'Onedrop.AjaxForm'
    -
      name: 'TYPO3 Neos'
      uriPattern: '<TYPO3NeosSubroutes>'
      subRoutes:
        'TYPO3NeosSubroutes':
          package: 'TYPO3.Neos'
          variables:
            'defaultUriSuffix': '.html'

## Usage: 

### Fusion:

You can use the ``Onedrop.AjaxForm:Form`` Fusion object as a replacement for the regular ``TYPO3.Neos.NodeTypes:Form``
element e.g.

    page = Page {  
      body.parts.newsletterForm = Onedrop.AjaxForm:Form {  
        formIdentifier = 'newsletter-form'  
        presetName = 'bootstrap'  
      }  
    }

### Content element:

This package provides a content element 'Ajax Form' which you can use as replacement for the regular
'Form' content element.  
The easiest way is just to select your existing form element and change it's type in the settings tab 
of the selected content element to 'Ajax Form'.

## JavaScript:

The form submission is handled via vanilla javascript.  
This package automatically appends the necessary script to the end of the body of every ``TYPO3.Neos:Page``.

If you use Grunt, Gulp or any other build system, you probably don't want this extra script, 
but include it in your build process, than you can remove this inclusion by adding this to your sites ``Root.ts2``:

    prototype(TYPO3.Neos:Page) {
        body.javascripts.ajaxForms >
    }

### Form reload

As the content of your form is being replaced by the confirmation message you usually want 
the form to reset after the user has seen the confirmation (so that the form can be submitted a second time).

If you place an attribute ``data-reset-form="1"`` inside the confirmation message, the form is 
being resetted after 5 seconds.

E.g. ``myform.yaml``

    finishers:
      -
        identifier: 'TYPO3.Form:Confirmation'
        options:
          message: |
                  <div class="callback-success" data-reset-form="1">
                      <h4>Thank you for your request</h4>
                      We will contact you asap.
                  </div>
