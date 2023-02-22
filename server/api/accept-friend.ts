import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { Database } from "~~/types/supabase";

export default eventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("Not authorized");
  }
  const client = serverSupabaseServiceRole<Database>(event);

  if (event.node.req.method === "POST") {
    const body = await readBody(event);
    const { friendId } = body;
    const { id: currentUserId } = user;
    // accept friendship
    const { error: userUpdateError } = await client
      .from("friends")
      .update({ status: "accepted" })
      .eq("user_id", currentUserId)
      .eq("friend_id", friendId);
    const { error: friendUpdateError } = await client
      .from("friends")
      .update({ status: "accepted" })
      .eq("user_id", friendId)
      .eq("friend_id", currentUserId);
    if (!userUpdateError && !friendUpdateError) {
      return { msg: "Friendship accepted" };
    }

    return { error: { ...userUpdateError, ...friendUpdateError } };
  }
});
