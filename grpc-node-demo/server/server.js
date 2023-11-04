const PROTO_PATH = "./protos/users.proto";
import {
  loadPackageDefinition,
  Server,
  status,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { v4 as uuidv4 } from "uuid";

// Initial data.
const users = [
  {
    id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
    name: "John Bolton",
    age: 23,
    address: "Address 1",
  },
  {
    id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
    name: "Mary Anne",
    age: 45,
    address: "Address 2",
  },
];

// Package definitions.
var packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var usersProto = loadPackageDefinition(packageDefinition);

// Server Configuration.
const server = new Server();

server.addService(usersProto.UserService.service, {
  getAll: (_, callback) => {
    callback(null, { users: users });
  },

  get: (call, callback) => {
    let user = users.find((n) => n.id == call.request.id);

    if (user) {
      callback(null, user);
    } else {
      callback({
        code: status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  insert: (call, callback) => {
    let user = call.request;

    user.id = uuidv4();
    users.push(user);
    callback(null, user);
  },

  update: (call, callback) => {
    let existingUser = users.find((n) => n.id == call.request.id);

    if (existingUser) {
      existingUser.name = call.request.name;
      existingUser.age = call.request.age;
      existingUser.address = call.request.address;
      callback(null, existingUser);
    } else {
      callback({
        code: status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  remove: (call, callback) => {
    let existingUserIndex = users.findIndex(
      (n) => n.id == call.request.id
    );

    if (existingUserIndex != -1) {
      users.splice(existingUserIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: status.NOT_FOUND,
        details: "Not found",
      });
    }
  },
});

server.bindAsync("127.0.0.1:30043", ServerCredentials.createInsecure(), (err, port) => {
  if (!err) {
    console.log(`Server running at http://127.0.0.1:${port}`);
    server.start();
  } else {
    console.error("Error binding to the port:", err);
  }
});
