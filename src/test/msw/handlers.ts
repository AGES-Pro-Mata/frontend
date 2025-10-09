import { HttpResponse, http } from "msw";

const mockExperiences = [
  {
    id: "exp-1",
    name: "Trilha interpretativa",
    capacity: 12,
    difficulty: "easy",
  },
  {
    id: "exp-2",
    name: "Observação de fauna",
    capacity: 6,
    difficulty: "medium",
  },
];

const mockUser = {
  id: "admin-1",
  name: "Admin Pró-Mata",
  email: "admin@promata.com.br",
  role: "admin",
};

export const handlers = [
  http.get("*/health", () =>
    HttpResponse.json({ status: "ok", uptime: 1000 })
  ),
  http.get("*/experiences", () =>
    HttpResponse.json({ data: mockExperiences })
  ),
  http.post("*/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === "admin@promata.com.br" && body.password === "password") {
      return HttpResponse.json({ user: mockUser, token: "mock-token" });
    }

    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }),
];
