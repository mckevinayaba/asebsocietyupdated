export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
        }
        Insert: {
          blocked_id: string
          blocker_id?: string
          created_at?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          content_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          user_id?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_memberships: {
        Row: {
          circle_key: string
          joined_at: string
          user_id: string
        }
        Insert: {
          circle_key: string
          joined_at?: string
          user_id: string
        }
        Update: {
          circle_key?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_items: {
        Row: {
          attribution: string
          author_id: string
          body: string
          chapter_id: string | null
          consent_edit: boolean
          consent_publish: boolean
          country: string
          created_at: string
          details: Json
          evidence_class: string
          featured: boolean
          hidden_by_moderator: boolean
          id: string
          kind: string
          media: Json
          parent_id: string | null
          published_at: string | null
          repost_of: string | null
          scheduled_for: string | null
          slug: string
          status: string
          summary: string
          title: string
          topics: string[]
          updated_at: string
          visibility: string
          voices_category: string | null
        }
        Insert: {
          attribution?: string
          author_id?: string
          body: string
          chapter_id?: string | null
          consent_edit?: boolean
          consent_publish?: boolean
          country?: string
          created_at?: string
          details?: Json
          evidence_class?: string
          featured?: boolean
          hidden_by_moderator?: boolean
          id?: string
          kind: string
          media?: Json
          parent_id?: string | null
          published_at?: string | null
          repost_of?: string | null
          scheduled_for?: string | null
          slug: string
          status?: string
          summary?: string
          title?: string
          topics?: string[]
          updated_at?: string
          visibility?: string
          voices_category?: string | null
        }
        Update: {
          attribution?: string
          author_id?: string
          body?: string
          chapter_id?: string | null
          consent_edit?: boolean
          consent_publish?: boolean
          country?: string
          created_at?: string
          details?: Json
          evidence_class?: string
          featured?: boolean
          hidden_by_moderator?: boolean
          id?: string
          kind?: string
          media?: Json
          parent_id?: string | null
          published_at?: string | null
          repost_of?: string | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          summary?: string
          title?: string
          topics?: string[]
          updated_at?: string
          visibility?: string
          voices_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "playbook_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_repost_of_fkey"
            columns: ["repost_of"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_items_voices_category_fkey"
            columns: ["voices_category"]
            isOneToOne: false
            referencedRelation: "voices_categories"
            referencedColumns: ["key"]
          },
        ]
      }
      content_reports: {
        Row: {
          content_id: string
          created_at: string
          detail: string
          id: string
          reason: string
          reporter_id: string
          resolution_note: string
          status: string
        }
        Insert: {
          content_id: string
          created_at?: string
          detail?: string
          id?: string
          reason: string
          reporter_id?: string
          resolution_note?: string
          status?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          detail?: string
          id?: string
          reason?: string
          reporter_id?: string
          resolution_note?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_revisions: {
        Row: {
          body: string
          content_id: string
          created_at: string
          editor_id: string | null
          id: number
          status: string
          title: string
        }
        Insert: {
          body: string
          content_id: string
          created_at?: string
          editor_id?: string | null
          id?: never
          status: string
          title: string
        }
        Update: {
          body?: string
          content_id?: string
          created_at?: string
          editor_id?: string | null
          id?: never
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_revisions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_reviews: {
        Row: {
          assignee_id: string | null
          content_id: string
          created_at: string
          decision: string
          id: string
          message_to_author: string
          private_note: string
          reviewer_id: string
        }
        Insert: {
          assignee_id?: string | null
          content_id: string
          created_at?: string
          decision: string
          id?: string
          message_to_author?: string
          private_note?: string
          reviewer_id?: string
        }
        Update: {
          assignee_id?: string | null
          content_id?: string
          created_at?: string
          decision?: string
          id?: string
          message_to_author?: string
          private_note?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_reviews_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          target_key: string
          target_type: string
        }
        Insert: {
          created_at?: string
          follower_id?: string
          target_key: string
          target_type: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          target_key?: string
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      insight_pitches: {
        Row: {
          consent: boolean
          contact_email: string
          id: string
          inquiry_type: string
          payload: Json
          source_page: string
          status: string
          submitted_at: string
        }
        Insert: {
          consent?: boolean
          contact_email: string
          id?: string
          inquiry_type?: string
          payload: Json
          source_page?: string
          status?: string
          submitted_at?: string
        }
        Update: {
          consent?: boolean
          contact_email?: string
          id?: string
          inquiry_type?: string
          payload?: Json
          source_page?: string
          status?: string
          submitted_at?: string
        }
        Relationships: []
      }
      membership_applications: {
        Row: {
          city: string
          code_accepted: boolean
          country: string
          created_at: string
          email: string
          focus_areas: string
          id: string
          intent: string
          job_title: string
          membership_type: string
          name: string
          operating_countries: string
          organisation: string
          phone: string
          profile_url: string
          registry_slug: string | null
          review_stage: string
          role: string
          status: string
          work_description: string
        }
        Insert: {
          city?: string
          code_accepted: boolean
          country: string
          created_at?: string
          email: string
          focus_areas?: string
          id?: string
          intent?: string
          job_title?: string
          membership_type: string
          name: string
          operating_countries?: string
          organisation?: string
          phone?: string
          profile_url?: string
          registry_slug?: string | null
          review_stage?: string
          role: string
          status?: string
          work_description?: string
        }
        Update: {
          city?: string
          code_accepted?: boolean
          country?: string
          created_at?: string
          email?: string
          focus_areas?: string
          id?: string
          intent?: string
          job_title?: string
          membership_type?: string
          name?: string
          operating_countries?: string
          organisation?: string
          phone?: string
          profile_url?: string
          registry_slug?: string | null
          review_stage?: string
          role?: string
          status?: string
          work_description?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          actor_id: string | null
          content_id: string | null
          created_at: string
          id: number
          kind: string
          message: string
          read_at: string | null
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          content_id?: string | null
          created_at?: string
          id?: never
          kind: string
          message?: string
          read_at?: string | null
          user_id: string
        }
        Update: {
          actor_id?: string | null
          content_id?: string | null
          created_at?: string
          id?: never
          kind?: string
          message?: string
          read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_enquiries: {
        Row: {
          consent: boolean
          contact_email: string
          id: string
          inquiry_type: string
          payload: Json
          source_page: string
          status: string
          submitted_at: string
        }
        Insert: {
          consent?: boolean
          contact_email: string
          id?: string
          inquiry_type: string
          payload: Json
          source_page: string
          status?: string
          submitted_at?: string
        }
        Update: {
          consent?: boolean
          contact_email?: string
          id?: string
          inquiry_type?: string
          payload?: Json
          source_page?: string
          status?: string
          submitted_at?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      playbook_chapter_versions: {
        Row: {
          body: string
          chapter_id: string
          created_at: string
          editor_id: string
          id: string
          note: string
          published: boolean
          version: number
        }
        Insert: {
          body: string
          chapter_id: string
          created_at?: string
          editor_id?: string
          id?: string
          note?: string
          published?: boolean
          version: number
        }
        Update: {
          body?: string
          chapter_id?: string
          created_at?: string
          editor_id?: string
          id?: string
          note?: string
          published?: boolean
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "playbook_chapter_versions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "playbook_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      playbook_chapters: {
        Row: {
          contribution_call: string
          current_version: number
          id: string
          introduction: string
          position: number
          questions: string[]
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          contribution_call?: string
          current_version?: number
          id?: string
          introduction?: string
          position: number
          questions?: string[]
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          contribution_call?: string
          current_version?: number
          id?: string
          introduction?: string
          position?: number
          questions?: string[]
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string
          countries_of_operation: string[]
          country: string
          created_at: string
          expertise: string[]
          guidelines_accepted_at: string | null
          headline: string
          home_preference: string
          id: string
          links: string[]
          name: string
          onboarded_at: string | null
          organisation: string
          participation_paths: string[]
          primary_role: string
          visibility: string
        }
        Insert: {
          bio?: string
          countries_of_operation?: string[]
          country?: string
          created_at?: string
          expertise?: string[]
          guidelines_accepted_at?: string | null
          headline?: string
          home_preference?: string
          id: string
          links?: string[]
          name?: string
          onboarded_at?: string | null
          organisation?: string
          participation_paths?: string[]
          primary_role?: string
          visibility?: string
        }
        Update: {
          bio?: string
          countries_of_operation?: string[]
          country?: string
          created_at?: string
          expertise?: string[]
          guidelines_accepted_at?: string | null
          headline?: string
          home_preference?: string
          id?: string
          links?: string[]
          name?: string
          onboarded_at?: string | null
          organisation?: string
          participation_paths?: string[]
          primary_role?: string
          visibility?: string
        }
        Relationships: []
      }
      programme_interests: {
        Row: {
          consent: boolean
          contact_email: string
          id: string
          inquiry_type: string
          payload: Json
          source_page: string
          status: string
          submitted_at: string
          user_id: string | null
        }
        Insert: {
          consent?: boolean
          contact_email: string
          id?: string
          inquiry_type: string
          payload: Json
          source_page: string
          status?: string
          submitted_at?: string
          user_id?: string | null
        }
        Update: {
          consent?: boolean
          contact_email?: string
          id?: string
          inquiry_type?: string
          payload?: Json
          source_page?: string
          status?: string
          submitted_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programme_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reactions: {
        Row: {
          content_id: string
          created_at: string
          kind: string
          user_id: string
        }
        Insert: {
          content_id: string
          created_at?: string
          kind: string
          user_id?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          kind?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      registry_submissions: {
        Row: {
          bio: string
          contact_email: string
          contact_name: string
          country: string
          created_at: string
          id: string
          name: string
          record_type: string
          role: string
          source_url: string
          status: string
        }
        Insert: {
          bio: string
          contact_email: string
          contact_name: string
          country: string
          created_at?: string
          id?: string
          name: string
          record_type: string
          role: string
          source_url: string
          status?: string
        }
        Update: {
          bio?: string
          contact_email?: string
          contact_name?: string
          country?: string
          created_at?: string
          id?: string
          name?: string
          record_type?: string
          role?: string
          source_url?: string
          status?: string
        }
        Relationships: []
      }
      secretariat_audit_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          detail: Json
          id: number
          subject_id: string | null
          subject_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string
          created_at?: string
          detail?: Json
          id?: never
          subject_id?: string | null
          subject_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          detail?: Json
          id?: never
          subject_id?: string | null
          subject_type?: string | null
        }
        Relationships: []
      }
      secretariat_notes: {
        Row: {
          author_id: string
          body: string
          created_at: string
          id: string
          subject_id: string
          subject_type: string
        }
        Insert: {
          author_id?: string
          body: string
          created_at?: string
          id?: string
          subject_id: string
          subject_type: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          id?: string
          subject_id?: string
          subject_type?: string
        }
        Relationships: []
      }
      secretariat_roles: {
        Row: {
          granted_at: string
          granted_note: string
          role: Database["public"]["Enums"]["secretariat_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_note?: string
          role: Database["public"]["Enums"]["secretariat_role"]
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_note?: string
          role?: Database["public"]["Enums"]["secretariat_role"]
          user_id?: string
        }
        Relationships: []
      }
      voices_categories: {
        Row: {
          active: boolean
          description: string
          key: string
          name: string
          position: number
        }
        Insert: {
          active?: boolean
          description?: string
          key: string
          name: string
          position?: number
        }
        Update: {
          active?: boolean
          description?: string
          key?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit_content: { Args: never; Returns: boolean }
      can_moderate: { Args: never; Returns: boolean }
      community_mode: { Args: never; Returns: string }
      content_authors: {
        Args: { ids: string[] }
        Returns: {
          content_id: string
          country: string
          display_name: string
          headline: string
          profile_id: string
        }[]
      }
      content_engagement: {
        Args: { ids: string[] }
        Returns: {
          appreciations: number
          content_id: string
          responses: number
          useful: number
        }[]
      }
      content_is_live: {
        Args: { item: Database["public"]["Tables"]["content_items"]["Row"] }
        Returns: boolean
      }
      content_submitters: {
        Args: { ids: string[] }
        Returns: {
          author_id: string
          content_id: string
          email: string
          name: string
        }[]
      }
      follower_count: { Args: { profile_id: string }; Returns: number }
      has_staff_role: { Args: { roles: string[] }; Returns: boolean }
      is_content_author: { Args: { item: string }; Returns: boolean }
      is_live_content: { Args: { item: string }; Returns: boolean }
      is_secretariat: { Args: never; Returns: boolean }
      is_secretariat_admin: { Args: never; Returns: boolean }
      is_verified_application_owner: {
        Args: { application_email: string }
        Returns: boolean
      }
      is_verified_user: { Args: never; Returns: boolean }
      media_is_public: { Args: { object_name: string }; Returns: boolean }
      my_content: {
        Args: never
        Returns: {
          attribution: string
          author_id: string
          body: string
          chapter_id: string | null
          consent_edit: boolean
          consent_publish: boolean
          country: string
          created_at: string
          details: Json
          evidence_class: string
          featured: boolean
          hidden_by_moderator: boolean
          id: string
          kind: string
          media: Json
          parent_id: string | null
          published_at: string | null
          repost_of: string | null
          scheduled_for: string | null
          slug: string
          status: string
          summary: string
          title: string
          topics: string[]
          updated_at: string
          visibility: string
          voices_category: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "content_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      my_editorial_messages: {
        Args: never
        Returns: {
          content_id: string
          created_at: string
          decision: string
          message_to_author: string
        }[]
      }
      profile_content: {
        Args: { max_rows?: number; profile: string }
        Returns: string[]
      }
      public_profiles: {
        Args: { ids?: string[]; max_rows?: number; search?: string }
        Returns: {
          bio: string
          countries_of_operation: string[]
          country: string
          expertise: string[]
          headline: string
          id: string
          links: string[]
          name: string
          organisation: string
          primary_role: string
        }[]
      }
      secretariat_list_accounts: {
        Args: never
        Returns: {
          country: string
          created_at: string
          email: string
          email_confirmed: boolean
          id: string
          last_sign_in_at: string
          name: string
          organisation: string
          primary_role: string
        }[]
      }
    }
    Enums: {
      secretariat_role:
        | "secretariat_admin"
        | "secretariat_reviewer"
        | "editor"
        | "moderator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      secretariat_role: [
        "secretariat_admin",
        "secretariat_reviewer",
        "editor",
        "moderator",
      ],
    },
  },
} as const
