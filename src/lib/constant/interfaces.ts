// export interface User {
//   username: string;
//   email: string;
//   password: string;
// }

export interface Package {
  id: number;
  name: string;
  src: string;
  location: string;
  description: string;
  highlights: string;
  includes: string;
  excludes: string;
  priceWithTransfer: number;
  priceWithoutTransfer: number;
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
