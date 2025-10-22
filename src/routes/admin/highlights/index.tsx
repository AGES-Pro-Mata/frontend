import { createFileRoute } from "@tanstack/react-router";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { HighlightCategory } from "@/entities/highlights";
import {
  Bed,
  Calendar,
  Edit,
  FlaskConical,
  Images,
  Mountain,
  Trash2,
  Upload,
} from "lucide-react";
import { type ChangeEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useCreateHighlight,
  useDeleteHighlight,
  useFetchHighlightsByCategories,
  useUpdateHighlight,
} from "@/hooks/useHighlights";
import { appToast } from "@/components/toast/toast";
import { CanvasCard } from "@/components/card";
import { MoonLoader } from "react-spinners";

export const Route = createFileRoute("/admin/highlights/")({
  component: RouteComponent,
});

type HighlightImage = {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  order: number;
};

export function RouteComponent() {
  const [activeCategory, setActiveCategory] = useState<HighlightCategory>(
    HighlightCategory.LABORATORIO
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HighlightCategory>(
    HighlightCategory.LABORATORIO
  );
  const [editingImage, setEditingImage] = useState<HighlightImage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [highlightToDelete, setHighlightToDelete] =
    useState<HighlightImage | null>(null);

  const {
    data: highlightsData,
    isLoading,
    refetch,
  } = useFetchHighlightsByCategories();
  const createMutation = useCreateHighlight();
  const updateMutation = useUpdateHighlight();
  const deleteMutation = useDeleteHighlight();

  const highlights = highlightsData || {
    [HighlightCategory.LABORATORIO]: [],
    [HighlightCategory.QUARTO]: [],
    [HighlightCategory.EVENTO]: [],
    [HighlightCategory.TRILHA]: [],
    [HighlightCategory.CARROSSEL]: [],
  };

  const getCategoryInfo = (category: HighlightCategory) => {
    switch (category) {
      case HighlightCategory.LABORATORIO:
        return { icon: FlaskConical, label: "Laboratórios", maxImages: 3 };
      case HighlightCategory.QUARTO:
        return { icon: Bed, label: "Quartos", maxImages: 3 };
      case HighlightCategory.EVENTO:
        return { icon: Calendar, label: "Eventos", maxImages: 3 };
      case HighlightCategory.TRILHA:
        return { icon: Mountain, label: "Trilhas", maxImages: 3 };
      case HighlightCategory.CARROSSEL:
        return { icon: Images, label: "Carrossel", maxImages: 5 };
      default:
        return { icon: Images, label: "Destaques", maxImages: 3 };
    }
  };

  const handleOpenDialog = (
    category: HighlightCategory,
    image?: HighlightImage
  ) => {
    setSelectedCategory(category);
    if (image) {
      setEditingImage(image);
      setFormData({
        title: image.title,
        description: image.description || "",
        image: null,
      });
      setImagePreview(image.imageUrl);
    } else {
      setEditingImage(null);
      setFormData({ title: "", description: "", image: null });
      setImagePreview(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingImage(null);
    setFormData({ title: "", description: "", image: null });
    setImagePreview(null);
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      appToast.error("Por favor, selecione apenas arquivos de imagem");

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      appToast.error("Arquivo muito grande. Tamanho máximo: 10MB");

      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      setImagePreview(readerEvent.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!formData.title || (!editingImage && !formData.image)) {
      appToast.error("Preencha todos os campos obrigatórios");

      return;
    }

    if (editingImage) {
      // Atualizar imagem existente
      updateMutation.mutate(
        {
          id: editingImage.id,
          payload: {
            title: formData.title,
            description: formData.description,
            image: formData.image || undefined,
          },
        },
        {
          onSuccess: () => {
            appToast.success("Destaque atualizado com sucesso!");
            handleCloseDialog();
            void refetch();
          },
          onError: () => {
            appToast.error("Erro ao atualizar destaque");
          },
        }
      );
    } else {
      // Adicionar nova imagem
      if (!formData.image) return;

      createMutation.mutate(
        {
          category: selectedCategory,
          image: formData.image,
          title: formData.title,
          description: formData.description,
          order: highlights[selectedCategory].length + 1,
        },
        {
          onSuccess: () => {
            appToast.success("Destaque criado com sucesso!");
            handleCloseDialog();
            void refetch();
          },
          onError: () => {
            appToast.error("Erro ao criar destaque");
          },
        }
      );
    }
  };

  const handleRequestDelete = (image: HighlightImage) => {
    setHighlightToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setHighlightToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!highlightToDelete) {
      return;
    }

    deleteMutation.mutate(highlightToDelete.id, {
      onSuccess: () => {
        appToast.success("Destaque excluído com sucesso!");
        handleCloseDeleteDialog();
        void refetch();
      },
      onError: () => {
        appToast.error("Erro ao excluir destaque");
      },
    });
  };

  const renderCategoryContent = (category: HighlightCategory) => {
    const categoryInfo = getCategoryInfo(category);
    const Icon = categoryInfo.icon;
    const images = highlights[category];
    const canAddMore = images.length < categoryInfo.maxImages;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-contrast-green" />
            <div>
              <Typography variant="h3" className="text-xl font-semibold">
                {categoryInfo.label}
              </Typography>
              <Typography className="text-sm text-muted-foreground">
                {images.length} de {categoryInfo.maxImages} imagens
              </Typography>
            </div>
          </div>
          {canAddMore && (
            <Button
              onClick={() => handleOpenDialog(category)}
              className="bg-contrast-green hover:bg-contrast-green/90"
            >
              <Upload className="h-4 w-4 mr-2 text-white" />
              <Typography variant="body" className="text-white">
                Adicionar Imagem
              </Typography>
            </Button>
          )}
        </div>

        {images.length === 0 ? (
          <CanvasCard className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Icon className="h-16 w-16 text-gray-300 mb-4" />
              <Typography className="text-lg font-medium text-gray-500">
                Nenhuma imagem adicionada
              </Typography>
              <Typography className="text-sm text-gray-400 mb-4">
                Adicione até {categoryInfo.maxImages} imagens de destaque
              </Typography>
              <Button
                onClick={() => handleOpenDialog(category)}
                variant="outline"
                className="border-contrast-green text-contrast-green hover:bg-contrast-green/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                <Typography variant="body">
                  Adicionar Primeira Imagem
                </Typography>
              </Button>
            </CardContent>
          </CanvasCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <CanvasCard key={image.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={() => handleOpenDialog(category, image)}
                    >
                      <Edit className="h-4 w-4 text-contrast-green" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={() => handleRequestDelete(image)}
                    >
                      <Trash2 className="h-4 w-4 text-contrast-green" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <Typography variant="h4" className="text-base font-semibold">
                    {image.title}
                  </Typography>
                  {image.description && (
                    <Typography className="text-sm text-muted-foreground mt-1">
                      {image.description}
                    </Typography>
                  )}
                </CardHeader>
              </CanvasCard>
            ))}
          </div>
        )}
      </div>
    );
  };

  const categories = [
    {
      value: HighlightCategory.LABORATORIO,
      icon: FlaskConical,
      label: "Laboratórios",
    },
    { value: HighlightCategory.QUARTO, icon: Bed, label: "Quartos" },
    { value: HighlightCategory.EVENTO, icon: Calendar, label: "Eventos" },
    { value: HighlightCategory.TRILHA, icon: Mountain, label: "Trilhas" },
    { value: HighlightCategory.CARROSSEL, icon: Images, label: "Carrossel" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Typography className="text-lg text-muted-foreground">
          Carregando destaques...
        </Typography>
        <MoonLoader color="#000" size={20} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 gap-6">
      <div>
        <Typography
          variant="h2"
          className="text-2xl font-bold text-main-dark-green"
        >
          Gerenciar Destaques
        </Typography>
        <Typography className="text-muted-foreground mt-1">
          Configure as imagens de destaque para cada categoria e o carrossel da
          página inicial
        </Typography>
      </div>

      {/* Category Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {categories.map(({ value, icon: Icon, label }) => (
          <Button
            key={value}
            variant={activeCategory === value ? "default" : "outline"}
            className={cn(
              "flex items-center gap-2",
              activeCategory === value
                ? "bg-contrast-green hover:bg-contrast-green/90 text-white border border-transparent"
                : "hover:bg-gray-100"
            )}
            onClick={() => setActiveCategory(value)}
          >
            <Icon className="h-4 w-4" />
            <Typography
              variant="body"
              className={cn(
                "transition-colors",
                activeCategory === value ? "text-white" : "text-foreground"
              )}
            >
              {label}
            </Typography>
          </Button>
        ))}
      </div>

      {/* Category Content */}
      <div className="mt-4">{renderCategoryContent(activeCategory)}</div>

      <Dialog
        open={isDialogOpen}
  onOpenChange={(open: boolean) => {
          if (!open) {
            handleCloseDialog();
          } else {
            setIsDialogOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <Typography variant="h3" className="text-lg font-semibold">
              {editingImage ? "Editar" : "Adicionar"} Imagem de Destaque
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              {getCategoryInfo(selectedCategory).label} - Imagem para página
              inicial
            </Typography>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Typography className="text-sm font-medium">Imagem *</Typography>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload-dialog"
                />
                <label
                  htmlFor="image-upload-dialog"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-contrast-green" />
                      <Typography className="text-sm font-medium">
                        Clique para selecionar uma imagem
                      </Typography>
                    </>
                  )}
                </label>
                <Typography className="text-xs text-muted-foreground mt-2">
                  Formatos: .PNG, .JPG, .JPEG (máx. 10MB)
                </Typography>
              </div>
            </div>

            <div className="space-y-2">
              <Typography className="text-sm font-medium">Título *</Typography>
              <Input
                id="title"
                placeholder="Digite o título da imagem"
                value={formData.title}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Typography className="text-sm font-medium">
                Descrição (opcional)
              </Typography>
              <Textarea
                id="description"
                placeholder="Digite uma descrição para a imagem"
                value={formData.description}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleCloseDialog}>
              <Typography variant="body">Cancelar</Typography>
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.title ||
                (!editingImage && !formData.image) ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="bg-contrast-green hover:bg-contrast-green/90"
            >
              <Typography variant="body" className="text-white">
                {editingImage ? "Salvar" : "Adicionar"}
              </Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleCloseDeleteDialog();
          } else {
            setIsDeleteDialogOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <Typography variant="h3" className="text-lg font-semibold">
              Confirmar exclusão
            </Typography>
            <Typography className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir o destaque{" "}
              <span className="font-semibold">
                {highlightToDelete?.title ?? "selecionado"}
              </span>
              ?
            </Typography>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={handleCloseDeleteDialog}
              disabled={deleteMutation.isPending}
            >
              <Typography variant="body">Cancelar</Typography>
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="bg-default-red hover:bg-default-red/90"
              disabled={deleteMutation.isPending}
            >
              <Typography variant="body" className="text-white">
                Excluir
              </Typography>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
