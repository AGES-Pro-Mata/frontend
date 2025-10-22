import { act, fireEvent, render, screen } from "@testing-library/react";
import { type ButtonHTMLAttributes, type ComponentType, type ReactNode } from "react";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { HighlightCategory } from "@/entities/highlights";

type RouteModule = {
  Route: { component: ComponentType };
  RouteComponent?: ComponentType;
};

type HighlightRecord = {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  order: number;
};

const fetchHighlightsMock = vi.fn();
const createHighlightMock = vi.fn();
const updateHighlightMock = vi.fn();
const deleteHighlightMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();
const cnMock = vi.fn((...classes: unknown[]) => classes.filter(Boolean).join(" "));

const confirmMock = vi.fn();
const alertMock = vi.fn();

class MockFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsDataURL(file: File) {
    this.result = `data:${file.name}`;

    if (this.onload) {
      const event = {
        target: { result: this.result },
      } as unknown as ProgressEvent<FileReader>;

      this.onload(event);
    }
  }
}

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: { component: ComponentType }) => config,
  lazyRouteComponent: () => () => null,
}));

vi.mock("@/components/ui/button", () => {
  type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: string;
    size?: string;
    asChild?: boolean;
  };

  const Button = ({ children, asChild, type, disabled, onClick, ...rest }: Props) => {
    if (asChild) {
      throw new Error("asChild is not supported in this test mock");
    }

    return (
      <button
        type={type ?? "button"}
        aria-disabled={disabled ?? undefined}
        data-disabled={disabled ? "true" : undefined}
        onClick={(event) => onClick?.(event)}
        {...rest}
      >
        {children}
      </button>
    );
  };

  return { Button };
});

const passthrough = () =>
  ({ children, ...rest }: { children?: ReactNode } & Record<string, unknown>) => (
    <div {...rest}>{children}</div>
  );

vi.mock("@/components/ui/card", () => ({
  CardContent: passthrough(),
  CardHeader: passthrough(),
}));

vi.mock("@/components/cards", () => ({
  CanvasCard: passthrough(),
}));

vi.mock("@/components/typography", () => ({
  Typography: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
}));

vi.mock("@/components/ui/dialog", () => {
  const Dialog = ({
    open,
    onOpenChange,
    children,
    ...rest
  }: {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  } & Record<string, unknown>) => (
    <div data-open={open} {...rest}>
      <button
        type="button"
        data-testid="dialog-open-toggle"
        style={{ display: "none" }}
        onClick={() => onOpenChange?.(true)}
      />
      <button
        type="button"
        data-testid="dialog-close-toggle"
        style={{ display: "none" }}
        onClick={() => onOpenChange?.(false)}
      />
      {(open ?? false) ? <div>{children}</div> : null}
    </div>
  );

  const DialogContent = ({ children }: { children?: ReactNode }) => (
    <div data-testid="dialog-content-wrapper">{children}</div>
  );
  const DialogHeader = ({ children }: { children?: ReactNode }) => (
    <header>{children}</header>
  );
  const DialogFooter = ({ children }: { children?: ReactNode }) => (
    <footer>{children}</footer>
  );

  return { Dialog, DialogContent, DialogHeader, DialogFooter };
});

vi.mock("@/components/ui/input", () => ({
  Input: (props: Record<string, unknown>) => <input {...props} />,
}));

vi.mock("@/components/ui/textarea", () => ({
  Textarea: (props: Record<string, unknown>) => <input {...props} />,
}));

