import useSWRInfinite from 'swr/infinite'
import { useEffect } from 'react'
import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual'

export interface InfiniteVirtualOptions<Data, Item> {
  getKey: (pageIndex: number, prev: Data | null) => string | null
  fetcher: (url: string) => Promise<Data>
  extractItems: (pageData: Data) => Item[]
  estimateSize?: () => number
  overscan?: number
}

export interface InfiniteVirtualResult<Item> {
  items: Item[]
  virtualItems: VirtualItem[]
  totalSize: number
  isLoading: boolean
  hasNextPage: boolean
  loadMore: () => void
  mutate: () => void
}

export function useInfiniteVirtual<Data extends { page: number; total_pages: number }, Item>(
  options: InfiniteVirtualOptions<Data, Item>
): InfiniteVirtualResult<Item> {
  const { getKey, fetcher, extractItems, estimateSize = () => 180, overscan = 1 } = options

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite<Data>(
    getKey,
    fetcher,
    { revalidateFirstPage: false }
  )

  const items: Item[] = data ? data.flatMap(extractItems) : []
  const lastPage = data?.[data.length - 1] ?? null
  const hasNextPage = Boolean(lastPage && lastPage.page < lastPage.total_pages)

  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? items.length + 1 : items.length,
    estimateSize,
    overscan,
  })
  const virtualItems = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  useEffect(() => {
    const lastVisible = virtualItems.find(v => v.index === items.length - 1)
    if (hasNextPage && lastVisible && !isValidating) {
      setSize(size + 1)
    }
  }, [virtualItems, hasNextPage, isValidating, setSize, size, items.length])

  return {
    items,
    virtualItems,
    totalSize,
    isLoading: isValidating,
    hasNextPage,
    loadMore: () => setSize(size + 1),
    mutate,
  }
}