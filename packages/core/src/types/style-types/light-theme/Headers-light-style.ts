type HeaderStyle = {
  color: string;
  fontSize: string;
  marginBottom: string;
};

export const HeadersLightStyle: { [key: string]: HeaderStyle } = {
  h1: {
    color: '#333',
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  h2: {
    color: '#555',
    fontSize: '2rem',
    marginBottom: '0.75rem',
  },
  h3: {
    color: '#777',
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
  },
  h4: {
    color: '#999',
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
  },
  h5: {
    color: '#bbb',
    fontSize: '1.25rem',
    marginBottom: '0.125rem',
  },
  h6: {
    color: '#ddd',
    fontSize: '1rem',
    marginBottom: '0.0625rem',
  },
};
