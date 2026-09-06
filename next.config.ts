import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Insights 썸네일(sn_posts.featured_image_url)이 Supabase Storage 공개
    // URL을 그대로 쓴다. 버킷마다 경로가 달라 pathname 은 넓게 잡는다.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "otthqvsekttrljmonvdg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
