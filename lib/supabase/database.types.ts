/**
 * Hand-written to mirror supabase/schema.sql exactly. Once the project is
 * linked to a live Supabase instance, regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > lib/supabase/database.types.ts
 */

export type ProfileRole = "admin" | "staff" | "partner" | "customer";
export type OrderPaymentMethod = "paystack" | "momo" | "cash" | "bank_transfer";
export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "new" | "confirmed" | "dispatched" | "delivered" | "cancelled";
export type QuoteRequestType = "wholesale" | "bulk" | "lab_service" | "general";
export type QuoteStatus = "new" | "contacted" | "quoted" | "closed";
export type ArticleStatus = "draft" | "published";
export type CertificationStatus = "active" | "pending";
export type SubscriptionPlan = "weekly" | "monthly";
export type SubscriptionStatus = "new" | "active" | "paused" | "cancelled";
export type ApplicationStatus = "new" | "reviewing" | "approved" | "rejected";
export type JobApplicationStatus = "new" | "reviewing" | "shortlisted" | "rejected" | "hired";
export type PartnerTier = "standard" | "silver" | "gold";
export type LabSampleStatus = "received" | "testing" | "complete";

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: ProfileRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string; email: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      site_content: {
        Row: { id: string; section: string; key: string; value: string | null; updated_at: string };
        Insert: Partial<Database["public"]["Tables"]["site_content"]["Row"]> & { section: string; key: string };
        Update: Partial<Database["public"]["Tables"]["site_content"]["Row"]>;
        Relationships: [];
      };
      hero_slides: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_href: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["hero_slides"]["Row"]> & { title: string };
        Update: Partial<Database["public"]["Tables"]["hero_slides"]["Row"]>;
        Relationships: [];
      };
      page_heroes: {
        Row: {
          id: string;
          page_slug: string;
          title: string;
          subtitle: string | null;
          image_url: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["page_heroes"]["Row"]> & { page_slug: string; title: string };
        Update: Partial<Database["public"]["Tables"]["page_heroes"]["Row"]>;
        Relationships: [];
      };
      gallery_items: {
        Row: {
          id: string;
          title: string | null;
          image_url: string;
          category: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_items"]["Row"]> & { image_url: string };
        Update: Partial<Database["public"]["Tables"]["gallery_items"]["Row"]>;
        Relationships: [];
      };
      social_links: {
        Row: { id: string; platform: string; url: string; sort_order: number; is_active: boolean };
        Insert: Partial<Database["public"]["Tables"]["social_links"]["Row"]> & { platform: string; url: string };
        Update: Partial<Database["public"]["Tables"]["social_links"]["Row"]>;
        Relationships: [];
      };
      certifications: {
        Row: {
          id: string;
          name: string;
          badge_image: string | null;
          issuing_body: string | null;
          status: CertificationStatus;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["certifications"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["certifications"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category: string;
          subcategory: string;
          description: string;
          image_url: string | null;
          gallery: string[];
          price: number;
          unit: string;
          tags: string[];
          traceability_note: string;
          is_available: boolean;
          stock_quantity: number | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          name: string;
          slug: string;
          category: string;
          subcategory: string;
          price: number;
          unit: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      product_batches: {
        Row: {
          id: string;
          batch_code: string;
          product_id: string | null;
          harvest_date: string | null;
          origin: string | null;
          certifications: string[];
          coa_url: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["product_batches"]["Row"]> & { batch_code: string };
        Update: Partial<Database["public"]["Tables"]["product_batches"]["Row"]>;
        Relationships: [];
      };
      inventory_items: {
        Row: {
          id: string;
          name: string;
          category: string;
          image_url: string | null;
          price: number;
          cost_price: number | null;
          unit: string;
          stock_quantity: number;
          low_stock_threshold: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["inventory_items"]["Row"]> & {
          name: string;
          category: string;
          price: number;
          unit: string;
        };
        Update: Partial<Database["public"]["Tables"]["inventory_items"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          reference: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          delivery_zone: string;
          delivery_address: string | null;
          delivery_fee: number;
          payment_method: OrderPaymentMethod;
          payment_status: OrderPaymentStatus;
          status: OrderStatus;
          subtotal: number;
          total: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          reference: string;
          customer_name: string;
          customer_phone: string;
          payment_method: OrderPaymentMethod;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          unit: string;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & {
          order_id: string;
          product_name: string;
          unit: string;
          unit_price: number;
          quantity: number;
          line_total: number;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [];
      };
      quote_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          company: string | null;
          request_type: QuoteRequestType;
          product_or_service: string | null;
          quantity: string | null;
          timeline: string | null;
          notes: string | null;
          status: QuoteStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["quote_requests"]["Row"]> & {
          name: string;
          phone: string;
          request_type: QuoteRequestType;
        };
        Update: Partial<Database["public"]["Tables"]["quote_requests"]["Row"]>;
        Relationships: [];
      };
      article_categories: {
        Row: { id: string; name: string; slug: string; description: string | null; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["article_categories"]["Row"]> & { name: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["article_categories"]["Row"]>;
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category_id: string | null;
          tags: string[];
          excerpt: string;
          cover_image: string | null;
          body: string;
          author_id: string | null;
          author_name: string;
          status: ArticleStatus;
          featured: boolean;
          seo_title: string | null;
          seo_description: string | null;
          reading_time: number;
          views: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["articles"]["Row"]> & { title: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["articles"]["Row"]>;
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          body: string;
          cover: string | null;
          event_date: string | null;
          location: string | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["events"]["Row"]> & { title: string; slug: string };
        Update: Partial<Database["public"]["Tables"]["events"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          customer_name: string;
          phone: string;
          email: string | null;
          plan: SubscriptionPlan;
          item: string;
          quantity: number;
          status: SubscriptionStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          customer_name: string;
          phone: string;
          plan: SubscriptionPlan;
          item: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      outgrower_applications: {
        Row: {
          id: string;
          farmer_name: string;
          phone: string;
          email: string | null;
          location: string;
          crop: string;
          land_size: string | null;
          notes: string | null;
          status: ApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["outgrower_applications"]["Row"]> & {
          farmer_name: string;
          phone: string;
          location: string;
          crop: string;
        };
        Update: Partial<Database["public"]["Tables"]["outgrower_applications"]["Row"]>;
        Relationships: [];
      };
      job_openings: {
        Row: {
          id: string;
          title: string;
          department: string;
          description: string;
          location: string;
          is_open: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["job_openings"]["Row"]> & { title: string; department: string };
        Update: Partial<Database["public"]["Tables"]["job_openings"]["Row"]>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          opening_id: string | null;
          applicant_name: string;
          phone: string;
          email: string | null;
          cv_url: string | null;
          cover_note: string | null;
          status: JobApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["job_applications"]["Row"]> & {
          applicant_name: string;
          phone: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_applications"]["Row"]>;
        Relationships: [];
      };
      partners: {
        Row: {
          id: string;
          profile_id: string;
          business_name: string;
          business_type: string | null;
          tier: PartnerTier;
          approved: boolean;
          approved_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["partners"]["Row"]> & { profile_id: string; business_name: string };
        Update: Partial<Database["public"]["Tables"]["partners"]["Row"]>;
        Relationships: [];
      };
      lab_samples: {
        Row: {
          id: string;
          reference: string;
          client_name: string;
          client_phone: string;
          client_email: string | null;
          sample_type: string;
          tests: string[];
          status: LabSampleStatus;
          coa_url: string | null;
          notes: string | null;
          submitted_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["lab_samples"]["Row"]> & {
          reference: string;
          client_name: string;
          client_phone: string;
          sample_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["lab_samples"]["Row"]>;
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["push_subscriptions"]["Row"]> & {
          endpoint: string;
          p256dh: string;
          auth: string;
        };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Row"]>;
        Relationships: [];
      };
    };
    Functions: {
      lookup_lab_sample: {
        Args: { p_reference: string };
        Returns: {
          reference: string;
          sample_type: string;
          status: LabSampleStatus;
          coa_url: string | null;
          submitted_at: string;
          completed_at: string | null;
        }[];
      };
    };
  };
}
