import type { ProfileRole } from "@/lib/supabase/database.types";

export type AdminNavItem = {
  label: string;
  href: string;
  adminOnly?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin" }],
  },
  {
    label: "Sales",
    items: [
      { label: "Point of Sale", href: "/admin/pos" },
      { label: "Orders", href: "/admin/orders" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { label: "Products", href: "/admin/catalogue" },
      { label: "Inventory", href: "/admin/inventory" },
      { label: "Certifications", href: "/admin/certifications" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Knowledge Hub", href: "/admin/articles" },
      { label: "News & Events", href: "/admin/news" },
      { label: "Site content", href: "/admin/content" },
    ],
  },
  {
    label: "Relationships",
    items: [
      { label: "Enquiries", href: "/admin/enquiries" },
      { label: "Partners", href: "/admin/partners" },
    ],
  },
  {
    label: "Team",
    items: [{ label: "Staff", href: "/admin/staff", adminOnly: true }],
  },
];

export function filterNavForRole(role: ProfileRole) {
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || role === "admin"),
    }))
    .filter((group) => group.items.length > 0);
}
