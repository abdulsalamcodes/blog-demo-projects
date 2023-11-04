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

// Route to display the list of users
app.get("/", (req, res) => {
  // Use gRPC client to fetch all users
  client.getAll(null, (err, data) => {
    if (!err) {
        res.render("users", { results: data.users });
    }
  });
});

// Route to handle the creation of a new user
app.post("/save", (req, res) => {
  // Create a new user object from the request data
  let newUser = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  // Use gRPC client to insert the new user
  client.insert(newUser, (err, data) => {
    if (err) throw err;

    console.log("User created successfully", data);
    res.redirect("/");
  });
});

// Route to handle the updating of an existing user
app.post("/update", (req, res) => {
  // Create an updated user object from the request data
  const updateUser = {
    id: req.body.id,
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };

  // Use gRPC client to update the user
  client.update(updateUser, (err, data) => {
    if (err) throw err;

    console.log("User updated successfully", data);
    res.redirect("/");
  });
});

// Route to handle the removal of a user
app.post("/remove", (req, res) => {
  // Use gRPC client to remove the user by ID
  client.remove({ id: req.body.user_id }, (err, _) => {
    if (err) throw err;

    console.log("User removed successfully");
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port %d", PORT);
});
