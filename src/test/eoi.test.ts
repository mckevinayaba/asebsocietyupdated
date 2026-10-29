import { describe, expect, it } from "vitest";
import { fieldError, prepareEnquiry, enquirySources, type Field } from "@/lib/eoi";

const fields: Field[] = [{ name: "email", label: "Email", type: "email", required: true }, { name: "message", label: "Message", required: true }];
const values = { email: " enquiry@example.com ", message: "Supporting African startup ecosystems" };
describe("Partnership intake rules", () => {
  it("requires consent before storing an enquiry", () => {
    expect(() => prepareEnquiry("/funders", fields, values, false)).toThrow();
  });
  it("stores every pathway as pending with its own source", () => {
    for (const source of Object.keys(enquirySources) as (keyof typeof enquirySources)[]) {
      expect(prepareEnquiry(source, fields, values, true)).toMatchObject({ source_page: source, inquiry_type: enquirySources[source], status: "pending", consent: true, contact_email: "enquiry@example.com" });
    }
  });
  it("rejects missing required details", () => {
    expect(() => prepareEnquiry("/funders", fields, { ...values, message: " " }, true)).toThrow();
  });
  it("rejects invalid contact emails", () => {
    expect(fieldError(fields[0] as Field, "not-an-email")).toBeDefined();
  });
  it("rejects non-web addresses even for optional fields", () => {
    expect(fieldError({ name: "website", label: "Website", type: "url" }, "javascript:alert(1)")).toBeDefined();
  });
  it("limits declared summaries to 300 words", () => {
    const field: Field = { name: "summary", label: "Summary (up to 300 words)" };
    expect(fieldError(field, Array(300).fill("founder").join(" "))).toBeUndefined();
    expect(fieldError(field, Array(301).fill("founder").join(" "))).toBeDefined();
  });
  it("rejects a choice outside the configured options", () => {
    expect(fieldError({ name: "requestType", label: "Request", type: "choice", options: ["Direct commission"] }, "Approve me")).toBeDefined();
  });
  it("limits editorial pitches to 200 words", () => {
    const field: Field = { name: "summary", label: "What will a practitioner learn? (up to 200 words)" };
    expect(fieldError(field, Array(200).fill("practice").join(" "))).toBeUndefined();
    expect(fieldError(field, Array(201).fill("practice").join(" "))).toBeDefined();
  });
});