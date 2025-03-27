import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();
  if(!loggedIn){
    redirect('/sign-in')
  }
  return (
    <div className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn}/>
        {children}
    </div>
  );
}
