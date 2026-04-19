/**
 * envValidator tests — verifies service health detection logic.
 */
import { validateEnv, SERVICE_STATUS } from "../src/utils/envValidator";

describe("validateEnv()", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("returns demo for all services when no env keys are set", () => {
    // In test env, import.meta is stubbed to empty, so all services = demo
    const result = validateEnv();
    expect(result.firebase).toBe(SERVICE_STATUS.DEMO);
    expect(result.maps).toBe(SERVICE_STATUS.DEMO);
    expect(result.pay).toBe(SERVICE_STATUS.DEMO);
    expect(result.analytics).toBe(SERVICE_STATUS.DEMO);
  });

  test("allLive is false when any service is in demo mode", () => {
    const result = validateEnv();
    expect(result.allLive).toBe(false);
  });

  test("SERVICE_STATUS constants are defined", () => {
    expect(SERVICE_STATUS.LIVE).toBe("live");
    expect(SERVICE_STATUS.DEMO).toBe("demo");
  });
});
