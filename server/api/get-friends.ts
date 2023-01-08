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
    const getFriendIdsByInvitationType = (
      type: "accepted" | "pending" | "send"
    ) =>
      friendsInvitations.friends
        .filter((friend) => friend.status === type)
        .map((friend) => friend.friend_id);

    const acceptedFriends = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", getFriendIdsByInvitationType("accepted"));

    const invitatedFriends = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", getFriendIdsByInvitationType("send"));

    const pendingInvitations = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", getFriendIdsByInvitationType("pending"));

    return {
      friends: acceptedFriends.data || [],
      invited: invitatedFriends.data || [],
      pending: pendingInvitations.data || [],
    };
  }
  return { friends: [], invited: [], pending: [] };
});
