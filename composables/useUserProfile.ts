import { Database } from "~~/types/supabase";

export const useUserProfile = () => {
  const getUserProfile = async () => {
    const client = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    const userId = user?.value?.id;
    if (userId) {
      const { data } = await client
        .from("profiles")
        .select("username, id, avatar_url, coordinates(*), friends(*)")
        .eq("id", userId)
        .single();
      return data;
    }
  };

  const updateUsername = async (username: string) => {
    const client = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    const { error } = await client
      .from("profiles")
      .update({
        username,
      })
      .eq("id", user?.value?.id);
    return error;
  };

  const upsertCoordinates = async (latitude: number, longitude: number) => {
    const client = useSupabaseClient<Database>();
    const user = useSupabaseUser();
    const userId = user?.value?.id;
    if (userId) {
      const { error } = await client.from("coordinates").upsert({
        id: userId,
        latitude,
        longitude,
      });
      return error;
    }
  };

  return {
    getUserProfile,
    updateUsername,
    upsertCoordinates,
  };
};
