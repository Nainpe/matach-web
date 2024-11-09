// Toggle the main menu visibility
export function toggleMenu(): void {
  const menuWrapper = document.getElementById('menuWrapper');
  const menuContent = document.getElementById('menuContent');
  const menuButton = document.querySelector('.menu-button') as HTMLButtonElement;

  if (!menuWrapper || !menuContent || !menuButton) return;

  const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';

  menuWrapper.classList.toggle('active');
  menuContent.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', (!isExpanded).toString());
}

// Toggle the visibility of a submenu
export function toggleSubmenu(event: React.MouseEvent<HTMLAnchorElement>, submenuId: string): void {
  event.preventDefault();
  const submenu = document.getElementById(submenuId);
  const arrow = (event.currentTarget as HTMLElement).querySelector('.arrow');

  if (!submenu || !arrow) return;

  submenu.classList.toggle('active');
  arrow.classList.toggle('active');
}
