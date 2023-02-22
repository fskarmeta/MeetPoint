
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      coordinates: {
        Row: {
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
        }
        Insert: {
          created_at?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
        }
      }
      friends: {
        Row: {
          friend_id: string
          id: number
          status: string | null
          user_id: string | null
        }
        Insert: {
          friend_id: string
          id?: number
          status?: string | null
          user_id?: string | null
        }
        Update: {
          friend_id?: string
          id?: number
          status?: string | null
          user_id?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          username?: string | null
        }
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