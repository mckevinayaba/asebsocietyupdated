import { describe, expect, it } from "vitest";
import { applicationSchema, registrySubmissionSchema } from "@/lib/intake";

const application = { name: "Test Practitioner", email: "practitioner@example.com", role: "ecosystem-builder", type: "individual", country: "South Africa", organisation: "", linkedin: "", jobTitle: "Programme Director", phone: "+27 73 136 6639", city: "Johannesburg", operatingCountries: "South Africa, Kenya", workDescription: "We run an incubator supporting early-stage founders across Southern and East Africa with mentorship and capital readiness.", focusAreas: "", code: true };
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
describe("Join full details", () => {
  it("rejects a work description under 80 characters", () => {
    expect(applicationSchema.safeParse({ ...application, workDescription: "Short." }).success).toBe(false);
  });
  it("requires where the applicant operates", () => {
    expect(applicationSchema.safeParse({ ...application, operatingCountries: "" }).success).toBe(false);
  });
});
