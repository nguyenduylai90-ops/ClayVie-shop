export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          price: number
          description: string | null
          image_url: string | null
          category: string | null
          stock_quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          category?: string | null
          stock_quantity?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          category?: string | null
          stock_quantity?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          customer_address: string | null
          total_price: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          customer_address?: string | null
          total_price: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          customer_address?: string | null
          total_price?: number
          status?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          price_at_time: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          quantity: number
          price_at_time: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          price_at_time?: number
        }
      }
    }
  }
}
