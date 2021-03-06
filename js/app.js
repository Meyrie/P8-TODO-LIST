/*global app, $on */
(function () {
	'use strict';

	/**
	 * Sets up a brand new Todo list.
	 * Configure une toute nouvelle Todo list.
	 * @param {string} name The name of your new to do list.  Le nom de votre nouvelle TODO list.
	 */
	function Todo(name) {
		this.storage = new app.Store(name);
		this.model = new app.Model(this.storage);
		this.template = new app.Template();
		this.view = new app.View(this.template);
		this.controller = new app.Controller(this.model, this.view);
	}
/**
	 * Définit un nouveau todo
	 */
	var todo = new Todo('todos-vanillajs'); // dans View.js, View.prototype.bind() et View.prototype.render()
/**
	 * Ajoute la route de la page dans l' url ''|| active || completed
	 */
	function setView() {
		todo.controller.setView(document.location.hash);
	}
	$on(window, 'load', setView);
	$on(window, 'hashchange', setView);
})();
