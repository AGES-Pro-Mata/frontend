import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';

import CartItem from '@/components/card/cartItem';
import { renderWithProviders } from '@/test/test-utils';
import { ExperienceCategoryCard, type ExperienceDTO } from '@/types/experience';
import i18n from '@/i18n';

const getLocale = () => (i18n.language?.startsWith('pt') ? 'pt-BR' : 'en-US');

const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat(getLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate));

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const makeExperience = (overrides: Partial<ExperienceDTO> = {}): ExperienceDTO => ({
  id: 'exp-1',
  name: 'Experiência Teste',
  price: 120,
  category: ExperienceCategoryCard.TRAIL,
  image: { url: '/placeholder.png' },
  capacity: 5,
  trailLength: 3,
  durationMinutes: 120,
  trailDifficulty: 'EASY', // valor padrão para testar makeExperience
  startDate: null,
  endDate: null,
  ...overrides,
});

describe('CartItem', () => {
  // Verifica se o título e o preço formatado aparecem corretamente
  it('renders title and formatted price', () => {
    renderWithProviders(<CartItem experience={makeExperience()} />); // Usa valor padrão easy

    expect(screen.getByText(/Experiência Teste/)).toBeInTheDocument();
    expect(screen.getByText(/R\$(?:\u00A0|\s)?120,00/)).toBeInTheDocument();
  });

  it('falls back to zero capacity when no value provided', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          capacity: null,
        })}
      />,
    );

    expect(screen.getByText(/0\s?pessoa(?:s)?/)).toBeInTheDocument();
  });

  it('formats in english when language does not start with pt', async () => {
    const originalLanguage = i18n.language;

    await act(async () => {
      await i18n.changeLanguage('en');
    });

    try {
      renderWithProviders(<CartItem experience={makeExperience()} />);

      expect(screen.getByText(/R\$(?:\u00A0|\s)?120\.00/)).toBeInTheDocument();
      expect(screen.getByText(/5\s?pessoas/)).toBeInTheDocument();
    } finally {
      await act(async () => {
        await i18n.changeLanguage(originalLanguage ?? 'pt');
      });
    }
  });

  // Testa interações: clique no card dispara onSelect e clique no ícone de lixeira dispara onRemove
  it('calls onSelect when card clicked and onRemove when trash clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onRemove = vi.fn();

    renderWithProviders(
      <CartItem experience={makeExperience()} onSelect={onSelect} onRemove={onRemove} />,
    );

    //encontra todos os elementos com a role "button"
    const allButtons = screen.getAllByRole('button');

    //  botão do card é o que tem o título da experiência como conteúdo
    const cardButton = allButtons.find((button) =>
      button.textContent.includes('Experiência Teste'),
    );

    // botão de remover é o que NÃO tem conteúdo de texto
    const removeBtn = allButtons.find((button) => button.textContent === '');

    // assegura que ambos os botões foram encontrados antes de prosseguir
    if (!cardButton || !removeBtn) {
      throw new Error('Não foi possível encontrar os botões necessários para o teste.');
    }

    // clica no card e verifica a chamada de onSelect
    await user.click(cardButton);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'exp-1' }));

    // Clica no botão de remover e verifica a chamada de onRemove
    await user.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith('exp-1');
  });

  // Verifica que linhas específicas de trilha aparecem (distância, duração, dificuldade)
  it('renders trail specific info when category is TRAIL', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.TRAIL,
          trailLength: 4,
          durationMinutes: 90,
          trailDifficulty: 'HEAVY',
        })}
      />,
    );

    expect(screen.getByText(/4\s?km/)).toBeInTheDocument();
    expect(screen.getByText(/1,5\s?h/)).toBeInTheDocument();
    expect(screen.getByText(/Difícil/)).toBeInTheDocument();
  });

  // Verifica exibição correta do rótulo de dificuldade da trilha
  it('renders trail difficulty label for MODERATED', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.TRAIL,
          trailDifficulty: 'MODERATED',
        })}
      />,
    );

    expect(screen.getByText(/Moderada/)).toBeInTheDocument();
  });

  it('renders trail difficulty label for LIGHT', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.TRAIL,
          trailDifficulty: 'LIGHT',
        })}
      />,
    );

    expect(screen.getByText(/Leve/)).toBeInTheDocument();
  });

  it('renders trail difficulty label for EXTREME', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.TRAIL,
          trailDifficulty: 'EXTREME',
        })}
      />,
    );

    expect(screen.getByText(/Extrema/)).toBeInTheDocument();
  });

  // Verifica que o rótulo de dificuldade não é exibido quando trailDifficulty é null
  it('does not render difficulty label when trailDifficulty is null', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.TRAIL,
          trailDifficulty: null, // Testando o caso nulo
        })}
      />,
    );

    // Usando queryByText pois ele retorna null se não encontrar ao invés de lançar um erro
    expect(screen.queryByText(/Fácil/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Moderada/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Difícil/)).not.toBeInTheDocument();
  });

  // Verifica exibição de datas quando a categoria é EVENT
  it('renders event date when category is EVENT', () => {
    const { container } = renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.EVENT,
          startDate: '2025-10-10',
          endDate: '2025-10-12',
        })}
      />,
    );

    // Verifica que as datas são renderizadas corretamente
    const expectedStartDate = formatDate('2025-10-10');
    const expectedEndDate = formatDate('2025-10-12');

    expect(container).toHaveTextContent(new RegExp(escapeRegex(expectedStartDate)));
    expect(container).toHaveTextContent(new RegExp(escapeRegex(expectedEndDate)));
  });

  // Verifica se um intervalo de datas é exibido corretamente
  it('renders a single event date if only startDate is provided', () => {
    const { container } = renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.EVENT,
          startDate: '2025-10-14', // Apenas uma data
          endDate: null,
        })}
      />,
    );

    // Verifica a data única renderizada corretamente
    const expectedStartDate = formatDate('2025-10-14');

    expect(container).toHaveTextContent(new RegExp(escapeRegex(expectedStartDate)));

    // Garante que não há um hífen de intervalo de datas
    expect(screen.queryByText('–')).not.toBeInTheDocument();
  });

  // Verifica se o preço é exibido como "R$ 0,00" quando o preço é null
  it('renders R$ 0,00 when price is null', () => {
    renderWithProviders(<CartItem experience={makeExperience({ price: null })} />);
    expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
  });

  // Verifica se a duração é exibida como "0h" quando durationMinutes é null
  it('does not render duration line when durationMinutes is null', () => {
    renderWithProviders(<CartItem experience={makeExperience({ durationMinutes: null })} />);
    expect(screen.queryByText(/0\s?h/)).not.toBeInTheDocument();
  });

  it('renders duration line when durationMinutes is zero', () => {
    renderWithProviders(
      <CartItem
        experience={makeExperience({
          durationMinutes: 0,
        })}
      />,
    );

    expect(screen.getByText(/0\s?h/)).toBeInTheDocument();
  });

  // Verifica se um único rótulo de data de evento é exibido quando apenas endDate é fornecido
  it('renders a single event date if only endDate is provided', () => {
    const { container } = renderWithProviders(
      <CartItem
        experience={makeExperience({
          category: ExperienceCategoryCard.EVENT,
          startDate: null,
          endDate: '2025-10-15',
        })}
      />,
    );

    // Verifica a data renderizada
    const expectedEndDate = formatDate('2025-10-15');

    expect(container).toHaveTextContent(new RegExp(escapeRegex(expectedEndDate)));
  });

  // Verifica se a imagem placeholder é usada quando a imagem da experiência é null
  it('uses placeholder image when experience image is null', () => {
    const { container } = renderWithProviders(
      <CartItem experience={makeExperience({ image: null })} />,
    );

    // Seleciona a tag <img> diretamente do DOM, sem depender da role
    const image = container.querySelector('img');

    // Verifica se a imagem foi encontrada antes de checar o src
    expect(image).toBeInTheDocument();
    expect(image?.src).toContain('/logo-pro-mata.png');
  });

  // Verifica se a linha de data não é renderizada quando as datas são nulas para um evento
  it('does not render the date line for an EVENT when dates are null', () => {
    const { container } = renderWithProviders(
      // Forçamos a categoria para "EVENT", mas mantemos as datas como null
      <CartItem experience={makeExperience({ category: ExperienceCategoryCard.EVENT })} />,
    );

    // Verifica que o ícone referente à data não está presente no documento
    const dateIcon = container.querySelector('[data-lucide="calendar-clock"]');

    expect(dateIcon).not.toBeInTheDocument();
  });

  it('does not call handlers when they are not provided', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CartItem experience={makeExperience()} />);

    const title = screen.getByText('Experiência Teste');
    const article = title.closest('article');
    const removeButton = screen.getAllByRole('button').find((button) => button.textContent === '');

    expect(article).not.toHaveAttribute('role', 'button');
    expect(removeButton).toBeDefined();

    if (article) {
      await user.click(article);
    }

    if (removeButton) {
      await user.click(removeButton);
    }
  });
});
