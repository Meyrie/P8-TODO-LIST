/*global NodeList */
(function (window) {
	'use strict';

	// Get element(s) by CSS selector: 
	// Récupére les éléments par le sélecteur CSS: qs = querySelector dans le fichier views.js
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};
	// Récupére les éléments par le sélecteur CSS: qsa = querySelectorAll dans le fichier views.js
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	// addEventListener wrapper:
	//Encapsule l'addEventListener dans le fichier views.js et app.js
	// * @param {object} (target)  La cible.
	// * @param {bolean} (type) Focus ou Blur.
	// * param {function} (callback) La fonction de rappel.
    // * @param {object} (useCapture) L' élément capturé.
  
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	// Attach a handler to event for all elements that match the selector,
	// now or in the future, based on a root element
	/**
	 * Délègue un eventListener à un parent dans le fichier views.js
	 * @param  {object} (target)  La cible.
	 * @param  {function} (selector) Vérifie qu'il y a match entre enfants et parents.
	 * @param {bolean} (type) Le type d' event.
	 * @param  {function} (handler)  Un callback exécuté si il y a une certaine condition.
	 */
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target; // cible l' élément
			var potentialElements = window.qsa(selector, target);  // qsa sur élément du même type
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0; // est-ce que dans potentialElements il y a targetElement , si >= o il y a un index et ça match

			if (hasMatch) {
				/**
				 * si on a un élément hasMatch on appel le gestionnaire sur l' élément cible.
				 */
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		/**
		 * useCapture peut être de type blur ou focus.
		 * @type {bolean}
		 */
		var useCapture = type === 'blur' || type === 'focus';
		/**
		 * $on ajoute un eventListener
		 */
		window.$on(target, type, dispatchEvent, useCapture);
	};

	// Find the element's parent with the given tag name:
	// $parent(qs('a'), 'div');
	/**
	 * Recherche le parent de l'élément avec le nom de tag : $parent(qs('a'), 'div');
	 * Utiliser dans le fichier view.js
	 * @param {object} (element) L' élément actif.
	 * @param {string} (tagName) Le tagName de l' élément.
	 */
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return; // si pas d' élément parent il ne se passe rien
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on nodes by chaining:
	// Autorise les boucle sur les nœuds : qsa('.foo').forEach(function () {})
	// qsa('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
