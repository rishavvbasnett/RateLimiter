import bcrypt from "bcrypt";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import User from "./users.model.js";
import userService from "./users.service.js";
import mongoServer from "../../shared/testing/mongoMemoryServer.setup.js";
import { createUserPayload } from "../../shared/testing/createPayload.js";

const saltRounds = Number(process.env.SALT_ROUNDS);

beforeAll(async () => {
  await mongoServer.connect();
});

afterAll(async () => {
  await mongoServer.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("user service", () => {
  it("creates, persists, hashes the password, and returns a safe DTO", async () => {
    const payload = createUserPayload({
      username: "user1",
      password: "1",
    });

    const savedUser = await userService.createOne(payload);
    const persistedUser = await User.findById(savedUser._id);

    expect(persistedUser).toBeDefined();
    expect(persistedUser?.username).toBe(payload.username);
    expect(persistedUser?.passwordHash).toBeDefined();
    expect(
      await bcrypt.compare(payload.password, persistedUser?.passwordHash ?? ""),
    ).toBe(true);
    expect(await bcrypt.hash(payload.password, saltRounds)).not.toBe(
      persistedUser?.passwordHash,
    );
    expect(savedUser.username).toBe(payload.username);
    expect(savedUser).not.toHaveProperty("passwordHash");
  });

  it("gets one user by id", async () => {
    const createdUser = await userService.createOne(createUserPayload());

    await expect(userService.getOne(createdUser._id)).resolves.toEqual(
      createdUser,
    );
  });

  it("gets all users", async () => {
    const firstUser = await userService.createOne(
      createUserPayload({ username: "user1" }),
    );
    const secondUser = await userService.createOne(
      createUserPayload({ username: "user2" }),
    );

    await expect(userService.getAll()).resolves.toEqual([
      firstUser,
      secondUser,
    ]);
  });

  it("updates one user", async () => {
    const createdUser = await userService.createOne(createUserPayload());

    const updatedUser = await userService.updateOne(createdUser._id, {
      username: "updated-user",
    });

    expect(updatedUser).toEqual({
      _id: createdUser._id,
      username: "updated-user",
    });
    expect(updatedUser).not.toHaveProperty("passwordHash");
  });

  it("deletes one user", async () => {
    const createdUser = await userService.createOne(createUserPayload());

    await expect(userService.deleteOne(createdUser._id)).resolves.toEqual(
      createdUser,
    );
    await expect(User.findById(createdUser._id)).resolves.toBeNull();
  });
});
