"use client";

import { Link } from "@inertiajs/react";
import { BarChart3, Briefcase, Building2, CalendarDays, ChevronDown, Clock, FileText, LayoutDashboard, Package, Settings, Users, Wallet } from "lucide-react";
import { useState } from "react";
import { NavUser } from "@/components/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import AppLogo from "./app-logo";

// ────────────────────────────────────────────────
// Full Sidebar Navigation Data (all modules)
// ────────────────────────────────────────────────
const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super-admin", "admin", "hr-manager"],
  },

  // Core HR
  {
    title: "Employees",
    icon: Users,
    href: "/employees",
    roles: ["super-admin", "admin", "hr-manager"],
    items: [
      { title: "All Employees", href: "/employees" },
      { title: "Add Employee", href: "/employees/create" },
    ],
  },
  {
    title: "Departments & Positions",
    icon: Building2,
    roles: ["super-admin", "admin", "hr-manager"],
    items: [
      { title: "Departments", href: "/departments" },
      { title: "Sub-Departments", href: "/sub-departments" },
      { title: "Positions", href: "/positions" },
      { title: "Position Allowances", href: "/position-allowances" },
    ],
  },

  // Employee Personal Records
  {
    title: "Employee Records",
    icon: FileText,
    roles: ["super-admin", "admin", "hr-manager"],
    items: [
      { title: "Profiles", href: "/employee-profiles" },
      { title: "Bank Details", href: "/employee-bank-details" },
      { title: "Family Members", href: "/family-members" },
      { title: "Education History", href: "/education-histories" },
      { title: "Work Experience", href: "/work-experiences" },
      { title: "Skills & Certifications", href: "/skills-certifications" },
      { title: "Documents", href: "/employee-documents" },
    ],
  },

  // Leave Management
  {
    title: "Leave Management",
    icon: CalendarDays,
    roles: ["super-admin", "admin", "hr-manager", "supervisor"],
    items: [
      { title: "Leave Types", href: "/leave-types" },
      { title: "Leave Applications", href: "/leave-applications" },
      { title: "Leave Balances", href: "/leave-balances" },
      { title: "Leave Approvals", href: "/leave-approvals" },
    ],
  },

  // Attendance & Time
  {
    title: "Attendance & Time",
    icon: Clock,
    roles: ["super-admin", "admin", "hr-manager", "attendance-officer"],
    items: [
      { title: "Daily Logs", href: "/attendance-logs" },
      { title: "Adjustments", href: "/attendance-adjustments" },
      { title: "Shifts & Assignments", href: "/shifts" },
      { title: "Holidays", href: "/holidays" },
      { title: "Overtime Requests", href: "/overtime-requests" },
    ],
  },

  // Payroll & Compensation
  {
    title: "Payroll",
    icon: Wallet,
    roles: ["super-admin", "admin", "payroll-officer"],
    items: [
      { title: "Salary Structures", href: "/salary-structures" },
      { title: "Allowances", href: "/allowances" },
      { title: "Deductions", href: "/deductions" },
      { title: "Benefits", href: "/benefits" },
      { title: "Payroll Runs", href: "/payroll-runs" },
      { title: "Payslips", href: "/payslips" },
      { title: "Advances & Loans", href: "/advances-loans" },
    ],
  },

  // Performance & Appraisal
  {
    title: "Performance",
    icon: BarChart3,
    roles: ["super-admin", "admin", "hr-manager", "supervisor"],
    items: [
      { title: "Reviews", href: "/performance-reviews" },
      { title: "KPI Templates", href: "/kpi-templates" },
      { title: "Appraisal Scores", href: "/appraisal-scores" },
    ],
  },

  // Recruitment
  {
    title: "Recruitment",
    icon: Briefcase,
    roles: ["super-admin", "admin", "hr-manager", "recruitment-officer"],
    items: [
      { title: "Job Openings", href: "/job-openings" },
      { title: "Applicants", href: "/applicants" },
    ],
  },

  // Assets & Inventory (NEW)
  {
    title: "Assets & Inventory",
    icon: Package,
    roles: ["super-admin", "admin", "store-manager", "procurement-officer"],
    items: [
      { title: "All Assets", href: "/assets" },
      { title: "Asset Categories", href: "/asset-categories" },
      { title: "Assignments", href: "/asset-assignments" },
      { title: "Maintenance Logs", href: "/asset-maintenance" },
      { title: "Inventory Items", href: "/inventory" },
      { title: "Stock Levels", href: "/inventory/stock" },
      { title: "Purchase Orders", href: "/inventory/purchases" },
      { title: "Suppliers", href: "/suppliers" },
    ],
  },

  // System / Admin
  {
    title: "System",
    icon: Settings,
    roles: ["super-admin", "admin"],
    items: [
      { title: "Users & Roles", href: "/users" },
      { title: "Audit Logs", href: "/audit-logs" },
      { title: "Settings", href: "/settings" },
    ],
  },
];


export function AppSidebar() {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {mainNavItems.map((item) => (
              <Collapsible
                key={item.title}
                open={openGroups[item.title] ?? false}
                onOpenChange={() => toggleGroup(item.title)}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={cn(
                      item.items ? "justify-between" : "",
                      "w-full hover:bg-accent/50 transition-colors"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* <item.icon className="h-5 w-5" /> */}
                      <span>{item.title}</span>
                    </div>
                    {item.items && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openGroups[item.title] ? "rotate-180" : ""
                        )}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={subItem.href}
                              className="hover:bg-accent/50 transition-colors"
                            >
                              {subItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </Collapsible>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}