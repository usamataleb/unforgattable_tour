// export interface User {
//   username: string;
//   email: string;
//   password: string;
// }

// Package interface matching Prisma schema
export interface Package {
  id: number;
  name: string;
  location: string;
  fullDescription: string;
  highlights: string;
  includes: string;
  excludes: string;
  priceWithTransfer: number;
  priceWithoutTransfer: number;
  websiteId: number;
  images: PackageImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PackageImage {
  id: number;
  src: string;
  packageId: number;
  createdAt: string;
  updatedAt: string;
}


export interface Carousel {
  image: string;
  title: string;
  subtitle: string;
  active: boolean;
}

export interface Image {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
