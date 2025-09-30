import axios, { type AxiosResponse, type AxiosError } from 'axios';
import type { Image, Carousel, Package } from "$lib/constant/interfaces";

export default class AppService {
  static API_BASE = "https://api.usamatalib.com";

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
      const response: AxiosResponse<Image[]> =
        await this.axiosInstance.get('/images/websiteId/1');
      return response.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return [];
    }
  }

  static async getCarousel(): Promise<Carousel[]> {
    try {
      const response: AxiosResponse<{ success: boolean; items: Carousel[] }> = 
        await this.axiosInstance.get('/carousel/websiteId/1');
      return response.data.items || [];

    } catch (error) {
      console.error("AppService.getCarousel error:", error);
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
          timeout: 5000
        });
      
      return response.data.status === "OK";
    } catch (error) {
      console.error("AppService.healthCheck error:", error);
      return false;
    }
  }

  // Get  packages
  static async getWebsitePackages(): Promise<Package[]> {
    try {
      const response: AxiosResponse< Package[] > = 
        await this.axiosInstance.get('/packages/public/website/1');

      return response.data || [];
    } catch (error) {
      console.error("AppService.getPackages error:", error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return [];
    }
  }

  

  // Get  tours (commented out as in original)
  // static async getTours(): Promise<any[]> {
  //   try {
  //     const response: AxiosResponse<{ success: boolean; tours: any[] }> = 
  //       await this.axiosInstance.get('//tours');
  //     
  //     return response.data.tours || [];
  //   } catch (error) {
  //     console.error("AppService.getTours error:", error);
  //     if (axios.isAxiosError(error)) {
  //       this.handleAxiosError(error);
  //     }
  //     return [];
  //   }
  // }

  // Generic GET method for any  endpoint
  static async getData<T>(endpoint: string): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`AppService.getData error for ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return null;
    }
  }

  // Additional utility methods you might find useful

  // POST method for future use
  static async postData<T, D = unknown>(endpoint: string, data?: D): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`AppService.postData error for ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return null;
    }
  }

  // PUT method for future use
  static async putData<T, D = unknown>(endpoint: string, data?: D): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`AppService.putData error for ${endpoint}:`, error);
      if (axios.isAxiosError(error)) {
        this.handleAxiosError(error);
      }
      return null;
    }
  }

}