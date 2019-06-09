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
function products() {
    connection.query("SELECT * FROM product", function(err, results) {
        //Makes table
        var table = new Table({
          head: ["ID", "Product Name", "Price"]
        })
        console.log("       ")
        console.log(chalk.rgb(15, 100, 204).inverse("Items for sale:"))
        console.log("       ")
        for (var i = 0; i < results.length; i++) {
          table.push([results[i].id, results[i].item_name, results[i].price]);
        }
        console.log(table.toString());
        
        inquirer
          .prompt([
            {
              name: "itemID",
              type: "input",
              message: chalk.rgb(15, 100, 204).inverse("Please enter the ID of the product you would like to buy."),
              validate: function(value) {
                if (isNaN(value) == false) {
                  return true;
                } else {
                  return false;
                }
              }
            },
            {
              name: "amount",
              type: "input",
              message: chalk.rgb(15, 100, 204).inverse("How many would you like to buy?"),
              validate: function(value) {
                if (isNaN(value) == false) {
                  return true;
                } else {
                  return false;
                }
              }
            }
          ])
          .then(function(answer) {
              console.log(err);
            // Get the info of the chosen item
            var chosenID = answer.itemID -1;
            var chosenQuantity = answer.amount;
            var price = results[chosenID].price * chosenQuantity;
  
            if (parseInt(chosenQuantity) <= results[chosenID].quantity) {
            console.log("Your total for " + answer.amount + " - " + results[chosenID].item_name + " is: $" + price.toFixed(2));
              connection.query(
                "UPDATE product SET ? WHERE ?",
                [
                  {
                    quantity: results[chosenID].quantity - chosenQuantity
                  },
                  {
                    id: results[chosenID].id
                  }
                ],
                function(error) {
                  if (error) throw err;
                  console.log("     ")
                  console.log(chalk.yellow.inverse("Congrats, your item was successfully purchased!"));
                  console.log("     ")
                  products();
                });
            }
            else {
            
              console.log("     ")
              console.log(chalk.yellow.inverse("Sorry, there aren't enough in stock. Please adjust your order and try again."));
              console.log("     ")
              products();
            }  
            
          });
        })
  }
  products()