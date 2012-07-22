load('application');

before(loadTodo, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New todo';
    this.todo = new Todo;
    render();
});

action(function create() {
    Todo.create(req.body.Todo, function (err, todo) {
        if (err) {
            flash('error', 'Todo can not be created');
            render('new', {
                todo: todo,
                title: 'New todo'
            });
        } else {
            flash('info', 'Todo created');
            redirect(path_to.todos());
        }
    });
});

action(function index() {
    this.title = 'Todos index';
    Todo.all(function (err, todos) {
        render({
            todos: todos
        });
    });
});

action(function show() {
    this.title = 'Todo show';
    render();
});

action(function edit() {
    this.title = 'Todo edit';
    render();
});

action(function update() {
    this.todo.updateAttributes(body.Todo, function (err) {
        if (!err) {
            flash('info', 'Todo updated');
            redirect(path_to.todo(this.todo));
        } else {
            flash('error', 'Todo can not be updated');
            this.title = 'Edit todo details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.todo.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy todo');
        } else {
            flash('info', 'Todo successfully removed');
        }
        send("'" + path_to.todos() + "'");
    });
});

function loadTodo() {
    Todo.find(params.id, function (err, todo) {
        if (err || !todo) {
            redirect(path_to.todos());
        } else {
            this.todo = todo;
            next();
        }
    }.bind(this));
}
