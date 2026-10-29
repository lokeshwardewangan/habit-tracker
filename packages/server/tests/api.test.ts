import {
   describe,
   it,
   expect,
   beforeAll,
   afterAll,
   beforeEach,
} from "bun:test";
import request from "supertest";
import { app } from "../src/app";
import { setupTestDB, teardownTestDB, clearTestDB } from "./setup";

describe("Habit Tracker API Integration Tests", () => {
   let userAToken: string;
   let userAId: string;
   let userBToken: string;

   beforeAll(async () => {
      await setupTestDB();
   });

   afterAll(async () => {
      await teardownTestDB();
   });

   beforeEach(async () => {
      await clearTestDB();

      // Seed User A
      const resA = await request(app).post("/api/auth/signup").send({
         firstName: "Asha",
         lastName: "Sharma",
         email: "asha@example.com",
         password: "Password123!",
      });
      userAToken = resA.body.data.token;
      userAId = resA.body.data.user.id;

      // Seed User B
      const resB = await request(app).post("/api/auth/signup").send({
         firstName: "Bob",
         lastName: "Smith",
         email: "bob@example.com",
         password: "Password123!",
      });
      userBToken = resB.body.data.token;
   });

   describe("1. Health Check", () => {
      it("GET /api/health should return ok status", async () => {
         const res = await request(app).get("/api/health");
         expect(res.status).toBe(200);
         expect(res.body.status).toBe("ok");
      });
   });

   describe("2. Authentication & Security", () => {
      it("POST /api/auth/signup should reject duplicate email with 409", async () => {
         const res = await request(app).post("/api/auth/signup").send({
            firstName: "Duplicate",
            lastName: "User",
            email: "asha@example.com",
            password: "Password123!",
         });
         expect(res.status).toBe(409);
         expect(res.body.error.code).toBe("CONFLICT");
      });

      it("POST /api/auth/login should authenticate with valid credentials", async () => {
         const res = await request(app).post("/api/auth/login").send({
            email: "asha@example.com",
            password: "Password123!",
         });
         expect(res.status).toBe(200);
         expect(res.body.data.token).toBeDefined();
         expect(res.body.data.user.email).toBe("asha@example.com");
      });

      it("POST /api/auth/login should reject invalid credentials with 401", async () => {
         const res = await request(app).post("/api/auth/login").send({
            email: "asha@example.com",
            password: "WrongPassword!",
         });
         expect(res.status).toBe(401);
         expect(res.body.error.code).toBe("UNAUTHORIZED");
      });

      it("GET /api/auth/me should return current user when authenticated", async () => {
         const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${userAToken}`);
         expect(res.status).toBe(200);
         expect(res.body.data.user.id).toBe(userAId);
         expect(res.body.data.user.email).toBe("asha@example.com");
      });

      it("GET /api/auth/me should reject unauthenticated requests with 401", async () => {
         const res = await request(app).get("/api/auth/me");
         expect(res.status).toBe(401);
         expect(res.body.error.code).toBe("UNAUTHORIZED");
      });
   });

   describe("3. Habit Lifecycle Management", () => {
      it("POST /api/habits should create a habit with valid required fields", async () => {
         const res = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Morning Meditation",
               description: "Meditate for 15 minutes",
               startDate: "2026-10-01",
               frequency: "DAILY",
            });

         expect(res.status).toBe(201);
         expect(res.body.data.name).toBe("Morning Meditation");
         expect(res.body.data.status).toBe("ACTIVE");
         expect(res.body.data.id).toBeDefined();
      });

      it("POST /api/habits should validate inputs and return useful 400 error", async () => {
         const res = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "",
               startDate: "invalid-date",
            });

         expect(res.status).toBe(400);
         expect(res.body.error.code).toBe("VALIDATION_ERROR");
         expect(res.body.error.details.name).toBeDefined();
         expect(res.body.error.details.startDate).toBeDefined();
      });

      it("POST /api/habits/:id/archive should exclude habit from active list", async () => {
         // Create habit
         const createRes = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Daily Jog",
               startDate: "2026-10-01",
            });
         const habitId = createRes.body.data.id;

         // Archive it
         const archiveRes = await request(app)
            .post(`/api/habits/${habitId}/archive`)
            .set("Authorization", `Bearer ${userAToken}`);
         expect(archiveRes.status).toBe(200);
         expect(archiveRes.body.data.status).toBe("ARCHIVED");

         // Verify it does not appear in active list
         const activeListRes = await request(app)
            .get("/api/habits?status=active")
            .set("Authorization", `Bearer ${userAToken}`);
         const foundInActive = activeListRes.body.data.some(
            (h: { id: string }) => h.id === habitId,
         );
         expect(foundInActive).toBe(false);

         // Verify it appears in archived list
         const archivedListRes = await request(app)
            .get("/api/habits?status=archived")
            .set("Authorization", `Bearer ${userAToken}`);
         const foundInArchived = archivedListRes.body.data.some(
            (h: { id: string }) => h.id === habitId,
         );
         expect(foundInArchived).toBe(true);
      });
   });

   describe("4. Tenant Isolation / Ownership Enforcement", () => {
      it("User B should not be able to view, edit, or archive User A's habit", async () => {
         // User A creates a habit
         const habitRes = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Asha's Secret Habit",
               startDate: "2026-10-01",
            });
         const habitId = habitRes.body.data.id;

         // User B attempts to GET
         const getRes = await request(app)
            .get(`/api/habits/${habitId}`)
            .set("Authorization", `Bearer ${userBToken}`);
         expect(getRes.status).toBe(404);

         // User B attempts to PATCH
         const patchRes = await request(app)
            .patch(`/api/habits/${habitId}`)
            .set("Authorization", `Bearer ${userBToken}`)
            .send({ name: "Hacked Habit" });
         expect(patchRes.status).toBe(404);

         // User B attempts to ARCHIVE
         const archiveRes = await request(app)
            .post(`/api/habits/${habitId}/archive`)
            .set("Authorization", `Bearer ${userBToken}`);
         expect(archiveRes.status).toBe(404);

         // User B attempts to DELETE
         const deleteRes = await request(app)
            .delete(`/api/habits/${habitId}`)
            .set("Authorization", `Bearer ${userBToken}`);
         expect(deleteRes.status).toBe(404);
      });
   });

   describe("5. Completion Tracking & Duplicate Prevention", () => {
      it("PUT /api/habits/:id/completions/:date should mark complete idempotently without duplicates", async () => {
         const habitRes = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Hydration",
               startDate: "2026-10-01",
            });
         const habitId = habitRes.body.data.id;

         // Mark complete once
         const firstPut = await request(app)
            .put(`/api/habits/${habitId}/completions/2026-10-25`)
            .set("Authorization", `Bearer ${userAToken}`);
         expect(firstPut.status).toBe(200);

         // Mark complete a second time for same date (idempotent test)
         const secondPut = await request(app)
            .put(`/api/habits/${habitId}/completions/2026-10-25`)
            .set("Authorization", `Bearer ${userAToken}`);
         expect(secondPut.status).toBe(200);

         // Verify history has exactly 1 record for this date
         const historyRes = await request(app)
            .get(
               `/api/habits/${habitId}/completions?from=2026-10-25&to=2026-10-25`,
            )
            .set("Authorization", `Bearer ${userAToken}`);
         expect(historyRes.body.data.length).toBe(1);
      });

      it("Editing habit details should not erase historical completions", async () => {
         const habitRes = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Read Books",
               startDate: "2026-10-01",
            });
         const habitId = habitRes.body.data.id;

         // Add completion
         await request(app)
            .put(`/api/habits/${habitId}/completions/2026-10-20`)
            .set("Authorization", `Bearer ${userAToken}`);

         // Edit habit name and description
         await request(app)
            .patch(`/api/habits/${habitId}`)
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Read 30 mins Books",
               description: "Updated description",
            });

         // Verify history still exists intact
         const historyRes = await request(app)
            .get(`/api/habits/${habitId}/completions`)
            .set("Authorization", `Bearer ${userAToken}`);
         expect(historyRes.body.data.length).toBe(1);
         expect(historyRes.body.data[0].date).toBe("2026-10-20");
      });

      it("DELETE /api/habits/:id/completions/:date should undo completion", async () => {
         const habitRes = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({
               name: "Yoga",
               startDate: "2026-10-01",
            });
         const habitId = habitRes.body.data.id;

         // Mark complete
         await request(app)
            .put(`/api/habits/${habitId}/completions/2026-10-22`)
            .set("Authorization", `Bearer ${userAToken}`);

         // Undo completion
         const undoRes = await request(app)
            .delete(`/api/habits/${habitId}/completions/2026-10-22`)
            .set("Authorization", `Bearer ${userAToken}`);
         expect(undoRes.status).toBe(200);

         // History should now be empty
         const historyRes = await request(app)
            .get(`/api/habits/${habitId}/completions`)
            .set("Authorization", `Bearer ${userAToken}`);
         expect(historyRes.body.data.length).toBe(0);
      });
   });

   describe("6. Dynamic Dashboard Statistics Calculation", () => {
      it("GET /api/dashboard/stats should compute statistics dynamically from completions", async () => {
         // Create 2 active habits
         const h1 = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({ name: "Habit 1", startDate: "2026-10-20" });
         const h2 = await request(app)
            .post("/api/habits")
            .set("Authorization", `Bearer ${userAToken}`)
            .send({ name: "Habit 2", startDate: "2026-10-20" });

         // Add completions
         await request(app)
            .put(`/api/habits/${h1.body.data.id}/completions/2026-10-25`)
            .set("Authorization", `Bearer ${userAToken}`);
         await request(app)
            .put(`/api/habits/${h2.body.data.id}/completions/2026-10-25`)
            .set("Authorization", `Bearer ${userAToken}`);

         const statsRes = await request(app)
            .get("/api/dashboard/stats?from=2026-10-20&to=2026-10-29")
            .set("Authorization", `Bearer ${userAToken}`);

         expect(statsRes.status).toBe(200);
         expect(statsRes.body.data.activeHabits).toBe(2);
         expect(statsRes.body.data.totalCompletionsInPeriod).toBe(2);
         expect(statsRes.body.data.totalExpectedInPeriod).toBeGreaterThan(0);
         expect(statsRes.body.data.completionRate).toBeGreaterThan(0);
         expect(statsRes.body.data.rateFormula).toBeDefined();
      });
   });
});
