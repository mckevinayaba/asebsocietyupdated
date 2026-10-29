import { describe, expect, it } from "vitest";
import { applicationSchema, registrySubmissionSchema } from "@/lib/intake";

const application = { name: "Test Practitioner", email: "practitioner@example.com", role: "ecosystem-builder", type: "individual", country: "South Africa", organisation: "", linkedin: "", code: true };
describe("Private intake validation", () => {
  it("accepts a completed membership application", () => {
    expect(applicationSchema.safeParse(application).success).toBe(true);
  });
  it("requires the Code of Practice commitment", () => {
    expect(applicationSchema.safeParse({ ...application, code: false }).success).toBe(false);
  });
  it("rejects an invalid role", () => {
    expect(applicationSchema.safeParse({ ...application, role: "invented-role" }).success).toBe(false);
  });
  it("rejects non-web source addresses", () => {
    expect(registrySubmissionSchema.safeParse({ name: "Test Institution", record_type: "organisation", country: "South Africa", role: "ecosystem-builder", bio: "Work supporting founders and their surrounding ecosystems.", source_url: "javascript:alert(1)", contact_name: "Test Practitioner", contact_email: "practitioner@example.com" }).success).toBe(false);
  });
});