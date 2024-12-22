"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const userType = formData.get("user_type")?.toString();

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email, password and user type are required" };
  }
  
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
    emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  const userId = signUpData.user?.id;

  if (userId) {
    const { error: insertError } = await supabase.from('user_profiles').insert([
      {
        user_id: userId, // Assuming 'user_id' is the foreign key in user_profiles
        email: email,
        user_type: userType,
      }
    ]);
    
    if (insertError) {
      return { error: insertError.message };
    }
  
  }

  return encodedRedirect(
    "success",
    "/signup",
    "Lets get some gigs."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data: session, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return encodedRedirect("error", "/login", signInError.message);
  }
  // const userId = session.user?.id;
  // if (!userId) {
  //   return encodedRedirect("error", "/login", "User ID not found in session.");
  // }

  // const { data: userProfile, error: profileError } = await supabase
  //   .from("user_profiles")
  //   .select("user_type")
  //   .eq("user_id", userId)
  //   .single();

  // if (profileError || !userProfile?.user_type) {
  //   return encodedRedirect(
  //     "error",
  //     "/login",
  //     profileError?.message || "Failed to fetch user profile."
  //   );
  // }

  // Redirect based on the user_type
  // if (userProfile.user_type === "pledge") {
  //   return redirect("/protected/pledges");
  // } else if (userProfile.user_type === "member") {
  //   return redirect("/protected/members");
  // } else {
  //   return encodedRedirect("error", "/login", "Unexpected user type.");
  // }
  return redirect("/demo");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};