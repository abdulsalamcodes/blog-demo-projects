import client from "./client.js";
import { join } from "path";
import express from "express";
import bodyParser from "body-parser";
import { engine } from "express-handlebars";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("views", join(__dirname, "views"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Route to display the list of customers
app.get("/", (req, res) => {
  // Use gRPC client to fetch all customers
  client.getAll(null, (err, data) => {
    if (!err) {
        res.render("customers", { results: data.customers });
    }
  });
});

// Route to handle the creation of a new customer
app.post("/save", (req, res) => {
  // Create a new customer object from the request data
  let newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  // Use gRPC client to insert the new customer
  client.insert(newCustomer, (err, data) => {
    if (err) throw err;

    console.log("Customer created successfully", data);
    res.redirect("/");
  });
});

// Route to handle the updating of an existing customer
app.post("/update", (req, res) => {
  // Create an updated customer object from the request data
  const updateCustomer = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  // Use gRPC client to update the customer
  client.update(updateCustomer, (err, data) => {
    if (err) throw err;

    console.log("Customer updated successfully", data);
    res.redirect("/");
  });
});

// Route to handle the removal of a customer
app.post("/remove", (req, res) => {
  // Use gRPC client to remove the customer by ID
  client.remove({ id: req.body.customer_id }, (err, _) => {
    if (err) throw err;

    console.log("Customer removed successfully");
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
});
