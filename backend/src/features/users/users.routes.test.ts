import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

import app from "../../app.js";
import { JWT_SECRET } from "../../shared/config/env.js";
import mongoServer from "../../shared/testing/mongoMemoryServer.setup.js";
import { createUserPayload } from "../../shared/testing/createPayload.js";
import createToken from "../../shared/utils/createUserAndToken.js";
import User from "./users.model.js";

let adminToken: string;
let guestToken: string;

const authHeader = (token: string) => `Bearer ${token}`;

const invalidTokenCases = [
  {
    label: "no token",
    token: undefined,
  },
  {
    label: "malformatted token",
    token: "malformatted",
  },
  {
    label: "token signed with another secret",
    token: jwt.sign({ id: "invalid", role: "admin" }, "FAKE_JWT_SECRET"),
  },
  {
    label: "token with an invalid payload",
    token: jwt.sign({ id: "invalid" }, JWT_SECRET),
  },
];

beforeAll(async () => {
  await mongoServer.connect();
  adminToken = await createToken("admin");
  guestToken = await createToken("guest");
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoServer.disconnect();
});

describe("POST /users", () => {
  describe("happy path", () => {
    it("persists and returns a user DTO for an admin", async () => {
      const payload = createUserPayload({
        username: "user1",
        password: "1",
        role: "admin",
      });

      const response = await request(app)
        .post("/users")
        .set("Authorization", authHeader(adminToken))
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        username: payload.username,
        role: payload.role,
      });
      expect(response.body).not.toHaveProperty("passwordHash");
      expect(response.body).not.toHaveProperty("password");
      await expect(
        User.countDocuments({ username: payload.username }),
      ).resolves.toBe(1);
    });
  });

  describe("validation failures", () => {
    it.each([
      ["whole payload missing", {}],
      ["username missing", { password: "1", role: "guest" }],
      ["password missing", { username: "user1", role: "guest" }],
      ["role missing", { username: "user1", password: "1" }],
      ["invalid role", { username: "user1", password: "1", role: "invalid" }],
      ["invalid username type", { username: 1, password: "1", role: "guest" }],
      [
        "invalid password type",
        { username: "user1", password: 1, role: "guest" },
      ],
    ])("returns 400 for %s", async (_label, payload) => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", authHeader(adminToken))
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      await expect(User.countDocuments()).resolves.toBe(0);
    });
  });

  describe("auth/role failures", () => {
    it.each(invalidTokenCases)("returns 401 for $label", async ({ token }) => {
      const requestBuilder = request(app)
        .post("/users")
        .send(createUserPayload());

      if (token) requestBuilder.set("Authorization", authHeader(token));

      const response = await requestBuilder;

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("returns 403 for a guest token", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", authHeader(guestToken))
        .send(createUserPayload());

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("GET /users/:id", () => {
  describe("happy path", () => {
    it("returns the requested user DTO", async () => {
      const user = await User.create({
        username: "user1",
        passwordHash: "hashed-password",
        role: "guest",
      });

      const response = await request(app)
        .get(`/users/${user._id}`)
        .set("Authorization", authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      });
    });
  });

  describe("validation failures", () => {
    it("returns 400 for an invalid user id", async () => {
      const response = await request(app)
        .get("/users/not-an-object-id")
        .set("Authorization", authHeader(adminToken));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("auth/role failures", () => {
    it.each(invalidTokenCases)("returns 401 for $label", async ({ token }) => {
      const requestBuilder = request(app).get(
        `/users/${"000000000000000000000000"}`,
      );

      if (token) requestBuilder.set("Authorization", authHeader(token));

      const response = await requestBuilder;

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });

    it("returns 403 for a guest token", async () => {
      const response = await request(app)
        .get("/users/000000000000000000000000")
        .set("Authorization", authHeader(guestToken));

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("PATCH /users/:id", () => {
  describe("happy path", () => {
    it("updates and returns the user DTO", async () => {
      const user = await User.create({
        username: "user1",
        passwordHash: "hashed-password",
        role: "guest",
      });

      const response = await request(app)
        .patch(`/users/${user._id}`)
        .set("Authorization", authHeader(adminToken))
        .send({ username: "updated-user" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: user._id.toString(),
        username: "updated-user",
        role: "guest",
      });
    });
  });

  describe("validation failures", () => {
    it.each([
      [
        "invalid user id",
        "/users/not-an-object-id",
        { username: "updated-user" },
      ],
      ["invalid username type", null, { username: 1 }],
      ["invalid password type", null, { password: 1 }],
      ["invalid role", null, { role: "invalid" }],
    ])("returns 400 for %s", async (_label, id, payload) => {
      const user =
        id === null
          ? await User.create({
              username: "user1",
              passwordHash: "hashed-password",
              role: "guest",
            })
          : undefined;
      const response = await request(app)
        .patch(id ?? `/users/${user?._id}`)
        .set("Authorization", authHeader(adminToken))
        .send(payload);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("auth/role failures", () => {
    it("returns 403 for a guest token", async () => {
      const response = await request(app)
        .patch("/users/000000000000000000000000")
        .set("Authorization", authHeader(guestToken))
        .send({ username: "updated-user" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });

    it("returns 401 without a token", async () => {
      const response = await request(app)
        .patch("/users/000000000000000000000000")
        .send({ username: "updated-user" });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("DELETE /users/:id", () => {
  describe("happy path", () => {
    it("deletes and returns the deleted user DTO", async () => {
      const user = await User.create({
        username: "user1",
        passwordHash: "hashed-password",
        role: "guest",
      });

      const response = await request(app)
        .delete(`/users/${user._id}`)
        .set("Authorization", authHeader(adminToken));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      });
      await expect(User.findById(user._id)).resolves.toBeNull();
    });
  });

  describe("validation failures", () => {
    it("returns 400 for an invalid user id", async () => {
      const response = await request(app)
        .delete("/users/not-an-object-id")
        .set("Authorization", authHeader(adminToken));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("auth/role failures", () => {
    it("returns 403 for a guest token", async () => {
      const response = await request(app)
        .delete("/users/000000000000000000000000")
        .set("Authorization", authHeader(guestToken));

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("error");
    });

    it("returns 401 without a token", async () => {
      const response = await request(app).delete(
        "/users/000000000000000000000000",
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });
});
