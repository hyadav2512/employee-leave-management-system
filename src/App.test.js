import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';

test('redirects unauthenticated users to login', () => {
  render(<Provider store={store}><MemoryRouter initialEntries={['/dashboard']}><App /></MemoryRouter></Provider>);
  expect(screen.getByRole('heading', { name: /employee leave management/i })).toBeInTheDocument();
});
