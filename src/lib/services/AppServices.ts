import type { Image, CarouselItem } from "$lib/constant/interfaces";

export default class PublicAppService {
  static API_BASE = "http://localhost:3000";

  // Helper method to handle API responses
  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response.json();
  }

  static async getWebsiteGallery(): Promise<Image[]> {
    try {
      const res = await fetch(`${this.API_BASE}/images/websiteId/1`, {
        method: 'GET',

      });

      if(!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const data = await this.handleResponse<{ success: boolean; items: Image[] }>(res);
      return data.items || [];
    } catch (err) {
      console.error("PublicAppService.getGalleryImages error:", err);
      return [];
    }
  }

  // Get carousel items (public endpoint)
  static async getCarousel(): Promise<CarouselItem[]> {
    try {
      const res = await fetch(`${this.API_BASE}/carousel`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'default' // Browser can cache this
      });

      const data = await this.handleResponse<{ success: boolean; items: CarouselItem[] }>(res);
      return data.items || [];
    } catch (err) {
      console.error("PublicAppService.getCarousel error:", err);
      return [];
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${this.API_BASE}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Short timeout for health checks
        signal: AbortSignal.timeout(5000)
      });

      const data = await res.json();
      return data.status === "OK";
    } catch (err) {
      console.error("PublicAppService.healthCheck error:", err);
      return false;
    }
  }

  // Get public packages (if you have this endpoint)
  static async getPackages(): Promise<unknown[]> {
    try {
      const res = await fetch(`${this.API_BASE}/public/packages`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'default'
      });

      const data = await this.handleResponse<{ success: boolean; packages: unknown[] }>(res);
      return data.packages || [];
    } catch (err) {
      console.error("PublicAppService.getPackages error:", err);
      return [];
    }
  }

  // Get public tours (if you have this endpoint)
  // static async getTours(): Promise<any[]> {
  //   try {
  //     const res = await fetch(`${this.API_BASE}/public/tours`, {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/json',
  //       },
  //       cache: 'default'
  //     });

  //     const data = await this.handleResponse<{ success: boolean; tours: any[] }>(res);
  //     return data.tours || [];
  //   } catch (err) {
  //     console.error("PublicAppService.getTours error:", err);
  //     return [];
  //   }
  // }

  // Generic GET method for any public endpoint
  static async getPublicData<T>(endpoint: string): Promise<T | null> {
    try {
      const res = await fetch(`${this.API_BASE}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      return await this.handleResponse<T>(res);
    } catch (err) {
      console.error(`PublicAppService.getPublicData error for ${endpoint}:`, err);
      return null;
    }
  }
}