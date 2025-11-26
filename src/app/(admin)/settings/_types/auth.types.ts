import { components } from "@/lib/api/types/api";

export type User = components["schemas"]["User"];

export type SessionResponse = {
  session: components["schemas"]["Session"];
  user: components["schemas"]["User"];
};
