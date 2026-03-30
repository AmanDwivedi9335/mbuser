import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Medibank",
    short_name: "Medibank",
    description: "Secure multi-profile family health vault and assistant",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fae9f8",
    theme_color: "#fae9f8",
    icons: [
      {
        src: "/next.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/next.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
