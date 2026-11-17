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
use Neos\Flow\Mvc\Exception\StopActionException;
use Onedrop\AjaxForm\Service\OverrideConfigurationStore;

class AjaxFormController extends ActionController
{
    /**
     * @Flow\Inject
     * @var Service
     */
    protected $i18nService;

    /**
     * @Flow\Inject
     * @var OverrideConfigurationStore
     */
    protected $overrideConfigurationStore;

    /**
     * @param string $overrideConfiguration Identifier of the override configuration stored while rendering the page
     * @throws InvalidLocaleIdentifierException
     * @throws StopActionException
     */
    public function indexAction(string $formIdentifier, string $presetName, string $locale = '', string $overrideConfiguration = ''): void
    {
        if (!empty($locale)) {
            $currentLocale = new Locale($locale);
            $this->i18nService->getConfiguration()->setCurrentLocale($currentLocale);
        }

        $loadedOverrideConfiguration = [];
        if ($overrideConfiguration !== '') {
            $loadedOverrideConfiguration = $this->overrideConfigurationStore->load($overrideConfiguration, $formIdentifier);
            if ($loadedOverrideConfiguration === null) {
                // Rendering the form without its configuration could e.g. send emails to the wrong recipient
                $this->throwStatus(400, null, 'Unknown form configuration, please reload the page');
            }
        }

        $this->view->assignMultiple([
            'formIdentifier' => $formIdentifier,
            'presetName' => $presetName,
            'overrideConfiguration' => $loadedOverrideConfiguration,
        ]);
    }
}
