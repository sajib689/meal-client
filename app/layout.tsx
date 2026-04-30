import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ReduxProvider } from "@/store/Provider";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import ThemeConfigProvider from "@/components/ThemeConfigProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Meal Master | Smart Mess Management System",
  description: "Manage meals, members, billing, and reports easily with our cloud-based SaaS platform for hostels and messes.",
  openGraph: {
    title: "Meal Master | Smart Mess Management System",
    description: "Manage meals, members, billing, and reports easily with our cloud-based SaaS platform.",
    url: "https://mealmaster.com",
    siteName: "Meal Master",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Meal Master Dashboard" }],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <StyledComponentsRegistry>
          <ReduxProvider>
            <ThemeConfigProvider>
              {children}
            </ThemeConfigProvider>
          </ReduxProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
