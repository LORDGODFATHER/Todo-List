// require express for setting up the express server
const express = require('express');

// set up the port number
const port = 8000;

// importing the DataBase
const db = require('./config/mongoose');

// importng the Schema For tasks
const Task  = require('./models/task');

// using express
const app = express();

// using static files
app.use(express.static('./assets'));

// to use encrypted data
app.use(express.urlencoded());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// rendering the App Page
app.get('/', function(req, res){
    Task.find({}, function(err, task){
        if(err){
            console.log('Error in fetching tasks from db');
            return;
        }

        return res.render('home', {
            title: "Todo-List App",
            todo_list: task
        });
    }
)});


// creating Tasks
app.post('/create-task', function(req, res){
    Task.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date
        }, function(err, newTask){
        if(err){
            console.log('Error in creating task', err); 
            return;
        }

        console.log('******', newTask);
        return res.redirect('back');
    });
});


// deleting Tasks
app.get('/delete-task', function(req, res){
    // get the id from query
    var id = req.query;

    // checking the number of tasks selected to delete
    var count = Object.keys(id).length;
    for(let i=0;i<count;i++){    
        // finding and deleting tasks from the DB one by one using id
        Task.findByIdAndDelete(Object.keys(id)[i], function(err){
        if(err){
            console.log('Error in deleting tasks');
            }

            console.log('Tasks deleted');
        })
    }

    return res.redirect('back'); 
});


// make the app to listen on asigned port number
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});