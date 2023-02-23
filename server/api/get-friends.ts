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
  const { id: currentUserId } = user;

  // get all current friends independant of status accepted or pending
  const { data: friendsInvitations } = await client
    .from("profiles")
    .select("friends(*)")
    .eq("id", currentUserId)
    .single();

  const friends = friendsInvitations?.friends;

  if (friends && Array.isArray(friends)) {
    const getFriendIdsByInvitationType = (
      type: "accepted" | "pending" | "send"
    ) =>
      friends
        .filter((friend) => friend.status === type)
        .map((friend) => friend.friend_id);

    // add the coordinates to the accepted friends
    const acceptedFriends = await client
      .from("profiles")
      .select("id, username, avatar_url, coordinates(*)")
      .in("id", getFriendIdsByInvitationType("accepted"));

    const invitatedFriends = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", getFriendIdsByInvitationType("send"));

    const pendingInvitations = await client
      .from("profiles")
      .select("id, username, avatar_url")
      .in("id", getFriendIdsByInvitationType("pending"));

    const parsedFriends = acceptedFriends.data?.map((f) => ({
      ...f,
      coordinates: Array.isArray(f.coordinates)
        ? f.coordinates[0]
        : f.coordinates,
    }));

    const body = {
      friends: parsedFriends || [],
      invited: invitatedFriends.data || [],
      pending: pendingInvitations.data || [],
    };
    return body;
  }
  return { friends: [], invited: [], pending: [] };
});
