-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contact_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  org text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  attachments json DEFAULT '[ ]'::json,
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sn_categories (
  id integer NOT NULL DEFAULT nextval('sn_categories_id_seq'::regclass),
  parent_id integer,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  type text CHECK (type = ANY (ARRAY['menu'::text, 'attribute'::text])),
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  attribute_key text,
  CONSTRAINT sn_categories_pkey PRIMARY KEY (id),
  CONSTRAINT sn_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.sn_categories(id)
);
CREATE TABLE public.sn_comments (
  id integer NOT NULL DEFAULT nextval('sn_comments_id_seq'::regclass),
  post_id integer NOT NULL,
  user_id uuid,
  parent_id integer,
  content text NOT NULL,
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sn_comments_pkey PRIMARY KEY (id),
  CONSTRAINT sn_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.sn_posts(id),
  CONSTRAINT sn_comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.sn_comments(id),
  CONSTRAINT sn_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sn_users(id)
);
CREATE TABLE public.sn_images (
  id integer NOT NULL DEFAULT nextval('sn_images_id_seq'::regclass),
  post_id integer,
  user_id uuid NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  mime_type text,
  width integer,
  height integer,
  alt_text text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sn_images_pkey PRIMARY KEY (id),
  CONSTRAINT sn_images_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.sn_posts(id),
  CONSTRAINT sn_images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sn_users(id)
);
CREATE TABLE public.sn_likes (
  id integer NOT NULL DEFAULT nextval('sn_likes_id_seq'::regclass),
  post_id integer NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sn_likes_pkey PRIMARY KEY (id),
  CONSTRAINT sn_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.sn_posts(id),
  CONSTRAINT sn_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sn_users(id)
);
CREATE TABLE public.sn_post_categories (
  id integer NOT NULL DEFAULT nextval('sn_post_categories_id_seq'::regclass),
  post_id integer NOT NULL,
  category_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sn_post_categories_pkey PRIMARY KEY (id),
  CONSTRAINT sn_post_categories_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.sn_posts(id),
  CONSTRAINT sn_post_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.sn_categories(id)
);
CREATE TABLE public.sn_posts (
  id integer NOT NULL DEFAULT nextval('sn_posts_id_seq'::regclass),
  author_id uuid,
  category_id integer NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  published_date date NOT NULL DEFAULT CURRENT_DATE,
  featured_image_url text,
  location text,
  read_time text,
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'draft'::text CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])),
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone,
  attachment_url text,
  attachment_name text,
  attachment_size bigint,
  attachment_type text,
  CONSTRAINT sn_posts_pkey PRIMARY KEY (id),
  CONSTRAINT sn_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.sn_categories(id),
  CONSTRAINT sn_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.sn_users(id)
);
CREATE TABLE public.sn_users (
  id uuid NOT NULL,
  email text NOT NULL,
  display_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user'::text CHECK (role = ANY (ARRAY['super_admin'::text, 'writer'::text, 'user'::text])),
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sn_users_pkey PRIMARY KEY (id),
  CONSTRAINT sn_users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);