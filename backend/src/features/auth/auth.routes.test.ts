import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import app from "../../app.js";
import User from "../users/users.model.js";
import userService from "../users/users.service.js";
import { createUserPayload } from "../../shared/testing/createPayload.js";
import mongoServer from "../../shared/testing/mongoMemoryServer.setup.js";
import { UserDocument } from "../users/users.types.js";

let user1: UserDocument;
let user2: UserDocument;

beforeAll(async () => {
  await mongoServer.connect();
});

beforeEach(async () => {
  await User.deleteMany({});

  user1 = await userService.createOne(
    createUserPayload({
      username: "user1",
      password: "1",
      role: "guest" as const,
    }),
  );
  user2 = await userService.createOne(
    createUserPayload({
      username: "user2",
      password: "2",
      role: "guest" as const,
    }),
  );
});

afterAll(async () => {
  await mongoServer.disconnect();
});

describe("POST /auth/login", () => {
  describe("HAPPY PATH: returns a token + user object WITH VALID INPUT PAYLOAD", () => {
    it("logs in a user with valid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        username: "user1",
        password: "1",
      });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toEqual(expect.any(String));
      expect(response.body.user.id).toBe(user1._id.toString());
      expect(response.body.user.username).toBe(user1.username);
      expect(response.body.user.role).toBe(user1.role);
      expect(response.body.user.passwordHash).toBeUndefined();
    });
  });
  describe("USERNAME + PASSWORD FAILURES", () => {
    it.each([
      {
        label: "Invalid username that doesn't exist in the DB",
        credential: {
          username: "InvalidUsername",
          password: "1",
        },
      },
      {
        label: "Valid username But Incorrect password",
        credential: {
          username: "user1",
          password: "2",
        },
      },
    ])("Returns status 401 with: $label", async ({ credential }) => {
      const response = await request(app).post("/auth/login").send(credential);

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        error: "Invalid username or password",
      });
    });
  });
  describe("VALIDATION FAILURES", () => {
    it.each([
      {
        label: "username missing",
        credential: {
          username: undefined,
          password: "1",
        },
      },
      {
        label: "password missing",
        credential: {
          username: "user1",
          password: undefined,
        },
      },
      {
        label: "invalid username type: number",
        credential: {
          username: 1,
          password: "1",
        },
      },
      {
        label: "invalid password type: number",
        credential: {
          username: "user1",
          password: 1,
        },
      },
    ])("Returns status 400 with: $label", async ({ credential }) => {
      const response = await request(app).post("/auth/login").send(credential);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });
});
