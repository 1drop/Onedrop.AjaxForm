<?php

declare(strict_types=1);

namespace Onedrop\AjaxForm\Controller;

/*                                                                        *
 * This script belongs to the Neos Flow package "Onedrop.AjaxForm".       *
 *                                                                        *
 *                                                                        */

use Neos\Flow\Annotations as Flow;
use Neos\Flow\I18n\Exception\InvalidLocaleIdentifierException;
use Neos\Flow\I18n\Locale;
use Neos\Flow\I18n\Service;
use Neos\Flow\Mvc\Controller\ActionController;
use Neos\Flow\Security\Context;

class AjaxFormController extends ActionController
{
    /**
     * @Flow\Inject
     * @var Context
     */
    protected Context $securityContext;

    /**
     * @Flow\Inject
     * @var Service
     */
    protected Service $i18nService;

    /**
     * @throws InvalidLocaleIdentifierException
     */
    public function indexAction(string $formIdentifier, string $presetName, string $locale = ''): void
    {
        if (!empty($locale)) {
            $currentLocale = new Locale($locale);
            $this->i18nService->getConfiguration()->setCurrentLocale($currentLocale);
        }

        $this->view->assignMultiple([
            'formIdentifier' => $formIdentifier,
            'presetName' => $presetName,
        ]);
    }
}
