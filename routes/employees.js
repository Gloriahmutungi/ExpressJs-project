var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display employees page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM employees ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/employees/index.ejs
            res.render('employees',{data:''});   
        } else {
            // render to views/employees/index.ejs
            res.render('employees',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('employees/add', {
        name: '',
        desgnation: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let desgnation = req.body.desgnation;
    let errors = false;

    if(name.length === 0 || desgnation.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and desgnation");
        // render to add.ejs with flash message
        res.render('employees/add', {
            name: name,
            desgnation: desgnation
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            desgnation: desgnation
        }
        
        // insert query
        dbConn.query('INSERT INTO employees SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('employees/add', {
                    name: form_data.name,
                    desgnation: form_data.desgnation                    
                })
            } else {                
                req.flash('success', 'Employee successfully added');
                res.redirect('/employees');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM employees WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/employees')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('employees/edit', {
                title: 'Edit Employee', 
                id: rows[0].id,
                name: rows[0].name,
                desgnation: rows[0].desgnation
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let desgnation = req.body.desgnation;
    let errors = false;

    if(name.length === 0 || desgnation.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter employee name and desgnation");
        // render to add.ejs with flash message
        res.render('employees/edit', {
            id: req.params.id,
            name: name,
            desgnation: desgnation
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            desgnation: desgnation
        }
        // update query
        dbConn.query('UPDATE employees SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('employees/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    desgnation: form_data.desgnation
                })
            } else {
                req.flash('success', 'Employee successfully updated');
                res.redirect('/employees');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM employees WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to employees page
            res.redirect('/employees')
        } else {
            // set flash message
            req.flash('success', 'Employee successfully deleted! ID = ' + id)
            // redirect to employees page
            res.redirect('/employees')
        }
    })
})

module.exports = router;