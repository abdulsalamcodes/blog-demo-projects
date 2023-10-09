const PROTO_PATH = "./protos/users.proto";
import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const UserService = loadPackageDefinition(packageDefinition).UserService;

const client = new UserService(
  "localhost:30043",
  credentials.createInsecure()
);

export default client;
