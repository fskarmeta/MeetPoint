export default defineNuxtRouteMiddleware(async (to, _from) => {
  const userProfile = await useUserProfile().getUserProfile();
  console.log(userProfile)
  if (userProfile && !userProfile?.coordinates) {
    return navigateTo("/register");
  }
});
