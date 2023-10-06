const PROTO_PATH = "./customers.proto";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const CustomerService = loadPackageDefinition(packageDefinition).CustomerService;

const client = new CustomerService(
  "localhost:30043",
  credentials.createInsecure()
);

export default client;
