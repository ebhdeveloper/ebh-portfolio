import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    { path: "../assets/fonts/montserrat-medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/montserrat-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

export const iranianSans = localFont({
  src: "../assets/fonts/iranian-sans-regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-iranian-sans",
  display: "swap",
});
