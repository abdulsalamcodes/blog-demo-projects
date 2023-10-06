const PROTO_PATH = "./customers.proto";
import {
  loadPackageDefinition,
  Server,
  status,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { v4 as uuidv4 } from "uuid";

// Initial data.
const customers = [
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

var customersProto = loadPackageDefinition(packageDefinition);

// Server Configuration.
const server = new Server();

server.addService(customersProto.CustomerService.service, {
  getAll: (_, callback) => {
    callback(null, { customers: customers });
  },

  get: (call, callback) => {
    let customer = customers.find((n) => n.id == call.request.id);

    if (customer) {
      callback(null, customer);
    } else {
      callback({
        code: status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  insert: (call, callback) => {
    let customer = call.request;

    customer.id = uuidv4();
    customers.push(customer);
    callback(null, customer);
  },

  update: (call, callback) => {
    let existingCustomer = customers.find((n) => n.id == call.request.id);

    if (existingCustomer) {
      existingCustomer.name = call.request.name;
      existingCustomer.age = call.request.age;
      existingCustomer.address = call.request.address;
      callback(null, existingCustomer);
    } else {
      callback({
        code: status.NOT_FOUND,
        details: "Not found",
      });
    }
  },

  remove: (call, callback) => {
    let existingCustomerIndex = customers.findIndex(
      (n) => n.id == call.request.id
    );

    if (existingCustomerIndex != -1) {
      customers.splice(existingCustomerIndex, 1);
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
