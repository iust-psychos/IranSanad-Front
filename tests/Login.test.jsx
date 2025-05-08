import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Login from '../Components/Login';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import 'react-tooltip/dist/react-tooltip.css'; // If styles are needed


const mockNavigate = vi.fn();
const { mockLogin } = vi.hoisted(() => {return { mockLogin : vi.fn(() =>
  Promise.resolve({
    data: {
      tokens: { access: 'mock-token' },
    },
  })

)}});

const {mockSaveToken} = vi.hoisted(()=> {return {mockSaveToken:vi.fn()}}); 
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../Managers/LoginManager', () => ({
  default: {
    Login: mockLogin,
  },
}));

vi.mock('../Managers/CookieManager', () => ({
  default: {
    SaveToken: mockSaveToken,
    LoadToken: () => 'mock-token',
  },
}));
// describe('Login Component', () => {
//   it('displays password requirements tooltip on hover', async () => {
//     render(
//       <MemoryRouter>
//         <Login />
//       </MemoryRouter>
//     )

//     // Hover over the InfoIcon with the tooltip
//     const infoIcon = screen.getByLabelText(/رمز عبور/i);
//     await userEvent.hover(infoIcon);

//     // Wait for the tooltip content to appear
//     const tooltipText = await screen.findByText(
//       /کلمه عبور باید حداقل به طول 8 و شامل حروف بزرگ و کوچک و حداقل یک عدد و یک کارکتر خاص باشد/
//     );
//     expect(tooltipText).toBeInTheDocument();
//   });
// });
test('renders login form inputs and button', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/ایمیل/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ورود/i })).toBeInTheDocument();
});
test('logs in with valid credentials and navigates', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/ایمیل/i), {
    target: { value: 'Mehran0@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
    target: { value: 'Mehran!00' },
  });

  fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('Mehran0@example.com', 'Mehran!00');
    expect(mockSaveToken).toHaveBeenCalledWith(10, 'mock-token');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

test('navigates to dashboard on successful login', async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByLabelText(/ایمیل/i), {
    target: { value: 'Mehran0@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
    target: { value: 'Mehran!00' },
  });
  fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  });
});

// test('displays password requirements tooltip on hover', async () => {
//   render(
//     <MemoryRouter>
//       <Login />
//     </MemoryRouter>
//   );

//   const user = userEvent.setup();

//   const submitButton = screen.getByRole('button', { name: /ورود/i });
//   await user.click(submitButton);

//   const emailInput = screen.getByLabelText(/رمز عبور/i);
//   await user.hover(emailInput);

  
//   await waitFor(() => {
//     expect(screen.getByTestId('emailTooltip')).toBeVisible();
//   });
// });