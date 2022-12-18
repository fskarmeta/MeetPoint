import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default eventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("Not authorized");
  }
  const { id: currentUserId } = user;
  const profiles = await client
    .from("profiles")
    .select("username, id, avatar_url")
    .neq("username", null)
    .neq("id", currentUserId);

  return profiles;
});
