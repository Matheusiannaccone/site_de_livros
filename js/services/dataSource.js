export function getDataSource() {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "mock";
  }

  return "supabase";
}

export function getAuthAdapter() {
  if (getDataSource() === "mock") {
    return mockAuthAdapter;
  }

  return supabaseAuthAdapter;
}