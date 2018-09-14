# Onedrop.AjaxForm

This package provides an additional form element which can be used as a replacement 
of ``Neos.NodeTypes:Form`` to serve every form asynchronously via javascript.

It's built according to the principle of progressive enhancement and will fallback to 
the default behavior of the `Form` element.

This is especially useful if you serve your form inside a modal dialog or an accordion
and the regular form causes a page reload which makes the confirmation message invisible
to your user.

This package adds additional javascript to the end of the body of every page which provides
the functionality. 

**This javascript does not require jQuery, it's plain vanilla.**  

## Compatibility

| Neos Version     | Onedrop.AjaxForm Version  |
|------------------|---------------------------|
| Neos 3.x         | 3.x                       |
| Neos 2.3 LTS     | 2.x                       |

## How-To:

### Install: 

Use the command ``composer require onedrop/ajaxform`` to add this package as a requirement to your Neos project.  
(Or: Download the zip and unpack it to ``Packages/Application/Onedrop.AjaxForm``)

### Routes.yaml:

It's no longer necessary to modify any `Routes.yaml` as it's deprecated. The additional Ajax-routes are now included
via `Settings.yaml`.

## Usage: 

### Fusion:

You can use the ``Onedrop.AjaxForm:Form`` Fusion object as a replacement for the regular ``Neos.NodeTypes:Form``
element e.g.

```neosfusion
page = Page {  
  body.parts.newsletterForm = Onedrop.AjaxForm:Form {  
    formIdentifier = 'newsletter-form'  
    presetName = 'bootstrap'  
  }  
}
```

### Content element:

This package provides a content element 'Ajax Form' which you can use as replacement for the regular
'Form' content element.  
The easiest way is just to select your existing form element and change it's type in the settings tab 
of the selected content element to 'Ajax Form'.

## JavaScript:

The form submission is handled via vanilla javascript.  
This package automatically appends the necessary script to the end of the body of every ``Neos.Neos:Page`` where 
a form is placed.

If you use Grunt, Gulp or any other build system, you probably don't want this extra script, 
but include it in your build process, than you can remove this inclusion by changing the setting ``Settings.yaml``:

```yaml
Onedrop:
  AjaxForm:
    includeJavascript: true
```

## JS Events

You can use 2 events to register you event listens.

Before Send Ajax Form `Onedrop.AjaxForm:before`

After render Ajax Form to HTML `Onedrop.AjaxForm:after`

### Form reload

As the content of your form is being replaced by the confirmation message you usually want 
the form to reset after the user has seen the confirmation (so that the form can be submitted a second time).

If you place an attribute ``data-reset-form="1"`` inside the confirmation message, the form is 
being resetted after 5 seconds.

E.g. ``myform.yaml``

    finishers:
      -
        identifier: 'Neos.Form:Confirmation'
        options:
          message: |
                  <div class="callback-success" data-reset-form="1">
                      <h4>Thank you for your request</h4>
                      We will contact you asap.
                  </div>

### Use javascript out of context

The JS is also shaped for general purpose, you can wrap any form in a div to configure the form
to be served over ajax. You must have a controller URL that only serves the HTML for the form you
want to ajaxify.

```html
<div data-ajax="ajax-form" data-ajax-uri="/some/ajax/endpoint">
    <f:form action="doSomething" method="POST">
        <!-- Form fields -->
    </f:form>
</div>
```
