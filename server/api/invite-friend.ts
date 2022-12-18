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
    const { data: friendShip } = await client
      .from("friends")
      .select()
      .eq("user_id", currentUserId)
      .eq("friend_id", friendId)
      .single();

    if (friendShip) {
      console.log(friendShip);
      return { msg: "Friendship already exists" };
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
      return { ...userUpdateError, ...friendUpdateError };
    }

    return { msg: "Friendship created" };
  }
});
