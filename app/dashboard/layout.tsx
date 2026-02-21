// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import "@/components/styles/dashboard.css";
import Footer from '@/components/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
    <div className="dashboard-layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      <div className={`dashboard-main ${sidebarCollapsed ? 'expanded' : ''}`}>
        <Header />
        <div className="dashboard-content">
          {children}
        </div>
        
       
      </div>
    </div> 
    <div className="inline flex">
    <Footer />
    </div>
    </>
  );
}