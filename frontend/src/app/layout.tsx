import type { Metadata } from "next";
import { Google_Sans_Code } from "next/font/google";
import "./globals.css";

const googleSansCode = Google_Sans_Code({
  variable: "--font-google-sans-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tech-ly.in"),
  title: "Techly — Best IT Company in Ahmedabad & Bhavnagar | Web & App Development",
  description: "Techly is a leading IT solutions provider in Ahmedabad and Bhavnagar, specializing in AI-based web and app development, custom software, SEO, and digital growth for businesses and startups.",
  keywords: [
    "IT company near me", "best IT solution company in Gujarat", "Bhavnagar top IT companies",
    "Techly Best IT Company in Ahmedabad and Bhavnagar",
    "Techly Web and App Development Company in Ahmedabad and Bhavnagar",
    "Techly Leading IT Solutions Provider in Ahmedabad and Bhavnagar",
    "Techly Website Development Services in Ahmedabad and Bhavnagar",
    "Techly Mobile App Development Company in Ahmedabad and Bhavnagar",
    "Techly SEO and Digital Growth Company in Ahmedabad and Bhavnagar",
    "Techly Custom Software Development in Ahmedabad and Bhavnagar",
    "Techly AI Based Web and App Solutions in Ahmedabad and Bhavnagar",
    "Techly Professional IT Company Near You in Ahmedabad and Bhavnagar",
    "Techly Business Growth and Technology Solutions in Ahmedabad and Bhavnagar",
    "Techly Responsive Website Design Company in Ahmedabad and Bhavnagar",
    "Techly E Commerce Website Development in Ahmedabad and Bhavnagar",
    "Techly Full Stack Development Company in Ahmedabad and Bhavnagar",
    "Techly Startup Friendly IT Company in Ahmedabad and Bhavnagar",
    "Techly Complete Digital Solutions Company in Ahmedabad and Bhavnagar"
  ],
  icons: {
    icon: "/reallogo.png",
    apple: "/reallogo.png",
  },
  openGraph: {
    title: "Techly — Leading IT Solutions in Ahmedabad & Bhavnagar",
    description: "Transform your business with Techly's AI-driven web and mobile solutions. The best IT company for startups and enterprises in Gujarat.",
    images: [{ url: "/reallogo.png" }],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${googleSansCode.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-mono">{children}</body>
    </html>
  );
}
