import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default eventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("Not authorized");
  }
  const client = serverSupabaseServiceRole(event);

  if (event.node.req.method === "DELETE") {
    const body = await readBody(event);
    const { friendId } = body;
    const { id: currentUserId } = user;
    // delete friendship
    const { error: userUpdateError } = await client
      .from("friends")
      .delete()
      .eq("user_id", currentUserId)
      .eq("friend_id", friendId);
    const { error: friendUpdateError } = await client
      .from("friends")
      .delete()
      .eq("user_id", friendId)
      .eq("friend_id", currentUserId);

    if (!userUpdateError && !friendUpdateError) {
      return { msg: "Friendship deleted" };
    }

    return { error: { ...userUpdateError, ...friendUpdateError } };
  }
});
