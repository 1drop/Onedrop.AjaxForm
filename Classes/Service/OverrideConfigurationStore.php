<?php

declare(strict_types=1);

namespace Onedrop\AjaxForm\Service;

/*                                                                        *
 * This script belongs to the Neos Flow package "Onedrop.AjaxForm".       *
 *                                                                        *
 *                                                                        */

use Neos\Cache\Frontend\VariableFrontend;
use Neos\Flow\Annotations as Flow;

/**
 * Keeps the "overrideConfiguration" of a form on the server side.
 *
 * The configuration is set in Fusion when the page is rendered, but the ajax endpoint renders the form
 * outside of Fusion. Only an identifier is passed to the client, so the configuration (e.g. email
 * recipients of finishers) can neither be read nor tampered with.
 *
 * @Flow\Scope("singleton")
 */
class OverrideConfigurationStore
{
    /**
     * @var VariableFrontend
     */
    protected $cache;

    /**
     * @param array<string, mixed> $overrideConfiguration
     * @return string|null The identifier to load the configuration with, null if there is nothing to override
     */
    public function store(string $formIdentifier, array $overrideConfiguration): ?string
    {
        if ($overrideConfiguration === []) {
            return null;
        }
        $entry = [
            'formIdentifier' => $formIdentifier,
            'overrideConfiguration' => $overrideConfiguration,
        ];
        $identifier = sha1(serialize($entry));
        if (!$this->cache->has($identifier)) {
            $this->cache->set($identifier, $entry);
        }

        return $identifier;
    }

    /**
     * @return array<string, mixed>|null The stored configuration, null if it is unknown or belongs to another form
     */
    public function load(string $identifier, string $formIdentifier): ?array
    {
        if (preg_match('/^[a-f0-9]{40}$/', $identifier) !== 1) {
            return null;
        }
        $entry = $this->cache->get($identifier);
        if (!is_array($entry) || ($entry['formIdentifier'] ?? null) !== $formIdentifier) {
            return null;
        }

        return $entry['overrideConfiguration'];
    }
}
