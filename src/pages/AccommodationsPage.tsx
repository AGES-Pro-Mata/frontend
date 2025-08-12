import { useMemo, useState } from 'react'
import { Car, Coffee, Filter, Grid, List, MapPin, Search, Star, Users, Wifi } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PaginationWrapper } from '@/components/ui/pagination-wrapper'

import { ACCOMMODATION_TYPES, accommodationHelpers } from '@/services/accommodation.service'
import type { 
  Accommodation, 
  AccommodationFilters,
  AccommodationType 
} from '@/types/accommodation.types'

interface AccommodationsPageProps {
  accommodations: Accommodation[]
  total: number
  page: number
  totalPages: number
  filters: AccommodationFilters
  search: {
    page: number
    limit: number
    search?: string
    type?: AccommodationType
    minPrice?: number
    maxPrice?: number
    capacity?: number
    amenities?: string
    available?: boolean
    sortBy: string
    sortOrder: string
    checkIn?: string
    checkOut?: string
  }
  onSearchUpdate: (updates: any) => void
}

const AMENITY_OPTIONS = [
  { value: 'Wi-Fi', label: 'Wi-Fi', icon: Wifi },
  { value: 'Ar Condicionado', label: 'Ar Condicionado', icon: Coffee },
  { value: 'Estacionamento', label: 'Estacionamento', icon: Car },
  { value: 'TV', label: 'TV', icon: Coffee },
  { value: 'Frigobar', label: 'Frigobar', icon: Coffee },
  { value: 'Varanda', label: 'Varanda', icon: Coffee },
]

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Nome (A-Z)', sortBy: 'name', sortOrder: 'asc' },
  { value: 'name-desc', label: 'Nome (Z-A)', sortBy: 'name', sortOrder: 'desc' },
  { value: 'price-asc', label: 'Menor Preço', sortBy: 'price', sortOrder: 'asc' },
  { value: 'price-desc', label: 'Maior Preço', sortBy: 'price', sortOrder: 'desc' },
  { value: 'rating-desc', label: 'Melhor Avaliação', sortBy: 'rating', sortOrder: 'desc' },
  { value: 'capacity-asc', label: 'Menor Capacidade', sortBy: 'capacity', sortOrder: 'asc' },
  { value: 'capacity-desc', label: 'Maior Capacidade', sortBy: 'capacity', sortOrder: 'desc' },
]

