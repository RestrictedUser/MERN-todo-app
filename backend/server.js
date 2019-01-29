// dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
//require model file
let Todo = require('./todo.model');

// allows for middleware use
app.use(cors());
app.use(bodyParser.json());
// connect to mongo localhost so that database and server can communicate
mongoose.connect('mongodb://localhost/todos', { useNewUrlParser: true});
const connection = mongoose.connection;
// check for connection and log this message once connection is open
connection.once('open', function(){
    console.log("MongoDB database connection established successfully");
});
// root route to show todos on homepage
todoRoutes.route('/').get(function(req, res){
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});
// route to show specific todos by id
todoRoutes.route('/:id').get( (req, res) => {
    let id = req.params.id;
    Todo.findById(id, function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});
//Post route to add a new request
todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
    })
    .catch(err => {
        res.status(400).send('adding new todo failed');
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    console.log('update happened');
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo) 
            res.status(404).send('data is not found');
         else 
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo update');
            })
            .catch(err => {
                res.status(400).send('Update not possible');
            });
        
    });
});
// UNDER CONSTRUCTION
// todoRoutes.route("/todos/delete/:id").delete(function(req, res) {
    
//    Todo.findByIdAndRemove(req.params.id, req.body, function(err, todo) {
//     if (err) return next(err);
//     res.json(todo);
//     });
// res.send("route works");
     
    
//   });

todoRoutes.route('/delete/:id').get(function (req, res) {
    Todo.findByIdAndRemove({_id: req.params.id}, function(err, todos){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});


// UNDER CONSTRUCTION^^

app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});