(function (window) {
	'use strict';

	/**
	 * Creates a new Model instance and hooks up the storage.
	 * Crée une nouvelle instance de model et relié au stock.

	 * @constructor
	 * @param {object} storage A reference to the client side storage class.
	 * Une référence à la classe de stockage côté client
	 */
	function Model(storage) {
		this.storage = storage;
	}

	/**
	 * Creates a new todo model
	 *Crée un nouveau model de todo.
	 * @param {string} [title] The title of the task. Le titre de la tâche.
	 * @param {function} [callback] The callback to fire after the model is created
	 */
	Model.prototype.create = function (title, callback) {
		title = title || '';
		callback = callback || function () {};

		var newItem = {
			title: title.trim(),
			completed: false
		};

		this.storage.save(newItem, callback);
	};

	/**
	 * Finds and returns a model in storage. If no query is given it'll simply
	 * return everything. If you pass in a string or number it'll look that up as
	 * the ID of the model to find. Lastly, you can pass it an object to match
	 * against.
	 * Trouve et renvoie un modèle en mémoire. Si aucune requête n'est donnée, il va simplement
	 * tout retourner. Si vous passez une chaîne ou un numéro, cela ressemblera à l'identifiant
	 * du modèle à trouver. Enfin, vous pouvez lui passer un objet.
	 * @param {string|number|object} [query] A query to match models against.  Une requête pour faire correspondre les modèles
	 * @param {function} [callback] The callback to fire after the model is found
	 *
	 * @example
	 * model.read(1, func); // Will find the model with an ID of 1. Trouvera le modèle avec un ID de 1
	 * model.read('1'); // Same as above
	 * //Below will find a model with foo equalling bar and hello equalling world.
	 * model.read({ foo: 'bar', hello: 'world' });
	 */
	Model.prototype.read = function (query, callback) {
		var queryType = typeof query;
		callback = callback || function () {};

		if (queryType === 'function') {
			callback = query;
			return this.storage.findAll(callback);
		} else if (queryType === 'string' || queryType === 'number') {
			query = parseInt(query, 10);
			this.storage.find({ id: query }, callback);
		} else {
			this.storage.find(query, callback);
		}
	};

	/**
	 * Updates a model by giving it an ID, data to update, and a callback to fire when
	 * the update is complete.
	  *Met à jour un modèle en lui attribuant un ID, des données et un callback lorsque la mise à jour
	 * est terminée.
	 * @param {number} id The id of the model to update. L'id du modèle à mettre à jour.
	 * @param {object} data The properties to update and their new value. les propriétés à mettre à jour et leurs valeurs.
	 * @param {function} callback The callback to fire when the update is complete.
	 */
	Model.prototype.update = function (id, data, callback) {
		this.storage.save(data, callback, id);
	};

	/**
	 * Removes a model from storage
	 * Supprime un modèle du stockage.
	 * @param {number} id The ID of the model to remove. L'id du modèle à supprimer.
	 * @param {function} callback The callback to fire when the removal is complete.
	 */
	Model.prototype.remove = function (id, callback) {
		this.storage.remove(id, callback);
	};

	/**
	 * WARNING: Will remove ALL data from storage.
	 *
	 * @param {function} callback The callback to fire when the storage is wiped.
	 */
	Model.prototype.removeAll = function (callback) {
		this.storage.drop(callback);
	};

	/**
	 * Returns a count of all todos
	 * Renvoie tous les todos
	 */
	Model.prototype.getCount = function (callback) {
		var todos = {
			active: 0,
			completed: 0,
			total: 0
		};

		this.storage.findAll(function (data) {
			data.forEach(function (todo) {
				if (todo.completed) {
					todos.completed++;
				} else {
					todos.active++;
				}

				todos.total++;
			});
			callback(todos);
		});
	};

	// Export to window
	window.app = window.app || {};
	window.app.Model = Model;
})(window);
