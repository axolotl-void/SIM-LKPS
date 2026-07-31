import { vi } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
}));
