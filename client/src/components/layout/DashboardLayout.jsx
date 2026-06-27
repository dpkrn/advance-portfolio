import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { toggleSidebar, setSidebarOpen } from '../../store/slices/uiSlice';
import { scrollToSection } from '../../hooks/useScrollSpy';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

const iconMap = {
  home: 'Home',
  route: 'Route',
  'folder-kanban': 'Projects',
  github: 'GitHub',
  terminal: 'Coding',
  'book-open': 'Notebook',
  network: 'System Design',
  trophy: 'Achievements',
  'message-square-quote': 'Reviews',
  sparkles: 'Now',
  mail: 'Contact',
};

export default function DashboardLayout({ children }) {
  const dispatch = useAppDispatch();
  const { sidebarOpen, sidebarCollapsed } = useAppSelector((state) => state.ui);
  const { items: sections, activeSection } = useAppSelector((state) => state.sections);
  const profile = useAppSelector((state) => state.profile.data);

  const navItems = useMemo(
    () =>
      sections.map((s) => ({
        slug: s.slug,
        label: s.navLabel || s.title,
        icon: s.icon,
      })),
    [sections]
  );

  const handleNavClick = (slug) => {
    scrollToSection(slug);
    dispatch(setSidebarOpen(false));
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="theme-bg-grid fixed inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-40" />
      <div className="theme-bg-glow fixed inset-0 bg-gradient-radial pointer-events-none" />

      <Sidebar
        navItems={navItems}
        activeSection={activeSection}
        profile={profile}
        collapsed={sidebarCollapsed}
        onNavClick={handleNavClick}
        onToggle={() => dispatch(toggleSidebar())}
      />

      <MobileNav
        open={sidebarOpen}
        navItems={navItems}
        activeSection={activeSection}
        onNavClick={handleNavClick}
        onClose={() => dispatch(setSidebarOpen(false))}
        onOpen={() => dispatch(setSidebarOpen(true))}
      />

      <main
        className={`relative transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export { iconMap };
