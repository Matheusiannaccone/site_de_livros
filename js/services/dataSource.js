import { mockAuthAdapter } from "./adapters/mock/authAdapter.js";

export function getDataSource() {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "mock";
  }

  return "supabase";
}

export function getAuthAdapter() {
  const dataSource = getDataSource();

  if (dataSource === "mock") {
    return mockAuthAdapter;
  }

  return new Error("Supabase auth adapter not implemented yet.");
}