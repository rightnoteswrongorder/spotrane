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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          release_date: string | null
          spotify_id: string | null
          spotify_uri: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      search_all_albums: {
        Args: {
          keyword: string
        }
        Returns: {
          artist: string | null
          artist_genres: string[] | null
          artist_genres_searchable: string | null
          artist_spotify_id: string | null
          image: string | null
          label: string | null
          name: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
