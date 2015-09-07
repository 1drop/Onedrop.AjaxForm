<?php
namespace Onedrop\AjaxForm\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Onedrop.AjaxForm".      *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\ActionController;
use TYPO3\Flow\Security\Context;

class AjaxFormController extends ActionController {

	/**
	 * @var Context
	 */
	protected $securityContext;

	/**
	 * Injects the Security Context
	 *
	 * @param Context $securityContext
	 * @return void
	 */
	public function injectSecurityContext(Context $securityContext) {
		$this->securityContext = $securityContext;
	}

	/**
	 * @param string $formIdentifier
	 * @param string $presetName
	 * @return void
	 */
	public function indexAction($formIdentifier, $presetName) {
		$this->view->assign('formIdentifier', $formIdentifier);
		$this->view->assign('presetName', $presetName);
	}

}