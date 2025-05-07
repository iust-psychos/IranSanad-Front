import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import Login from '../Components/Login';
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Login Component', () => {
  const mockOnLogin = vi.fn()

  beforeEach(() => {
    mockOnLogin.mockReset()
    mockNavigate.mockReset()
    render(
      <MemoryRouter>
        <Login onLogin={mockOnLogin} />
      </MemoryRouter>
    )
  })
  // render test
  test('renders login form with all fields', () => {
    expect(screen.getByLabelText(/ایمیل/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ورود/i })).toBeInTheDocument()
  });

  test('submits form with email and password', async () => {
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: 'Mehran0@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
      target: { value: 'Mehran!00' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ورود/i }))
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'Mehran0@example.com',
        password: 'Mehran!00',
      })
    })
  })
  test('navigates to dashboard on successful login', async () => {
    mockOnLogin.mockResolvedValueOnce({ success: true })
  
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: 'Mehran0@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
      target: { value: 'Mehran!00' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ورود/i }))
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('requires both email and password', async () => {
    fireEvent.click(screen.getByRole('button', { name: /ورود/i }))
  
    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
  
    fireEvent.change(screen.getByLabelText(/ایمیل/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ورود/i }))
  
    await waitFor(() => {
      expect(mockOnLogin).not.toHaveBeenCalled()
    })
  })
})