vi.mock("@/components/toast/toast", () => ({
  appToast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock("@/lib/utils", () => ({
  cn: (...classes: unknown[]) => cnMock(...classes),
}));

vi.mock("@/hooks/useHighlights", () => ({
  useFetchHighlightsByCategories: fetchHighlightsMock,
  useCreateHighlight: createHighlightMock,
  useUpdateHighlight: updateHighlightMock,
  useDeleteHighlight: deleteHighlightMock,
}));

vi.mock("react-spinners", () => ({
  MoonLoader: () => <div role="status">loading</div>,
}));

const createHiddenIcon = () =>
  ({ ...rest }: Record<string, unknown>) => <span {...rest} aria-hidden={true} />;
const createNamedIcon = (label: string) =>
  ({ ...rest }: Record<string, unknown>) => <span {...rest} role="img" aria-label={label} />;

vi.mock("lucide-react", () => ({
  Bed: createHiddenIcon(),
  Calendar: createHiddenIcon(),
  Edit: createNamedIcon("Edit"),
  FlaskConical: createHiddenIcon(),
  Images: createHiddenIcon(),
  Mountain: createHiddenIcon(),
  Trash2: createNamedIcon("Delete"),
  Upload: createHiddenIcon(),
}));

const originalConfirm = window.confirm;
const originalAlert = window.alert;
const originalFileReader = window.FileReader;

beforeAll(() => {
  window.confirm = confirmMock as typeof window.confirm;
  window.alert = alertMock as typeof window.alert;
  window.FileReader = MockFileReader as typeof FileReader;
});

afterAll(() => {
  window.confirm = originalConfirm;
  window.alert = originalAlert;
  window.FileReader = originalFileReader;
});

function createHighlightItem(overrides?: Partial<HighlightRecord>): HighlightRecord {
  return {
    id: "highlight-1",
    title: "Default title",
    description: "Default description",
    imageUrl: "https://example.com/image.png",
    order: 1,
    ...overrides,
  };
}

function buildFetchResponse(
  dataOverrides: Partial<Record<HighlightCategory, HighlightRecord[]>> = {},
  refetch: () => void = vi.fn()
) {
  return {
    isLoading: false,
    refetch,
    data: {
      [HighlightCategory.LABORATORIO]: [],
      [HighlightCategory.QUARTO]: [],
      [HighlightCategory.EVENTO]: [],
      [HighlightCategory.TRILHA]: [],
      [HighlightCategory.CARROSSEL]: [],
      ...dataOverrides,
    },
  };
}

function buildMutations() {
  const createMutation = { mutate: vi.fn(), isPending: false };
  const updateMutation = { mutate: vi.fn(), isPending: false };
  const deleteMutation = { mutate: vi.fn(), isPending: false };

  createHighlightMock.mockReturnValue(createMutation);
  updateHighlightMock.mockReturnValue(updateMutation);
  deleteHighlightMock.mockReturnValue(deleteMutation);

  return { createMutation, updateMutation, deleteMutation };
}

describe("Admin Highlights Route", () => {
  let Component: ComponentType;

  beforeEach(async () => {
    fetchHighlightsMock.mockReset();
    createHighlightMock.mockReset();
    updateHighlightMock.mockReset();
    deleteHighlightMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    confirmMock.mockReset();
    alertMock.mockReset();

    const routeModule = (await import("@/routes/admin/highlights/index")) as unknown as RouteModule;

    Component = routeModule.RouteComponent ?? routeModule.Route.component;

    if (typeof Component !== "function") {
      throw new Error("Expected admin highlights route component to be a function");
    }
  });

  it("creates a new highlight and reports feedback", () => {
    const refetch = vi.fn();
    const dataset = buildFetchResponse(
      {
        [HighlightCategory.LABORATORIO]: [
          createHighlightItem({ id: "lab-1", title: "Laboratório 1", order: 1 }),
          createHighlightItem({ id: "lab-2", title: "Laboratório 2", order: 2 }),
          createHighlightItem({ id: "lab-3", title: "Laboratório 3", order: 3 }),
        ],
      },
      refetch
    );

    fetchHighlightsMock.mockReturnValue(dataset);

    const { createMutation } = buildMutations();

    render(<Component />);

    expect(fetchHighlightsMock).toHaveBeenCalled();

    expect(
      screen.queryByRole("button", { name: /Adicionar Imagem/i })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));

    const addImageTrigger = screen.getByRole("button", {
      name: /Adicionar Primeira Imagem/i,
    });

    fireEvent.click(addImageTrigger);

    const uploadedFile = new File(["content"], "room.png", {
      type: "image/png",
    });

    Object.defineProperty(uploadedFile, "size", { value: 1024 });

    const fileInput = screen.getByLabelText(
      /Clique para selecionar uma imagem/i
    );

    fireEvent.change(fileInput, { target: { files: [uploadedFile] } });

    const titleInput = screen.getByPlaceholderText(
      "Digite o título da imagem"
    );

    fireEvent.change(titleInput, { target: { value: "Novo Quarto" } });

    const descriptionInput = screen.getByPlaceholderText(
      "Digite uma descrição para a imagem"
    );

    fireEvent.change(descriptionInput, {
      target: { value: "Vista incrível" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Adicionar$/i }));

    expect(createMutation.mutate).toHaveBeenCalledTimes(1);

    const call = createMutation.mutate.mock.calls[0];

    if (!call) {
      throw new Error("Expected create mutation to have been invoked");
    }

    const [payload, options] = call as [
      {
        category: HighlightCategory;
        image: File;
        title: string;
        description: string;
        order: number;
      },
      { onSuccess?: () => void; onError?: () => void }
    ];

    expect(payload.category).toBe(HighlightCategory.QUARTO);
    expect(payload.title).toBe("Novo Quarto");
    expect(payload.description).toBe("Vista incrível");
    expect(payload.image).toBe(uploadedFile);
    expect(payload.order).toBe(1);

    act(() => {
      options.onError?.();
    });
    expect(toastErrorMock).toHaveBeenCalledWith("Erro ao criar destaque");

    act(() => {
      options.onSuccess?.();
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Destaque criado com sucesso!");
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("validates required fields before submitting", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.QUARTO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    const { createMutation } = buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const addButton = screen.getByRole("button", { name: /Adicionar$/i });

    expect(addButton).toHaveAttribute("data-disabled", "true");
    expect(toastErrorMock).not.toHaveBeenCalled();
    expect(createMutation.mutate).not.toHaveBeenCalled();
  });

  it("rejects invalid or oversized files", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.QUARTO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);

    const invalidFile = new File(["text"], "document.txt", { type: "text/plain" });

    Object.defineProperty(invalidFile, "size", { value: 512 });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(toastErrorMock).toHaveBeenCalledWith(
      "Por favor, selecione apenas arquivos de imagem"
    );

    toastErrorMock.mockClear();

    const largeFile = new File(["binary"], "large.png", { type: "image/png" });

    Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(toastErrorMock).toHaveBeenCalledWith(
      "Arquivo muito grande. Tamanho máximo: 10MB"
    );
  });

  it("ignores image upload when no file is selected", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.QUARTO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    const { createMutation } = buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);

    fireEvent.change(fileInput, { target: { files: [] } });

    expect(toastErrorMock).not.toHaveBeenCalled();
    expect(createMutation.mutate).not.toHaveBeenCalled();
  });

  it("prevents submitting a new highlight without an image", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.EVENTO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    const { createMutation } = buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Eventos/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const titleInput = screen.getByPlaceholderText("Digite o título da imagem");
    const descriptionInput = screen.getByPlaceholderText(
      "Digite uma descrição para a imagem"
    );

    fireEvent.change(titleInput, { target: { value: "Evento Sem Foto" } });
    fireEvent.change(descriptionInput, { target: { value: "Descrição" } });

    toastErrorMock.mockClear();
    const addButton = screen.getByRole("button", { name: /Adicionar$/i });

  expect(addButton).toHaveAttribute("data-disabled", "true");

  addButton.removeAttribute("data-disabled");
    fireEvent.click(addButton);

    expect(toastErrorMock).toHaveBeenCalledWith(
      "Preencha todos os campos obrigatórios"
    );
    expect(createMutation.mutate).not.toHaveBeenCalled();
  });

  it("updates an existing highlight", () => {
    const refetch = vi.fn();
    const dataset = buildFetchResponse(
      {
        [HighlightCategory.LABORATORIO]: [
          createHighlightItem({
            id: "lab-10",
            title: "Lab Atual",
            description: "Descrição atual",
            order: 1,
          }),
        ],
      },
      refetch
    );

    fetchHighlightsMock.mockReturnValue(dataset);

    const { updateMutation } = buildMutations();

    render(<Component />);

    expect(screen.getByText("Descrição atual")).toBeInTheDocument();

    const editButton = screen.getByRole("button", { name: /Edit/i });

    fireEvent.click(editButton);

    const titleInput = screen.getByPlaceholderText("Digite o título da imagem");

    expect(titleInput).toHaveValue("Lab Atual");
    fireEvent.change(titleInput, { target: { value: "Lab Atualizado" } });

    const descriptionInput = screen.getByPlaceholderText("Digite uma descrição para a imagem");

    fireEvent.change(descriptionInput, { target: { value: "Nova descrição" } });

     
    const fileInput = document.querySelector<HTMLInputElement>(
      'input[type="file"][id="image-upload-dialog"]'
    );

    expect(fileInput).not.toBeNull();

    const newImage = new File(["content"], "updated.png", { type: "image/png" });

    Object.defineProperty(newImage, "size", { value: 1024 });
    fireEvent.change(fileInput!, { target: { files: [newImage] } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(updateMutation.mutate).toHaveBeenCalledTimes(1);

    const call = updateMutation.mutate.mock.calls[0];

    if (!call) {
      throw new Error("Expected update mutation to have been invoked");
    }

    const [payload, options] = call as [
      {
        id: string;
        payload: { title: string; description: string; image?: File };
      },
      { onSuccess?: () => void; onError?: () => void }
    ];

    expect(payload.id).toBe("lab-10");
    expect(payload.payload.title).toBe("Lab Atualizado");
    expect(payload.payload.description).toBe("Nova descrição");
    expect(payload.payload.image).toBe(newImage);

    act(() => {
      options.onError?.();
    });
    expect(toastErrorMock).toHaveBeenCalledWith("Erro ao atualizar destaque");

    act(() => {
      options.onSuccess?.();
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Destaque atualizado com sucesso!");
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("deletes highlights when confirmed", () => {
    const refetch = vi.fn();
    const dataset = buildFetchResponse(
      {
        [HighlightCategory.LABORATORIO]: [
          createHighlightItem({ id: "lab-20", title: "Para remover", order: 1 }),
        ],
      },
      refetch
    );

    fetchHighlightsMock.mockReturnValue(dataset);

    const { deleteMutation } = buildMutations();

    render(<Component />);

    const deleteButton = screen.getByRole("button", { name: /Delete/i });

    fireEvent.click(deleteButton);
    expect(deleteMutation.mutate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(deleteMutation.mutate).not.toHaveBeenCalled();

    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));
    expect(deleteMutation.mutate).toHaveBeenCalledTimes(1);

    const call = deleteMutation.mutate.mock.calls[0];

    if (!call) {
      throw new Error("Expected delete mutation to have been invoked");
    }

    const [id, options] = call as [
      string,
      { onSuccess?: () => void; onError?: () => void }
    ];

    expect(id).toBe("lab-20");

    act(() => {
      options.onError?.();
    });
    expect(toastErrorMock).toHaveBeenCalledWith("Erro ao excluir destaque");

    act(() => {
      options.onSuccess?.();
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Destaque excluído com sucesso!");
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("does not delete when dialog opens without a selected highlight", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.LABORATORIO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    const { deleteMutation } = buildMutations();

    render(<Component />);

    const dialogOpenButtons = screen.getAllByTestId("dialog-open-toggle");

    const deleteDialogOpenToggle = dialogOpenButtons[1];

    fireEvent.click(deleteDialogOpenToggle);

    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));

    expect(deleteMutation.mutate).not.toHaveBeenCalled();
  });

  it("resets dialog state when cancelled", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.QUARTO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const file = new File(["content"], "preview.png", { type: "image/png" });

    Object.defineProperty(file, "size", { value: 2048 });

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);

    fireEvent.change(fileInput, { target: { files: [file] } });

    const titleInput = screen.getByPlaceholderText("Digite o título da imagem");

    fireEvent.change(titleInput, { target: { value: "Cancelar" } });

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));

    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const reopenedTitleInput = screen.getByPlaceholderText("Digite o título da imagem");

    expect(reopenedTitleInput).toHaveValue("");
  });

  it("responds to dialog open change callbacks", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.QUARTO]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));

    const dialogOpenButtons = screen.getAllByTestId("dialog-open-toggle");
    const dialogCloseButtons = screen.getAllByTestId("dialog-close-toggle");

    const createOpenToggle = dialogOpenButtons[0];
    const createCloseToggle = dialogCloseButtons[0];

    fireEvent.click(createOpenToggle);
    fireEvent.click(createCloseToggle);

    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Primeira Imagem/i })
    );

    const dialogTitleInput = screen.getByPlaceholderText(
      "Digite o título da imagem"
    );

    expect(dialogTitleInput).toHaveValue("");

    fireEvent.click(createCloseToggle);

    fireEvent.click(createOpenToggle);

    const reopenedInput = screen.getByPlaceholderText(
      "Digite o título da imagem"
    );

    expect(reopenedInput).toHaveValue("");
  });

  it("renders a loading indicator while highlights are loading", () => {
    fetchHighlightsMock.mockReturnValue({
      isLoading: true,
      refetch: vi.fn(),
      data: undefined,
    });

    buildMutations();

    render(<Component />);

    expect(screen.getByText(/Carregando destaques/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("falls back to default highlight buckets when data is missing", () => {
    const refetch = vi.fn();

    fetchHighlightsMock.mockReturnValue({
      isLoading: false,
      refetch,
      data: undefined,
    });

    const { createMutation } = buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Trilhas/i }));

    fireEvent.click(screen.getByRole("button", { name: /Adicionar Primeira Imagem/i }));

  const titleInput = screen.getByPlaceholderText("Digite o título da imagem");

  fireEvent.change(titleInput, { target: { value: "Nova trilha" } });

  const descriptionInput = screen.getByPlaceholderText("Digite uma descrição para a imagem");

  fireEvent.change(descriptionInput, { target: { value: "Descrição" } });

    const fileInput = screen.getByLabelText(/Clique para selecionar uma imagem/i);
  const file = new File(["content"], "trail.png", { type: "image/png" });

  Object.defineProperty(file, "size", { value: 1024 });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Adicionar$/i }));

    expect(createMutation.mutate).toHaveBeenCalledWith(
      expect.objectContaining({ category: HighlightCategory.TRILHA }),
      expect.any(Object)
    );
  });

  it("displays details for trilha and carrossel categories", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.TRILHA]: [],
      [HighlightCategory.CARROSSEL]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Trilhas/i }));
    expect(screen.getByText(/Nenhuma imagem adicionada/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Carrossel/i }));
    expect(screen.getByText(/5 imagens de destaque/)).toBeInTheDocument();
  });

  it("opens the add dialog from the toolbar action", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.QUARTO]: [
        createHighlightItem({ id: "room-1", title: "Quarto 1", order: 1 }),
      ],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Quartos/i }));

    fireEvent.click(screen.getByRole("button", { name: /^Adicionar Imagem$/i }));

    const dialogInput = screen.getByPlaceholderText("Digite o título da imagem");

    expect(dialogInput).toHaveValue("");
  });

  it("falls back to generic category info when category identifiers drift", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.CARROSSEL]: [],
    });

    fetchHighlightsMock.mockReturnValue(dataset);
    buildMutations();

    const originalValue = HighlightCategory.CARROSSEL;

    render(<Component />);

    (HighlightCategory as Record<string, string>).CARROSSEL = "CAROUSEL-MISMATCH" as HighlightCategory;

    try {
      fireEvent.click(screen.getByRole("button", { name: /Carrossel/i }));
      expect(screen.getByText("Destaques")).toBeInTheDocument();
    } finally {
      (HighlightCategory as Record<string, string>).CARROSSEL = originalValue;
    }
  });

  it("prefills empty description when editing a highlight without description", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.LABORATORIO]: [
        createHighlightItem({
          id: "lab-empty",
          title: "Sem descrição",
          description: undefined,
          order: 1,
        }),
      ],
    });

    fetchHighlightsMock.mockReturnValue(dataset);
    buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    const descriptionInput = screen.getByPlaceholderText(
      "Digite uma descrição para a imagem"
    );

    expect(descriptionInput).toHaveValue("");
  });

  it("updates an existing highlight without a new image", () => {
    const refetch = vi.fn();
    const dataset = buildFetchResponse(
      {
        [HighlightCategory.LABORATORIO]: [
          createHighlightItem({
            id: "lab-edit",
            title: "Laboratório",
            description: "Atual",
            order: 1,
          }),
        ],
      },
      refetch
    );

    fetchHighlightsMock.mockReturnValue(dataset);

    const { updateMutation } = buildMutations();

    render(<Component />);

    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

  const titleInput = screen.getByPlaceholderText("Digite o título da imagem");

  fireEvent.change(titleInput, { target: { value: "Laboratório Atualizado" } });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));

    expect(updateMutation.mutate).toHaveBeenCalledTimes(1);

    const [payload] = updateMutation.mutate.mock.calls[0] as [
      { payload: { image?: File | undefined } }
    ];

    expect(payload.payload.image).toBeUndefined();
  });

  it("opens and closes the delete dialog via open change handler", () => {
    const dataset = buildFetchResponse({
      [HighlightCategory.LABORATORIO]: [createHighlightItem()],
    });

    fetchHighlightsMock.mockReturnValue(dataset);

    const { deleteMutation } = buildMutations();

    render(<Component />);

  const deleteButton = screen.getByRole("button", { name: /Delete/i });

  fireEvent.click(deleteButton);

    const deleteOpenToggle = screen.getAllByTestId("dialog-open-toggle")[1];
    const deleteCloseToggle = screen.getAllByTestId("dialog-close-toggle")[1];

    fireEvent.click(deleteOpenToggle);
    expect(screen.getByText(/Confirmar exclusão/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Excluir/i }));
    expect(deleteMutation.mutate).toHaveBeenCalledTimes(1);

    fireEvent.click(deleteCloseToggle);
    expect(screen.queryByText(/Confirmar exclusão/)).not.toBeInTheDocument();
  });
});
