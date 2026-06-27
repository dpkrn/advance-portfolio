import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { toggleSidebar, setSidebarOpen } from '../../store/slices/uiSlice';
import { scrollToSection } from '../../hooks/useScrollSpy';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

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
      {/* Decorative backgrounds (dark-mode only) */}
      <div
        className="theme-bg-grid fixed inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-50"
        aria-hidden="true"
      />
      <div
        className="theme-bg-glow fixed inset-0 bg-gradient-radial pointer-events-none"
        aria-hidden="true"
      />

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
        profile={profile}
        onNavClick={handleNavClick}
        onClose={() => dispatch(setSidebarOpen(false))}
        onOpen={() => dispatch(setSidebarOpen(true))}
      />

      <main
        className={`relative transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-60'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
