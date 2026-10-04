import { demoOrders, demoTestimonials } from "./demoData";

export type CheckoutKey =
  | "single"
  | "four"
  | "six"
  | "balik"
  | "wmethod"
  | "doseen"
  | "miring"
  | "city"
  | "monetized";

export type Book = {
  key: CheckoutKey;
  title: string;
  description: string;
  cover: string;
};

export type Testimonial = { nama: string; kota?: string; teks: string };
export type Order = { nama: string; kota: string; item: string; menit?: number };

export const books: Book[] = [
  {
    key: "balik",
    title: "Balik Jungkir",
    description: "Perjalanan bisnis dari nol, naik, jatuh, dan bangkit kembali.",
    cover: "/covers/balik-jungkir.jpg",
  },
  {
    key: "wmethod",
    title: "W Method",
    description:
      "Metodologi membangun corporate brand dalam 46 tahapan, dari identifikasi hingga evaluasi.",
    cover: "/covers/w-method.jpg",
  },
  {
    key: "doseen",
    title: "Doseen Desoon",
    description: "Panduan praktis desain dan masa depan pendidikan kreatif.",
    cover: "/covers/doseen-desoon.jpg",
  },
  {
    key: "miring",
    title: "Berpikir Miring",
    description:
      "Pola pikir kreatif yang out of the box untuk menemukan kemungkinan baru.",
    cover: "/covers/berpikir-miring.jpg",
  },
  {
    key: "city",
    title: "City Branding",
    description:
      "Membangun identitas kota dengan legitimasi internasional. Kota bukan sekadar logo.",
    cover: "/covers/city-branding.jpg",
  },
  {
    key: "monetized",
    title: "The Monetized City",
    description:
      "Bagaimana identitas dan kekuatan lokal menjadi nilai ekonomi daerah.",
    cover: "/covers/the-monetized-city.jpg",
  },
];

export const checkout: Record<CheckoutKey, string> = {
  single: import.meta.env.VITE_CHECKOUT_SINGLE ?? "",
  four: import.meta.env.VITE_CHECKOUT_FOUR ?? "",
  six: import.meta.env.VITE_CHECKOUT_SIX ?? "",
  balik: import.meta.env.VITE_CHECKOUT_BALIK ?? "",
  wmethod: import.meta.env.VITE_CHECKOUT_WMETHOD ?? "",
  doseen: import.meta.env.VITE_CHECKOUT_DOSEEN ?? "",
  miring: import.meta.env.VITE_CHECKOUT_MIRING ?? "",
  city: import.meta.env.VITE_CHECKOUT_CITY ?? "",
  monetized: import.meta.env.VITE_CHECKOUT_MONETIZED ?? "",
};

function readJson<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const promoDeadline = import.meta.env.VITE_PROMO_DEADLINE ?? "";
export const socialProofIsDemo = import.meta.env.VITE_SOCIAL_PROOF_MODE === "demo";
export const testimonials = socialProofIsDemo
  ? demoTestimonials
  : readJson<Testimonial[]>(import.meta.env.VITE_TESTIMONIALS, []);
export const orders = socialProofIsDemo
  ? demoOrders
  : readJson<Order[]>(import.meta.env.VITE_ORDERS, []);

