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
  const { data: friendsData } = await client
    .from("profiles")
    .select("friends(*)")
    .eq("id", currentUserId)
    .single();

  // store all ids we want to filter out from the search results
  const profileIdsToFilterOut = [currentUserId];

  if (friendsData && friendsData.friends) {
    friendsData.friends.forEach((friend) => {
      profileIdsToFilterOut.push(friend.friend_id);
    });
  }

  // get all profiles that are not the current user and not in the list of friends
  const profiles = await client
    .from("profiles")
    .select("username, id, avatar_url")
    .neq("username", null)
    .not("id", "in", `(${profileIdsToFilterOut.join(",")})`);

  return profiles;
});
