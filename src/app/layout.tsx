import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Local Event Finder",
  description: "Discover concerts, meetups, and festivals near you.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen pb-16">
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <footer className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
            <span className="text-sm font-medium">
              Browse local events and save your favorites.
            </span>
            <a
              href="/favorites"
              className="rounded-md bg-black px-4 py-2 text-sm text-white shadow hover:bg-gray-800"
            >
              View Favorites
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
