"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionState {
  error?: string;
  message?: string;
  unconfirmedEmail?: string;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/painel");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error: "Você ainda não confirmou seu e-mail. Verifique sua caixa de entrada (e o spam).",
        unconfirmedEmail: email,
      };
    }
    return { error: "E-mail ou senha inválidos." };
  }

  redirect(redirectTo || "/painel");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Preencha todos os campos." };
  }
  if (password.length < 6) {
    return { error: "A senha precisa ter pelo menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    return { error: "Não foi possível criar a conta. " + error.message };
  }

  // Projetos Supabase novos exigem confirmação de e-mail por padrão — nesse
  // caso não existe sessão ainda, então não dá pra ir direto pro painel.
  if (!data.session) {
    return {
      message: `Enviamos um link de confirmação para ${email}. Clique nele para ativar sua conta e depois faça login.`,
    };
  }

  redirect("/painel");
}

export async function resendConfirmationAction(
  email: string,
): Promise<AuthActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resend({ type: "signup", email });

  if (error) return { error: "Não foi possível reenviar o e-mail. Tente novamente em alguns minutos." };
  return { message: `E-mail de confirmação reenviado para ${email}.` };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
