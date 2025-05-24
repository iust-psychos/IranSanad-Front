import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContentEditor from '../../Components/ContentEdit/ContentEditor';
import { MemoryRouter } from 'react-router-dom';

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

describe('ContentEditor', () => {
  it('renders the document title in the input field', () => {
    render(
      <MemoryRouter>
        <ContentEditor />
      </MemoryRouter>
    );
    
    const titleInput = screen.getByRole('textbox');
    expect(titleInput.value).toBe('Test Document');
  });

  it('opens share modal when share button is clicked', () => {
    render(
      <MemoryRouter>
        <ContentEditor />
      </MemoryRouter>
    );
    
    const shareButton = screen.getByLabelText('share');
    fireEvent.click(shareButton);
    
    expect(screen.queryByText(/share document/i)).toBeInTheDocument();
  });

  it('updates document title when input changes', () => {
    render(
      <MemoryRouter>
        <ContentEditor />
      </MemoryRouter>
    );
    
    const titleInput = screen.getByRole('textbox');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    expect(titleInput.value).toBe('New Title');
  });
});