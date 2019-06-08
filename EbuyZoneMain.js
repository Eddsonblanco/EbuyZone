var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table")
var chalk = require("chalk")

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",

  // Your passwordnpm,
  password: "Eb.16587981",
  database: "EbuyZone_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
console.log("connected to database");
  options();
});

function options() {
  inquirer
      .prompt([
        {
          name: "actions",
          type: "rawlist",
          message: "Please choose from the following actions.",
          choices: ["View Products for Sale", "View Low Inventory", "Add New Product", "Delete a Product"]
        },
      ])
      .then(function(answer) {
          if (answer.actions === "Add New Product") {
              addProduct();
          }
          else if (answer.actions === "View Products for Sale"){
            viewProducts();
          }
          else if (answer.actions === "Delete a Product"){
            deleteProduct();
          }
          else if (answer.actions === "View Low Inventory"){
            lowInventory();
          }

      })
}

function deleteProduct(){

  console.log("deleting product");
  connection.query("DELETE from PRODUCT ?",{
    id: "1"
  },function(err,results){

  })
}
function addProduct() {
    inquirer
        .prompt([
            {
            name: "product",
            type: "input",
            message: "Enter new product",
            },
            {
            name: "department",
            type: "input",
            message: "Enter department",
            },
            {
            name: "price",
            type: "input",
            message: "Enter price",
            },
            {
            name: "quantity",
            type: "input",
            message: "Enter quantity",
            }
        ]).then(function(answer) {
            connection.query("INSERT INTO product SET ?", 
        {
            item_name: answer.product,
            category: answer.department,
            price: answer.price,
            quantity: answer.quantity
          },
          function(err, data) {
            if (err) throw err;
            
            next();
          }) 
          
    })
}
function next() {
  inquirer
      .prompt([
        {
          name: "actions",
          type: "rawlist",
          message: "What would you like to do next?",
          choices: [ "Add New Product", "Exit"]
        },
      ])
      .then(function(answer) {
          if (answer.actions === "Add New Product") {
              addProduct();
          } else {
              connection.end();
          }
      })
}

function viewProducts() {
  connection.query("SELECT * FROM product", function(err, results) {
        //Makes table
        var table = new Table({
          head: ["ID", "item Name", "category", "Price", "Quantity"]
        })
      console.log("<--                                              -->")
      console.log("                       For sale                    :")
      console.log("<--                                              -->")
      for (var i = 0; i < results.length; i++) {
        table.push([results[i].id, results[i].item_name, results[i].category, results[i].price, results[i].quantity]);
      }
      console.log(table.toString());
      next();
  })
  
}
function lowInventory() {
  connection.query("SELECT * FROM product WHERE quantity < 10", function(err, results) {
      var table = new Table({
        head: ["ID", "item Name", "category", "Price", "Quantity"]
      })
      console.log("<--                                              -->")
      console.log("                       For sale                    :")
      console.log("<--                                              -->")
      for (var i = 0; i < results.length; i++) {
        table.push([results[i].id, results[i].item_name, results[i].category, results[i].price, results[i].quantity]);
      }
      console.log(table.toString());
      next();
  })
}


