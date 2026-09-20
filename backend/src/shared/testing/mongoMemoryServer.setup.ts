import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoMemoryServer: MongoMemoryServer | undefined;

const connect = async (): Promise<void> => {
  mongoMemoryServer ??= await MongoMemoryServer.create({
    binary: { version: "7.0.14" },
  });
  await mongoose.connect(mongoMemoryServer.getUri());
};

const disconnect = async (): Promise<void> => {
  await mongoose.disconnect();

  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = undefined;
  }
};

const mongoServer = {
  connect,
  disconnect,
};

export default mongoServer;
