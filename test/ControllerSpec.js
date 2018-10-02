/*global app, jasmine, describe, it, beforeEach, expect */
// déclaration d'une suite de tests
describe('controller', function () { // Le bloc  describe  dit ce qui va être testé
	'use strict';

	var subject, model, view;

	var setUpModel = function (todos) {  // on lance le modèle
		//En associant le model avec and.callFake, 
		//on simule pour le test différentes actions liées a des méthodes. 
		model.read.and.callFake(function (query, callback) {//on récupère un ou plusieurs models de stockage existant.
		
			callback = callback || query;
			callback(todos);
		});

		model.getCount.and.callFake(function (callback) {//on fait appel au compteur

			var todoCounts = {
				active: todos.filter(function (todo) {// retourne le nb de tâches actives
					return !todo.completed;
				}).length,
				completed: todos.filter(function (todo) {// retourne le nb de tâches complêtées
					return !!todo.completed;
				}).length,
				total: todos.length
			};

			callback(todoCounts);
		});

		model.remove.and.callFake(function (id, callback) { // Appel pour Supprimer un model du stockage.
			callback();
		});

		model.create.and.callFake(function (title, callback) { //Appel de la méthode pour Créer un nouveau model de tache.
			callback();
		});

		model.update.and.callFake(function (id, updateData, callback) {//Appel de la méthode pour les mise à jour
			callback();
		});
	};

	var createViewStub = function () { // on affiche la vue
		var eventRegistry = {};
		return {
			// deux methods principales liée à la fonction View : bind et render afin de lancer différentes fonctions
			render: jasmine.createSpy('render'),
			bind: function (event, handler) {
				eventRegistry[event] = handler;
			},
			trigger: function (event, parameter) {
				eventRegistry[event](parameter);
			}
		};
	};

	beforeEach(function () { // avant chaque test

		model = jasmine.createSpyObj('model', ['read', 'getCount', 'remove', 'create', 'update']);
		view = createViewStub();
		subject = new app.Controller(model, view);
	});
    // Lorsque la pages se charge, l'appli doit afficher les entrées actives
	it('should show entries on start-up', function () {
		// TODO: write test
		let todo = {}; // Au commencement la liste des tâches est vide
		setUpModel([todo]);// On lance le modèle
		subject.setView(''); // on installe la vue
		
		// attend que la vue soit initialisée avec les entrées et le tableau vide
		expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
	});
	describe('routing', function () { // on test les différentes options qui s'affichent
		 // spécification it décrit ce qui va se passer
		it('should show all entries without a route', function () { // devrait afficher toutes les entrées quand aucune
			//option n'est sélectionnée
			var todo = {title: 'my todo'};// Créer un faux todo pour être le modèle 
			setUpModel([todo]);

			subject.setView(''); //On demande au contrôleur de définir la vue avec aucune option 

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]); // assertation expect 
			//permet de comparer les valeurs que votre code sort par rapport aux valeurs attendues
		});

		it('should show all entries without "all" route', function () {// devrait afficher toutes les tâches quand 
			//l'option all est sélectionnée
			var todo = {title: 'my todo'}; // Créer un faux todo pour être le modèle 
			setUpModel([todo]);

			subject.setView('#/'); //On demande au contrôleur de définir la vue avec l'option all

			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);
		});
		// Quand la Vue est placée sur "active", les todos actifs doivent s'afficher.
		it('should show active entries', function () {
			// TODO: write test
			//  Créer un fausse tâche pour être le modèle et le configurer pour qu'il soit actif
			var todo = {title: 'my todo', active: true};  
			setUpModel([todo]);  	
			// On demande au contrôleur de définir la vue avec l'option "active"
			subject.setView('#/active');
			
			expect(view.render).toHaveBeenCalledWith('showEntries', [todo]);  
			});

		it('should show completed entries', function () {// Quand la Vue est placée sur "complêtée", 
		//les tâches terminées doivent s'afficher.

			// TODO: write test
			var todo = {title: 'my todo', completed: true};
			
            setUpModel([todo]);
            subject.setView('#/completed');// définir la vue pour terminé
			// affiche le résultat appelé avec la fonction showEntries et le tableau de tâches associées
			expect(view.render).toHaveBeenCalledWith('showEntries', [{title: 'my todo', completed: true}]);
			
		});
	});
	// le bloc des tâches  doit être visibles quand des tâches existent
	it('should show the content block when todos exists', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: true
		});
	});
    // le bloc des tâches  doit être caché quand aucune tâche existe
	it('should hide the content block when no todos exists', function () {
		setUpModel([]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('contentBlockVisibility', {
			visible: false
		});
	});
	//Devrait basculer sur le bouton "tous" si toutes les tâches sont terminées
	it('should check the toggle all button, if all todos are completed', function () {
		setUpModel([{title: 'my todo', completed: true}]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('toggleAll', {
			checked: true
		});
	});
    // Si les tâches sont terminée, l'otion effacée les tâches terminée devrait s'afficher
	it('should set the "clear completed" button', function () {
		var todo = {id: 42, title: 'my todo', completed: true};
		setUpModel([todo]);

		subject.setView('');

		expect(view.render).toHaveBeenCalledWith('clearCompletedButton', {
			completed: 1,
			visible: true
		});
	});
	//L'option afficher toutes les tâches devrait être sélectionnée par défault
	it('should highlight "All" filter by default', function () {
		// TODO: write test
		// TODO: write test
		
		var todo = [{id:42, title:'my todo', completed:false},{id:41, title:'my todobis', completed:true}]
		setUpModel(todo);
		subject.setView('');
        expect(view.render).toHaveBeenCalledWith('setFilter', '');
	});
	//L'option tâche active devrait être sélectionnée quand l'utilisateur choisie cette option
	it('should highlight "Active" filter when switching to active view', function () {
		// TODO: write test
		var todo = [{id:42, title:'my todo', completed:false},{id:41, title:'my todobis', completed:true}]
		setUpModel([todo]);
         subject.setView('#/active');
        expect(view.render).toHaveBeenCalledWith('setFilter', 'active');
        
	});

	describe('toggle all', function () { // on test le basculement vers les tâches accomplies
		//Devrait basculer tous les tâches sur terminées
		it('should toggle all todos to completed', function () {
			// TODO: write test
			
			//  création de deux tâches
			var todos = [{id: 42, title: 'my first todo', completed: false}, {id: 43, title: 'my second todo', completed: false}];
			setUpModel(todos); //
			//  appeler la vue sur la page principale
			subject.setView('');	
			//  si on clique sur le bouton "terminer toutes les tâches"
			view.trigger('toggleAll', {completed: true});	
			// attend à ce que les tâches soient mises à jour et leurs attributs "terminés"  remplacés par "true"
			expect(model.update).toHaveBeenCalledWith(42, {completed: true}, jasmine.any(Function)); // voir doc
			expect(model.update).toHaveBeenCalledWith(43, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () {
			// TODO: write test
			//  création de deux tâches
			var todos = [{id: 42, title: 'my first todo', completed: false}, {id: 43, title: 'my second todo', completed: false}];
			setUpModel(todos);
			//  appeler la vue sur la page principale
			subject.setView('');			
			// - si on clique sur le bouton "terminer toutes les tâches"
			view.trigger('toggleAll', {completed: true});
			// - On s'attend à ce que l'attribut "terminé" du todo soit "vrai"
			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: true});
			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 43, completed: true});
		});
	});
    // on test l'ajout d'une nouvelle tâche
	describe('new todo', function () {
		it('should add a new todo to the model', function () {
			// TODO: write test
			//  appeler la vue sur la page principale
			setUpModel([])
			subject.setView('');
			// - si nous créons un nouveau todo dans notre entrée
			view.trigger('newTodo', 'a new todo');
			// - Nous nous attendons à ce que le modèle crée un nouveau todo avec la valeur  comme titre
			expect(model.create).toHaveBeenCalledWith( // on utilise ici la methode create
				'a new todo',
				jasmine.any(Function)
			);


		});

		it('should add a new todo to the view', function () {
			setUpModel([]);

			subject.setView('');

			view.render.calls.reset();
			model.read.calls.reset();
			model.read.and.callFake(function (callback) {
				callback([{
					title: 'a new todo',
					completed: false
				}]);
			});

			view.trigger('newTodo', 'a new todo');

			expect(model.read).toHaveBeenCalled();

			expect(view.render).toHaveBeenCalledWith('showEntries', [{
				title: 'a new todo',
				completed: false
			}]);
		});

		it('should clear the input field when a new todo is added', function () {
			setUpModel([]);

			subject.setView('');

			view.trigger('newTodo', 'a new todo');
 
			expect(view.render).toHaveBeenCalledWith('clearNewTodo'); // on appelle la méthode qui 
			//  Vide le contenu du nouveau todo 
		});
	});

	describe('element removal', function () { // on test la supression d'une tâche
		it('should remove an entry from the model', function () { // coté model
			// TODO: write test
			//  supprime une entrée si elle est terminée ou non
            var todo = {id: 21, title: 'my todo', completed: true};
            setUpModel([todo]);
            subject.setView('');
             view.trigger('itemRemove', {id: 21});
             expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));

		});

		it('should remove an entry from the view', function () { // côté vue
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});

		it('should update the element count', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('itemRemove', {id: 42});

			expect(view.render).toHaveBeenCalledWith('updateElementCount', 0); // on met à jour le nb d'item
		});
	});

	describe('remove completed', function () { // on test la supression des taches terminées de la liste principale
		it('should remove a completed entry from the model', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(model.read).toHaveBeenCalledWith({completed: true}, jasmine.any(Function));
			expect(model.remove).toHaveBeenCalledWith(42, jasmine.any(Function));
		});

		it('should remove a completed entry from the view', function () {
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);

			subject.setView('');
			view.trigger('removeCompleted');

			expect(view.render).toHaveBeenCalledWith('removeItem', 42);
		});
	});

	describe('element complete toggle', function () { // on test le changement d'état des tâches terminées
		it('should update the model', function () { // mise à jour côté model
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 21, completed: true});

			expect(model.update).toHaveBeenCalledWith(21, {completed: true}, jasmine.any(Function));
		});

		it('should update the view', function () { // mise à jour côté vue
			var todo = {id: 42, title: 'my todo', completed: true};
			setUpModel([todo]);
			subject.setView('');

			view.trigger('itemToggle', {id: 42, completed: false});

			expect(view.render).toHaveBeenCalledWith('elementComplete', {id: 42, completed: false});
		});
	});

	describe('edit item', function () { // on test le mode édition
		it('should switch to edit mode', function () { // on passe en mode édition côté vue
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEdit', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItem', {id: 21, title: 'my todo'});
		});

		it('should leave edit mode on done', function () { // on quitte le mode edition une fois la tache modifiée
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'new title'});
		});

		it('should persist the changes on done', function () { // modification après édition côté model
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: 'new title'});

			expect(model.update).toHaveBeenCalledWith(21, {title: 'new title'}, jasmine.any(Function));
		});

		it('should remove the element from the model when persisting an empty title', function () {
			// on supprime la tache du model si le titre en mode édition reste vide
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(model.remove).toHaveBeenCalledWith(21, jasmine.any(Function));
		});

		it('should remove the element from the view when persisting an empty title', function () {
			// on supprime l'affichage de la tâche si le titre en mode édition reste vide
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditDone', {id: 21, title: ''});

			expect(view.render).toHaveBeenCalledWith('removeItem', 21);
		});

		it('should leave edit mode on cancel', function () { // on quitte le mode édition 
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(view.render).toHaveBeenCalledWith('editItemDone', {id: 21, title: 'my todo'});
		});

		it('should not persist the changes on cancel', function () { // on ne maintient pas les changement si 
			//l'utilisateur quitte le mode édition
			var todo = {id: 21, title: 'my todo', completed: false};
			setUpModel([todo]);

			subject.setView('');

			view.trigger('itemEditCancel', {id: 21});

			expect(model.update).not.toHaveBeenCalled();
		});
	});
});
