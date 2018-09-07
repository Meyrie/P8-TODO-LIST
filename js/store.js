/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 * Crée un nouvel objet de stockage côté client et crée un espace vide si aucun stockage existe.
	 * @param {string} name The name of our DB we want to use. Le nom de notre DB que nous voulons utiliser.
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls. La foncion de rappel.
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;
		//_dbName est une méthode privé de l'objet name

		if (!localStorage[name]) {
			var data = {
				todos: []
			};

			localStorage[name] = JSON.stringify(data);
		}

		callback.call(this, JSON.parse(localStorage[name]));
	}

	/**
	 * Finds items based on a query given as a JS object
	 * Trouve les éléments basés sur une requête donnée en tant qu'objet JS
	 * @param {object} query The query to match against (i.e. {foo: 'bar'}) La requête à comparer (c-à-d {foo: 'bar'})
	 * @param {function} callback	 The callback to fire when the query has
	 * completed running. La fonction de rappel
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 *   données retournera tous les éléments qui ont foo: bar et
	 *	 hello: world dans leurs propriétés
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}

		var todos = JSON.parse(localStorage[this._dbName]).todos;

		callback.call(this, todos.filter(function (todo) {
			for (var q in query) {
				if (query[q] !== todo[q]) {
					return false;
				}
			}
			return true;
		}));
	};

	/**
	 * Will retrieve all data from the collection
	 * Récupére toutes les données.

	 * @param {function} callback The callback to fire upon retrieving data
	 * (callback) La fonction de rappel lors de la récupération des données.
	 */
	Store.prototype.findAll = function (callback) {
		callback = callback || function () {};
		callback.call(this, JSON.parse(localStorage[this._dbName]).todos);
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 * Sauvegarde les données données dans la base de données. Si aucun élément n'existe, un nouveau élément
	 *  sera créé, sinon une mise à jour des propriétés de l' élément existant sera réalisé
	 * @param {object} updateData The data to save back into the DB. données à sauvegarder dans la base de données
	 * @param {function} callback The callback to fire after saving. fonction de rappel après l'enregistrement
	 * @param {number} id An optional param to enter an ID of an item to update
	 *  paramètre facultatif correspondantà l' identifiant d'un élément à mettre à jour
	 */
	Store.prototype.save = function (updateData, callback, id) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;

		callback = callback || function () {};

		
		// Generate an ID. Génrérer un id unique.
		var	newId = ""
	    var d = new Date(); 

        for (var i = 0; i < 6; i++) {
     		newId += d.getTime();
		}
console.log(newId)
		// If an ID was actually given, find the item and update each property
		// Si un ID a été donné, trouve l'élément et met à jour les propriétés
		if (id) {
			for (var i = 0; i < todos.length; i++) {
				if (todos[i].id === id) {
					for (var key in updateData) {
						todos[i][key] = updateData[key];
					}
					break;
				}
			}

			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, todos);
		} else {

    		// Assign an ID
			updateData.id = parseInt(newId);
    

			todos.push(updateData);
			localStorage[this._dbName] = JSON.stringify(data);
			callback.call(this, [updateData]);
		}
	};

	/**
	 * Will remove an item from the Store based on its ID
	 * Retire un élément en fonction de son identifiant.
	 * @param {number} id The ID of the item you want to remove. L'identifiant de l'objet que vous souhaitez supprimer.
	 * @param {function} callback The callback to fire after saving. callback après l'enregistrement.
	 */
	Store.prototype.remove = function (id, callback) {
		var data = JSON.parse(localStorage[this._dbName]);
		var todos = data.todos;
		var todoId;
		
		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == id) {
				todoId = todos[i].id;
			}
		}

		for (var i = 0; i < todos.length; i++) {
			if (todos[i].id == todoId) {
				todos.splice(i, 1);
			}
		}

		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, todos);
	};

	/**
	 * Will drop all storage and start fresh. 
	 * Efface tout et commence un nouveau stockage
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		var data = {todos: []};
		localStorage[this._dbName] = JSON.stringify(data);
		callback.call(this, data.todos);
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);