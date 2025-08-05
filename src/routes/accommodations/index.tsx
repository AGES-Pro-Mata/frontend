import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { AccommodationsPage } from '@/pages/AccommodationsPage'
import { accommodationService } from '@/services/accommodation.service'
import type { Accommodation, AccommodationFilters, AccommodationType } from '@/types/accommodation.types'

// Search params validation schema
const accommodationsSearchSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(12),
  search: z.string().optional(),
  type: z.enum(['hotel', 'apartment', 'house', 'room', 'hostel', 'resort', 'villa', 'cabin', 'other']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  capacity: z.number().min(1).optional(),
  amenities: z.string().optional(), // Comma-separated list
  available: z.boolean().optional(),
  sortBy: z.enum(['price', 'name', 'rating', 'capacity']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  checkIn: z.string().optional(), // ISO date string
  checkOut: z.string().optional(), // ISO date string
})

type AccommodationsSearch = z.infer<typeof accommodationsSearchSchema>

interface AccommodationsData {
  accommodations: Accommodation[]
  total: number
  page: number
  totalPages: number
  filters: AccommodationFilters
}

export const Route = createFileRoute('/accommodations/')({
  component: AccommodationsComponent,
  
  // Validate search params
  validateSearch: accommodationsSearchSchema,

  // Preload data
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
    filters: {
      search: search.search,
      type: search.type as AccommodationType | undefined,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      capacity: search.capacity,
      amenities: search.amenities?.split(',').filter(Boolean),
      available: search.available,
      checkIn: search.checkIn,
      checkOut: search.checkOut,
    },
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
  }),

  loader: async ({ deps }): Promise<AccommodationsData> => {
    try {
      const { page, limit, filters, sortBy, sortOrder } = deps
      
      // If search query exists, use search endpoint
      if (filters.search?.trim()) {
        const searchResults = await accommodationService.search(filters.search, {
          type: filters.type,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          capacity: filters.capacity,
          amenities: filters.amenities,
          available: filters.available,
        })

        // Apply sorting
        const sortedResults = sortResults(searchResults, sortBy, sortOrder)
        
        // Apply pagination
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedResults = sortedResults.slice(startIndex, endIndex)

        return {
          accommodations: paginatedResults,
          total: searchResults.length,
          page,
          totalPages: Math.ceil(searchResults.length / limit),
          filters,
        }
      }

      // Regular filtered listing
      const response = await accommodationService.getAll({
        page,
        limit,
        filters: {
          type: filters.type,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          capacity: filters.capacity,
          amenities: filters.amenities,
          available: filters.available,
        },
      })

      // Apply sorting if needed (API might handle this)
      const sortedAccommodations = sortResults(response.data, sortBy, sortOrder)

      return {
        accommodations: sortedAccommodations,
        total: response.pagination.total,
        page: response.pagination.page,
        totalPages: response.pagination.totalPages,
        filters,
      }
    } catch (error) {
      console.error('Failed to load accommodations:', error)
      throw new Error('Falha ao carregar acomodações')
    }
  },

  // Loading component
  pendingComponent: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
        </div>

        {/* Filter skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-muted animate-pulse rounded" />
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  // Error component
  errorComponent: ({ error, reset }) => (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Erro ao Carregar Acomodações</h1>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  ),

  // Meta information
  // Remove meta for now as it's not supported in this router version
  // meta: ({ loaderData }) => {
  //   const { accommodations, filters } = loaderData as AccommodationsData
  //   return [
  //     { title: 'Acomodações - Pro-Mata' },
  //     { 
  //       name: 'description', 
  //       content: `Encontre ${accommodations.length} acomodações em Mata Atlântica` 
  //     },
  //   ]
  // },
})

// Utility function for sorting
function sortResults(
  accommodations: Accommodation[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): Accommodation[] {
  return [...accommodations].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'capacity':
        aValue = a.capacity
        bValue = b.capacity
        break
      case 'rating':
        aValue = a.rating || 0
        bValue = b.rating || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}

function AccommodationsComponent() {
  const data = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  if (!data) {
    return <div>Loading...</div>
  }

  const handleSearchUpdate = (newSearch: any) => {
    navigate({
      search: (prev: any) => ({ ...(prev as any),
        ...prev,
        ...newSearch,
        page: 1, // Reset to first page on search
      }),
    })
  }

  return (
    <AccommodationsPage
      accommodations={data.accommodations}
      total={data.total}
      page={data.page}
      totalPages={data.totalPages}
      filters={data.filters}
      search={search as any}
      onSearchUpdate={handleSearchUpdate}
    />
  )
}