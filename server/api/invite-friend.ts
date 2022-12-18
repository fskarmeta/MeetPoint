import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event);
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("Not authorized");
  }

  if (event.node.req.method === "POST") {
    const body = await readBody(event);
    const { friendId } = body;
    const { id: currentUserId } = user;

    // check if friendship request was already made
    const { data: friendShip } = await client
      .from("friends")
      .select()
      .eq("user_id", currentUserId)
      .eq("friend_id", friendId)
      .single();

    if (friendShip) {
      return { msg: "Friendship request was already made" };
    }

    const { error: userUpdateError } = await client.from("friends").insert({
      user_id: currentUserId,
      friend_id: friendId,
      status: "pending",
    });
    const { error: friendUpdateError } = await client.from("friends").insert({
      user_id: friendId,
      friend_id: currentUserId,
      status: "pending",
    });

    if (userUpdateError || friendUpdateError) {
      return {
        msg: "Something went wrong",
        error: { ...userUpdateError, ...friendUpdateError },
      };
    }

    return { msg: "Invitation send" };
  }
});
