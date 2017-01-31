<?php
namespace Onedrop\AjaxForm\Controller;

/*                                                                        *
 * This script belongs to the Neos Flow package "Onedrop.AjaxForm".       *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Locale;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Security\Context;

class AjaxFormController extends ActionController
{

    /**
     * @var Context
     */
    protected $securityContext;
    /**
     * @Flow\Inject
     * @var \Neos\Flow\I18n\Service
     */
    protected $i18nService;


    /**
     * Injects the Security Context
     *
     * @param Context $securityContext
     * @return void
     */
    public function injectSecurityContext(Context $securityContext)
    {
        $this->securityContext = $securityContext;
    }

    /**
     * @param string $formIdentifier
     * @param string $presetName
     * @param string $locale
     */
    public function indexAction($formIdentifier, $presetName, $locale = '')
    {
        if (!empty($locale)) {
            $currentLocale = new Locale($locale);
            $this->i18nService->getConfiguration()->setCurrentLocale($currentLocale);
        }
        $this->view->assign('formIdentifier', $formIdentifier);
        $this->view->assign('presetName', $presetName);
    }

}
