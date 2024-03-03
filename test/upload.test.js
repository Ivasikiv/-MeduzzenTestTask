const request = require("supertest");
const app = require("../app");
const path = require("path");
const filePath = path.resolve(__dirname, "Test_task.xlsx");

describe("POST /upload", () => {
  it("should return 200 if file upload is successful", async () => {
    const invoicingMonth = "Sep 2023";

    const res = await request(app)
      .post("/upload")
      .field("invoicingMonth", invoicingMonth)
      .attach("file", filePath);

    expect(res.statusCode).toEqual(200);
  });
});
