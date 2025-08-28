import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type { Image, CarouselItem } from "$lib/constant/interfaces";

export default class AppService {
  static API_BASE = "http://localhost:3000";

  // Configure axios instance with default settings
  private static axiosInstance = axios.create({
    baseURL: this.API_BASE,
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  private static handleAxiosError(error: AxiosError): void {
    if (error.response) {
      throw new Error(`HTTP ${error.response.status}: ${error.response.data || error.message}`);
    } else if (error.request) {
      throw new Error('Network error: No response received');
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }

  static async getWebsiteGallery(): Promise<Image[]> {
    try {
      const response: AxiosResponse<{ success: boolean; images: Image[] }> = 
        await this.axiosInstance.get('/images/websiteId/1');      
      return response.data.images || [];
    } catch (error) {
      console.error("PublicAppService.getGalleryImages error:", error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return [];
    }
  }

  // Get carousel items (public endpoint)
  static async getCarousel(): Promise<CarouselItem[]> {
    try {
      const response: AxiosResponse<{ success: boolean; items: CarouselItem[] }> = 
        await this.axiosInstance.get('/carousel');
      
      return response.data.items || [];
    } catch (error) {
      console.error("PublicAppService.getCarousel error:", error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return [];
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const response: AxiosResponse<{ status: string }> = 
        await this.axiosInstance.get('/health', {
          timeout: 5000 // Override default timeout for health checks
        });
      
      return response.data.status === "OK";
    } catch (error) {
      console.error("PublicAppService.healthCheck error:", error);
      return false;
    }
  }

  // Get public packages
  static async getPackages(): Promise<unknown[]> {
    try {
      const response: AxiosResponse<{ success: boolean; packages: unknown[] }> = 
        await this.axiosInstance.get('/public/packages');
      
      return response.data.packages || [];
    } catch (error) {
      console.error("PublicAppService.getPackages error:", error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return [];
    }
  }

  // Get public tours (commented out as in original)
  // static async getTours(): Promise<any[]> {
  //   try {
  //     const response: AxiosResponse<{ success: boolean; tours: any[] }> = 
  //       await this.axiosInstance.get('/public/tours');
  //     
  //     return response.data.tours || [];
  //   } catch (error) {
  //     console.error("PublicAppService.getTours error:", error);
  //     if (axios.isAxiosError(error)) {
  //       this.handleAxiosError(error);
  //     }
  //     return [];
  //   }
  // }

  // Generic GET method for any public endpoint
  static async getPublicData<T>(endpoint: string): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`PublicAppService.getPublicData error for ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return null;
    }
  }

  // Additional utility methods you might find useful

  // POST method for future use
  static async postPublicData<T, D = unknown>(endpoint: string, data?: D): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PublicAppService.postPublicData error for ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return null;
    }
  }

  // PUT method for future use
  static async putPublicData<T, D = unknown>(endpoint: string, data?: D): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PublicAppService.putPublicData error for ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return null;
    }
  }

}