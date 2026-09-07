export type UserRole = 'STUDENT' | 'TEACHER';

export interface NavItem {
  icon: string;   // lucide icon name (used as label)
  label: string;
  href: string;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface RoleConfig {
  theme: string;
  label: string;
  initials: string;
  portalName: string;
  navSections: NavSection[];
}
