export const useUserProfile = (
  client: ReturnType<typeof useSupabaseClient>,
  user: ReturnType<typeof useSupabaseUser>
) => {
  const getUserProfile = async () => {
    const { data } = await client
      .from("profiles")
      .select("username, avatar_url, coordinates(*), friends(*)")
      .eq("id", user?.value?.id)
      .single();
    return data;
  };

  const updateUsername = async (username: string) => {
    const { error } = await client
      .from("profiles")
      .update({
        username,
      })
      .eq("id", user?.value?.id);
    return error;
  };

  const upsertCoordinates = async (latitude: number, longitude: number) => {
    const { error } = await client.from("coordinates").upsert({
      id: user?.value?.id,
      latitude,
      longitude,
    });
    return error;
  };

  return {
    getUserProfile,
    updateUsername,
    upsertCoordinates,
  };
};
