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
  const { id: currentUserId } = user;

  // get all current friends independant of status accepted or pending
  const { data: friendsInvitations } = await client
    .from("profiles")
    .select("friends(*)")
    .eq("id", currentUserId)
    .single();

  if (friendsInvitations?.friends) {
    const acceptedFriends = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in(
        "id",
        friendsInvitations.friends
          .filter((friend) => friend.status === "accepted")
          .map((friend) => friend.friend_id)
      );

    const pendingFriends = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in(
        "id",
        friendsInvitations.friends
          .filter((friend) => friend.status === "pending")
          .map((friend) => friend.friend_id)
      );

    return {
      friends: acceptedFriends.data || [],
      pending: pendingFriends.data || [],
    };
  }
  return { friends: [], pending: [] };
});
