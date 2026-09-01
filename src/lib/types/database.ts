// Tipos manuais espelhando supabase/migrations/0001_init.sql.
// Assim que o projeto Supabase estiver conectado, substitua este arquivo por:
//   npx supabase gen types typescript --project-id <id> > src/lib/types/database.ts

export type SubscriptionPlan = "free" | "mensal" | "anual" | "vitalicio";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "incomplete";
export type PrayerRequestStatus = "ativo" | "respondido";
export type Theme =
  | "feminino"
  | "masculino"
  | "premium_1"
  | "premium_2"
  | "premium_3"
  | "premium_4";
export type Genero = "feminino" | "masculino" | "prefiro_nao_dizer";
export type Religiao =
  | "catolico"
  | "evangelico"
  | "espirita"
  | "outra_crista"
  | "outra_religiao"
  | "sem_religiao"
  | "prefiro_nao_dizer";
export type Objetivo =
  | "habito_diario"
  | "crescer_na_fe"
  | "estudar_biblia"
  | "momento_dificil";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          theme: Theme;
          idade: number | null;
          genero: Genero | null;
          religiao: Religiao | null;
          objetivo: Objetivo | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      devotionals: {
        Row: {
          id: string;
          devotional_date: string;
          title: string;
          verse_reference: string;
          verse_text: string;
          reading: string;
          reflection_prompt: string | null;
          application_prompt: string | null;
          prayer_prompt: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["devotionals"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["devotionals"]["Row"]>;
        Relationships: [];
      };
      weekly_verses: {
        Row: {
          id: string;
          week_start: string;
          verse_reference: string;
          verse_text: string;
          reflection: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["weekly_verses"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["weekly_verses"]["Row"]>;
        Relationships: [];
      };
      user_devotional_entries: {
        Row: {
          id: string;
          user_id: string;
          devotional_id: string;
          entry_date: string;
          reflection_question_ids: string[];
          application_question_ids: string[];
          prayer_question_ids: string[];
          gratitude: string | null;
          notes: string | null;
          sticker_key: string | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["user_devotional_entries"]["Row"]
        > & {
          user_id: string;
          devotional_id: string;
          entry_date: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_devotional_entries"]["Row"]
        >;
        Relationships: [];
      };
      devotional_questions: {
        Row: {
          id: string;
          category: "reflexao" | "aplicacao" | "oracao";
          question: string;
          active: boolean;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["devotional_questions"]["Row"]
        >;
        Update: Partial<
          Database["public"]["Tables"]["devotional_questions"]["Row"]
        >;
        Relationships: [];
      };
      user_devotional_answers: {
        Row: {
          id: string;
          entry_id: string;
          question_id: string;
          answer: string | null;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["user_devotional_answers"]["Row"]
        > & {
          entry_id: string;
          question_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_devotional_answers"]["Row"]
        >;
        Relationships: [];
      };
      reading_plans: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          total_days: number;
          is_premium: boolean;
          cover_image_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reading_plans"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["reading_plans"]["Row"]>;
        Relationships: [];
      };
      reading_plan_days: {
        Row: {
          id: string;
          plan_id: string;
          day_number: number;
          title: string;
          passage_reference: string;
          content: string | null;
        };
        Insert: Partial<
          Database["public"]["Tables"]["reading_plan_days"]["Row"]
        >;
        Update: Partial<
          Database["public"]["Tables"]["reading_plan_days"]["Row"]
        >;
        Relationships: [];
      };
      user_plan_progress: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          current_day: number;
          completed_days: number[];
          started_at: string;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["user_plan_progress"]["Row"]
        > & {
          user_id: string;
          plan_id: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["user_plan_progress"]["Row"]
        >;
        Relationships: [];
      };
      streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_completed_date: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["streaks"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["streaks"]["Row"]>;
        Relationships: [];
      };
      prayer_requests: {
        Row: {
          id: string;
          user_id: string;
          person_name: string;
          description: string | null;
          status: PrayerRequestStatus;
          answered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["prayer_requests"]["Row"]
        > & {
          user_id: string;
          person_name: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["prayer_requests"]["Row"]
        >;
        Relationships: [];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          verse_reference: string;
          verse_text: string | null;
          note: string | null;
          source: "devocional" | "plano" | "manual" | "biblia" | null;
          source_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["favorites"]["Row"]> & {
          user_id: string;
          verse_reference: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          content: string;
          devotional_id: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notes"]["Row"]> & {
          user_id: string;
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Row"]>;
        Relationships: [];
      };
      user_commitments: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          weekdays: number[];
          time_of_day: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["user_commitments"]["Row"]> & {
          user_id: string;
          title: string;
          weekdays: number[];
        };
        Update: Partial<Database["public"]["Tables"]["user_commitments"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          user_id: string;
          plan: SubscriptionPlan;
          status: SubscriptionStatus;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      bible_books: {
        Row: {
          id: number;
          abbrev: string;
          name: string;
          testament: "AT" | "NT";
          chapter_count: number;
        };
        Insert: Partial<Database["public"]["Tables"]["bible_books"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["bible_books"]["Row"]>;
        Relationships: [];
      };
      bible_verses: {
        Row: {
          id: number;
          book_id: number;
          chapter: number;
          verse: number;
          text: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bible_verses"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["bible_verses"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
