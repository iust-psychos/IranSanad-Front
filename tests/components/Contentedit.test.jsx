import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContentEditor from '../../Components/ContentEdit/ContentEditor';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test query client
const queryClient = new QueryClient();

// Mock necessary dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ doc_uuid: 'test123' }),
    useLoaderData: () => ({ title: 'Test Document', doc_uuid: 'test123' }),
  };
});

vi.mock('@lexical/react/LexicalComposerContext', () => ({
  useLexicalComposerContext: () => [{
    focus: vi.fn(),
  }],
}));

// Properly mock CookieManager with default export
vi.mock('../../Managers/CookieManager', () => ({
  default: {
    LoadToken: vi.fn(() => 'mock-token'),
  }
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ 
      data: { 
        username: 'testuser',
        email: 'test@example.com',
        id: 1
      } 
    })),
  },
}));

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ContentEditor', () => {
  it('renders the document title in the input field', () => {
    renderWithProviders(<ContentEditor />);
    
    const titleInput = screen.getByRole('textbox');
    expect(titleInput).toHaveValue('Test Document');
  });

  it('opens share modal when share button is clicked', async () => {
    renderWithProviders(<ContentEditor />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    // Wait for modal to appear
    expect(await screen.findByText(/share document/i)).toBeInTheDocument();
  });

  it('updates document title when input changes', () => {
    renderWithProviders(<ContentEditor />);
    
    const titleInput = screen.getByRole('textbox');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    expect(titleInput).toHaveValue('New Title');
  });
});