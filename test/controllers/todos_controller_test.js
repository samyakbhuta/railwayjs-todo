require('../test_helper.js').controller('todos', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        content: ''
    };
}

exports['todos controller'] = {

    'GET new': function (test) {
        test.get('/todos/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/todos', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Todo.find;
        Todo.find = sinon.spy(function (id, callback) {
            callback(null, new Todo);
        });
        test.get('/todos/42/edit', function () {
            test.ok(Todo.find.calledWith('42'));
            Todo.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Todo.find;
        Todo.find = sinon.spy(function (id, callback) {
            callback(null, new Todo);
        });
        test.get('/todos/42', function (req, res) {
            test.ok(Todo.find.calledWith('42'));
            Todo.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var todo = new ValidAttributes;
        var create = Todo.create;
        Todo.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, todo);
            callback(null, todo);
        });
        test.post('/todos', {Todo: todo}, function () {
            test.redirect('/todos');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var todo = new ValidAttributes;
        var create = Todo.create;
        Todo.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, todo);
            callback(new Error, todo);
        });
        test.post('/todos', {Todo: todo}, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Todo.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/todos/1', new ValidAttributes, function () {
            test.redirect('/todos/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Todo.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/todos/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

