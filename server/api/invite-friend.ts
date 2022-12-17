import {
  serverSupabaseServiceRole,
  serverSupabaseUser,
  serverSupabaseClient,
} from "#supabase/server";
// import { serverSupabaseUser } from "#supabase/server";
// import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  console.log("event", event);
  const client = serverSupabaseServiceRole(event);
  // const client = serverSupabaseServiceRole(event);
  //   return await serverSupabaseUser(event);
  //   console.log(event.req.rawHeaders);
  // const user = await serverSupabaseUser(event);
  // if (!user) {
  //   throw new Error("Not authorized");
  // }

  // console.log("----client:", client);
  return client;
});
