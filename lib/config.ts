export const API =
  process.env.NODE_ENV === "production"
    ? "https://yourdomain.com/api"
    : "http://localhost:3000/api";
