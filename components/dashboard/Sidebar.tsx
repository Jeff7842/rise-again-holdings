// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Newspaper,
  Settings,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  CreditCard,
  GraduationCap,
  Users2,
  FolderOpen,
  BookOpen,
  FileText,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      section: "Principal",
      items: [
        { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
        { href: "/dashboard/listings", icon: Building2, label: "Listings" },
        { href: "/dashboard/messages", icon: MessageSquare, label: "Message Inbox" },
        { href: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
        { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
      ],
    },
    {
      section: "Management",
      items: [
        { href: "/dashboard/users", icon: Users, label: "Users Management" },
        { href: "/dashboard/news", icon: Newspaper, label: "News Hub" },
      ],
    },
    {
      section: "System",
      items: [
        { href: "/dashboard/settings", icon: Settings, label: "Settings" },
      ],
    },
  ];

  return (
    <aside className={`dashboard-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-area">
          <div className="logo-icon">
            <Building2 size={24} />
          </div>
          {!collapsed && <span className="logo-text">Rise Again</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="sidebar-content">
        {menuItems.map((section, idx) => (
          <div key={idx} className="sidebar-section">
            {!collapsed && <div className="section-label">{section.section}</div>}
            <div className="section-items">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-info-mini">
          <div className="user-avatar">JD</div>
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">John Doe</span>
              <span className="user-role">Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}