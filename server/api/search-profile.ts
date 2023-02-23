import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
} from "#supabase/server";
import { Database } from "~~/types/supabase";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw new Error("Not authorized");
  }
  const query = getQuery(event);
  const username = query.username;

  if (!username) return;

  const client = serverSupabaseServiceRole<Database>(event);
  const { id: currentUserId } = user;

  // get all current friends independant of status accepted or pending
  const { data: friendsData } = await client
    .from("profiles")
    .select("friends(*)")
    .eq("id", currentUserId)
    .single();

  // store all ids we want to filter out from the search results
  const profileIdsToFilterOut = [currentUserId];
  const friends = friendsData?.friends;

  if (friends && Array.isArray(friends)) {
    friends.forEach((user) => {
      if (user.friend_id) {
        profileIdsToFilterOut.push(user.friend_id);
      }
    });
  }

  // get all profiles that are not the current user and not in the list of friends
  const profiles = await client
    .from("profiles")
    .select("username, id, avatar_url")
    .neq("username", null)
    .not("id", "in", `(${profileIdsToFilterOut.join(",")})`)
    .like("username", `${username as string}%`);

  return profiles;
});
