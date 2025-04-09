import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const tablesResult = await database.query(
    `SELECT COUNT (*) 
    FROM information_schema.tables 
    WHERE table_schema = 'pgmigration'
    AND table_type = 'BASE_TABLE'`,
  );

  expect(tablesResult.rowCount).toBe(responseBody.length);
});
