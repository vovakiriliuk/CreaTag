export const NavbarLightStyle = {
  backgroundColor: '#1a1a1a',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 2rem',
  height: '60px',
  position: 'relative' as const,
  zIndex: 1000,
};

export const NavLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  listStyle: 'none',
  margin: 0,
  padding: 0,
};

export const MobileMenuStyle = {
  position: 'absolute' as const,
  top: '60px',
  left: 0,
  right: 0,
  backgroundColor: '#1a1a1a',
  flexDirection: 'column' as const,
  padding: '1rem 2rem',
  borderTop: '1px solid #333',
  display: 'flex',
  gap: '15px',
};
