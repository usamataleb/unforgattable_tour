export interface User {
  usename: string;
  email: string;
  password: string;
}
export interface Package {
  id: number;
  name: string;
  price: number;
  location: string;
  description: string;
}
export interface CarouselItem {
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