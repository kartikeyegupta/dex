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

  if (!email || !password || !userType) {
    throw new Error("Email, password, and user type are required");
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    throw new Error(signUpError.message);
  }

  const userId = signUpData.user?.id;

  if (userId) {
    const { error: insertError } = await supabase.from('user_profiles').insert([
      {
        user_id: userId,
        email: email,
        user_type: userType,
      }
    ]);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  // This will handle the redirect
  return encodedRedirect(
    "success",
    "/signup",
    "Let's get some gigs."
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }

  // Get the latest user information
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return encodedRedirect("error", "/login", "Authentication failed");
  }

  // Fetch the user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
    return encodedRedirect("error", "/login", "Could not fetch user profile");
  }

  // Redirect based on user type
  switch(profile?.user_type) {
    case 'DJ':
      return redirect('/dj/dashboard');
    case 'Venue':
      return redirect('/venue/dashboard');
    default:
      return redirect('/demo');
  }
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
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};