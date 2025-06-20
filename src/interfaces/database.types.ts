export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      albums: {
        Row: {
          artist: string | null
          created_at: string | null
          id: number
          image: string | null
          label: string | null
          name: string
          rating: number | null
          release_date: string | null
          spotify_id: string
          spotify_uri: string | null
        }
        Insert: {
          artist?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          label?: string | null
          name: string
          rating?: number | null
          release_date?: string | null
          spotify_id: string
          spotify_uri?: string | null
        }
        Update: {
          artist?: string | null
          created_at?: string | null
          id?: number
          image?: string | null
          label?: string | null
          name?: string
          rating?: number | null
          release_date?: string | null
          spotify_id?: string
          spotify_uri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "albums_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "albums_on_lists"
            referencedColumns: ["artist_spotify_id"]
          },
          {
            foreignKeyName: "albums_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "all_albums_view"
            referencedColumns: ["artist_spotify_id"]
          },
          {
            foreignKeyName: "albums_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "albums_artist_fkey"
            columns: ["artist"]
            isOneToOne: false
            referencedRelation: "mother_list"
            referencedColumns: ["artist_spotify_id"]
          },
        ]
      }
      artists: {
        Row: {
          created_at: string | null
          genres: string[] | null
          id: number
          name: string | null
          spotify_id: string
        }
        Insert: {
          created_at?: string | null
          genres?: string[] | null
          id?: number
          name?: string | null
          spotify_id: string
        }
        Update: {
          created_at?: string | null
          genres?: string[] | null
          id?: number
          name?: string | null
          spotify_id?: string
        }
        Relationships: []
      }
      bluenote_rvg_seventies: {
        Row: {
          artist: string | null
          marketplace: string | null
          match: string | null
          title: string | null
          url: string
          year: number | null
        }
        Insert: {
          artist?: string | null
          marketplace?: string | null
          match?: string | null
          title?: string | null
          url: string
          year?: number | null
        }
        Update: {
          artist?: string | null
          marketplace?: string | null
          match?: string | null
          title?: string | null
          url?: string
          year?: number | null
        }
        Relationships: []
      }
      cti_rvg: {
        Row: {
          artist: string | null
          marketplace: string | null
          match: string | null
          title: string | null
          url: string
          year: number | null
        }
        Insert: {
          artist?: string | null
          marketplace?: string | null
          match?: string | null
          title?: string | null
          url: string
          year?: number | null
        }
        Update: {
          artist?: string | null
          marketplace?: string | null
          match?: string | null
          title?: string | null
          url?: string
          year?: number | null
        }
        Relationships: []
      }
      impulse_rvg: {
        Row: {
          artist: string | null
          marketplace: string | null
          match: string | null
          title: string | null
          url: string
          year: number | null
        }
        Insert: {
          artist?: string | null
          marketplace?: string | null
          match?: string | null
          title?: string | null
          url: string
          year?: number | null
        }
        Update: {
          artist?: string | null
          marketplace?: string | null
          match?: string | null
          title?: string | null
          url?: string
          year?: number | null
        }
        Relationships: []
      }
      list_entry: {
        Row: {
          album_id: string | null
          created_at: string
          id: number
          list_id: number | null
          position: number | null
        }
        Insert: {
          album_id?: string | null
          created_at?: string
          id?: number
          list_id?: number | null
          position?: number | null
        }
        Update: {
          album_id?: string | null
          created_at?: string
          id?: number
          list_id?: number | null
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "list_entry_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "list_entry_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums_on_lists"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "list_entry_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "all_albums_view"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "list_entry_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "mother_list"
            referencedColumns: ["spotify_id"]
          },
          {
            foreignKeyName: "list_entry_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      albums_on_lists: {
        Row: {
          artist: string | null
          artist_genres: string[] | null
          artist_genres_searchable: string | null
          artist_spotify_id: string | null
          image: string | null
          label: string | null
          list_entry_id: number | null
          list_entry_position: number | null
          list_name: string | null
          name: string | null
          rating: number | null
          release_date: string | null
          spotify_id: string | null
          spotify_uri: string | null
        }
        Relationships: []
      }
      all_albums_view: {
        Row: {
          artist: string | null
          artist_genres: string[] | null
          artist_genres_searchable: string | null
          artist_spotify_id: string | null
          image: string | null
          label: string | null
          name: string | null
          rating: number | null
          release_date: string | null
          spotify_id: string | null
          spotify_uri: string | null
        }
        Relationships: []
      }
      mother_list: {
        Row: {
          appears_on: string | null
          artist: string | null
          artist_genres: string[] | null
          artist_genres_searchable: string | null
          artist_spotify_id: string | null
          image: string | null
          label: string | null
          list_entry_id: number | null
          list_entry_position: number | null
          list_name: string | null
          name: string | null
          rating: number | null
          release_date: string | null
          spotify_id: string | null
          spotify_uri: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      search_all_albums: {
        Args: { keyword: string }
        Returns: {
          appears_on: string | null
          artist: string | null
          artist_genres: string[] | null
          artist_genres_searchable: string | null
          artist_spotify_id: string | null
          image: string | null
          label: string | null
          list_entry_id: number | null
          list_entry_position: number | null
          list_name: string | null
          name: string | null
          rating: number | null
          release_date: string | null
          spotify_id: string | null
          spotify_uri: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
