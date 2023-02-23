
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
          created_at: string
          id: string
          latitude: number
          longitude: number
        }
        Insert: {
          created_at?: string
          id: string
          latitude?: number
          longitude?: number
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
        }
      }
      friends: {
        Row: {
          friend_id: string
          id: number
          status: string
          user_id: string
        }
        Insert: {
          friend_id: string
          id?: number
          status?: string
          user_id?: string
        }
        Update: {
          friend_id?: string
          id?: number
          status?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          id: string
          username: string
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          id: string
          username?: string
        }
        Update: {
          avatar_url?: string
          created_at?: string
          id?: string
          username?: string
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