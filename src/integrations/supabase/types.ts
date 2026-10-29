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
          role?: string
          status?: string
          work_description?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          bio: string
          country: string
          created_at: string
          id: string
          name: string
          organisation: string
          primary_role: string
        }
        Insert: {
          bio?: string
          country?: string
          created_at?: string
          id: string
          name?: string
          organisation?: string
          primary_role?: string
        }
        Update: {
          bio?: string
          country?: string
          created_at?: string
          id?: string
          name?: string
          organisation?: string
          primary_role?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
