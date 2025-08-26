import type { Image } from "$lib/constant/interfaces";

// src/services/AppService.js
export default class AppService {
  static API_BASE = "http://localhost:3000";

  // Fetch all images
  static async getImages() {
    try {
      const res = await fetch(`${this.API_BASE}/images`);
      if (!res.ok) throw new Error("Failed to fetch images");
      const data : Image[] = await res.json();

      return data.map(img => ({
        src: img.url,
        width: img.width || null,
        height: img.height || null
      }));
    } catch (err) {
      console.error("AppService.getImages error:", err);
      return [];
    }
  }

  // You can add more methods later
  // static async getPackages() {}
  // static async getTours() {}
}