export function AccommodationsPage({
  accommodations,
  total,
  page,
  totalPages,
  search,
  onSearchUpdate,
}: AccommodationsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [localFilters, setLocalFilters] = useState({
    search: search.search || '',
    type: search.type || '',
    minPrice: search.minPrice || 0,
    maxPrice: search.maxPrice || 1000,
    capacity: search.capacity || 1,
    amenities: search.amenities?.split(',').filter(Boolean) || [],
    available: search.available ?? true,
  })

  // Current sort option
  const currentSort = useMemo(() => {
    const sortKey = `${search.sortBy}-${search.sortOrder}`

    return SORT_OPTIONS.find(option => option.value === sortKey) || SORT_OPTIONS[0]
  }, [search.sortBy, search.sortOrder])

  // Apply filters
  const handleApplyFilters = () => {
    onSearchUpdate({
      search: localFilters.search || undefined,
      type: localFilters.type || undefined,
      minPrice: localFilters.minPrice > 0 ? localFilters.minPrice : undefined,
      maxPrice: localFilters.maxPrice < 1000 ? localFilters.maxPrice : undefined,
      capacity: localFilters.capacity > 1 ? localFilters.capacity : undefined,
      amenities: localFilters.amenities.length > 0 ? localFilters.amenities.join(',') : undefined,
      available: localFilters.available,
      page: 1, // Reset to first page
    })
  }

  // Clear filters
  const handleClearFilters = () => {
    setLocalFilters({
      search: '',
      type: '',
      minPrice: 0,
      maxPrice: 1000,
      capacity: 1,
      amenities: [],
      available: true,
    })
    onSearchUpdate({
      search: undefined,
      type: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      capacity: undefined,
      amenities: undefined,
      available: true,
      page: 1,
    })
  }

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    const option = SORT_OPTIONS.find(o => o.value === sortValue)

    if (option) {
      onSearchUpdate({
        sortBy: option.sortBy,
        sortOrder: option.sortOrder,
      })
    }
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    onSearchUpdate({ page: newPage })
  }

  // Filter panel component
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nome da acomodação..."
            value={localFilters.search}
            onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      {/* Type filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Acomodação</label>
        <Select value={localFilters.type} onValueChange={(value) => setLocalFilters({ ...localFilters, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os tipos</SelectItem>
            {ACCOMMODATION_TYPES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Faixa de Preço</label>
        <div className="px-2">
          <Slider
            value={[localFilters.minPrice, localFilters.maxPrice]}
            onValueChange={([min, max]) => setLocalFilters({ ...localFilters, minPrice: min, maxPrice: max })}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>R$ {localFilters.minPrice}</span>
            <span>R$ {localFilters.maxPrice}</span>
          </div>
        </div>
      </div>

      {/* Capacity */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Capacidade Mínima</label>
        <Select 
          value={localFilters.capacity.toString()} 
          onValueChange={(value) => setLocalFilters({ ...localFilters, capacity: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} {num === 1 ? 'pessoa' : 'pessoas'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Amenities */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Comodidades</label>
        <div className="space-y-2">
          {AMENITY_OPTIONS.map((amenity) => {
            const Icon = amenity.icon

            return (
              <div key={amenity.value} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.value}
                  checked={localFilters.amenities.includes(amenity.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setLocalFilters({
                        ...localFilters,
                        amenities: [...localFilters.amenities, amenity.value]
                      })
                    } else {
                      setLocalFilters({
                        ...localFilters,
                        amenities: localFilters.amenities.filter(a => a !== amenity.value)
                      })
                    }
                  }}
                />
                <label htmlFor={amenity.value} className="flex items-center space-x-2 text-sm">
                  <Icon className="h-4 w-4" />
                  <span>{amenity.label}</span>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={localFilters.available}
          onCheckedChange={(checked) => setLocalFilters({ ...localFilters, available: !!checked })}
        />
        <label htmlFor="available" className="text-sm">Apenas disponíveis</label>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Aplicar Filtros
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="w-full">
          Limpar Filtros
        </Button>
      </div>
    </div>
  )

  // Accommodation card component
  const AccommodationCard = ({ accommodation }: { accommodation: Accommodation }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={accommodationHelpers.getImageUrl(accommodation)}
          alt={accommodation.name}
          className="w-full h-48 object-cover"
        />
        {!accommodation.available && (
          <Badge className="absolute top-2 right-2" variant="destructive">
            Indisponível
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{accommodation.name}</h3>
          {accommodation.rating && (
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span className="text-sm">{accommodation.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {accommodation.description}
        </p>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {ACCOMMODATION_TYPES.find(t => t.value === accommodation.type)?.label || accommodation.type}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{accommodation.capacity}</span>
            </div>
          </div>

          {accommodation.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {accommodation.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {accommodation.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{accommodation.amenities.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <div className="flex justify-between items-center w-full">
          <div>
            <span className="text-2xl font-bold text-primary">
              {accommodationHelpers.formatPrice(accommodation.price)}
            </span>
            <span className="text-sm text-muted-foreground">/noite</span>
          </div>
          <Button>Ver Detalhes</Button>
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Acomodações</h1>
        <p className="text-muted-foreground">
          Descubra as melhores acomodações do Centro Pro-Mata
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <Card className="p-6 sticky top-6">
            <h2 className="font-semibold mb-4">Filtros</h2>
            <FilterPanel />
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Mobile Filters & Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Results count */}
              <p className="text-sm text-muted-foreground">
                {total} {total === 1 ? 'acomodação encontrada' : 'acomodações encontradas'}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Sort */}
              <Select value={currentSort.value} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Accommodations Grid/List */}
          {accommodations.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {accommodations.map((accommodation) => (
                <AccommodationCard 
                  key={accommodation.id} 
                  accommodation={accommodation} 
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma acomodação encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar os filtros para encontrar mais opções
              </p>
              <Button onClick={handleClearFilters} variant="outline">
                Limpar Filtros
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <PaginationWrapper
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}