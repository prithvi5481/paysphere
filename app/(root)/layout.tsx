import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = {firstName: 'Prithvi', lastName: 'Singh' }
  return (
    <div className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn.firstName}/>
        {children}
    </div>
  );
}
