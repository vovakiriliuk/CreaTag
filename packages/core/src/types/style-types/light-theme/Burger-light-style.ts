export const BurgerLightStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'space-around',
  width: '30px',
  height: '25px',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  zIndex: 10,
  '& div': {
    width: '30px',
    height: '3px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    transition: 'all 0.3s linear',
    position: 'relative' as const,
    transformOrigin: '1px',
  }
};
