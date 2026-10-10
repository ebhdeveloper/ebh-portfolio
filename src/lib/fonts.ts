import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    { path: "../assets/fonts/montserrat-medium.ttf", weight: "500", style: "normal" },
    { path: "../assets/fonts/montserrat-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

export const iranSans = localFont({
  src: [
    { path: "../assets/fonts/iran-sans-regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/iran-sans-bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-iran-sans",
  display: "swap",
});
