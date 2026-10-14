<?php

declare(strict_types=1);

namespace Onedrop\AjaxForm\Eel;

/*                                                                        *
 * This script belongs to the Neos Flow package "Onedrop.AjaxForm".       *
 *                                                                        *
 *                                                                        */

use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use Onedrop\AjaxForm\Service\OverrideConfigurationStore;

class AjaxFormHelper implements ProtectedContextAwareInterface
{
    #[Flow\Inject]
    protected OverrideConfigurationStore $overrideConfigurationStore;

    /**
     * Store the override configuration of a form and return the identifier the ajax endpoint can load it with
     *
     * @param array<string, mixed>|null $overrideConfiguration
     */
    public function storeOverrideConfiguration(?string $formIdentifier, ?array $overrideConfiguration): ?string
    {
        if (empty($formIdentifier) || empty($overrideConfiguration)) {
            return null;
        }

        return $this->overrideConfigurationStore->store($formIdentifier, $overrideConfiguration);
    }

    public function allowsCallOfMethod($methodName): bool
    {
        return true;
    }
}
