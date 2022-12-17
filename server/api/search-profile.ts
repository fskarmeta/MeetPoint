import { serverSupabaseServiceRole } from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);

  const profiles = await client
    .from("profiles")
    .select("username, id, avatar_url")
    .neq("username", null);

  return profiles;
});
