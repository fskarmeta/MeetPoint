<script setup lang="ts">
const user = useSupabaseUser();
const client = useSupabaseAuthClient();
const router = useRouter();
// Login method using providers
const login = async (
  provider: "github" | "google" | "gitlab" | "bitbucket"
) => {
  const { error } = await client.auth.signInWithOAuth({ provider });
  if (error) {
    return alert("Something went wrong !");
  }
};

const logout = async () => await client.auth.signOut();

</script>
<template>
  <button v-if="!user" @click="login('google')">Login with Google</button>
  <button v-if="user" @click="logout">Logout</button>
  <pre>
    {{ user }}
</pre
  >
</template>
