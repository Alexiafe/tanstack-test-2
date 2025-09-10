import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"

import {
  createArticle,
  deleteArticle,
  updateArticle,
  type Article,
  type CreateArticle,
  type UpdateArticle,
} from "../utils/articles"

export const useCreateArticle = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const _createArticle = useServerFn(createArticle)

  return useCallback(
    async (article: CreateArticle) => {
      try {
        const result = await _createArticle({ data: article })

        // Invalidate router and queries
        router.invalidate()
        queryClient.invalidateQueries({
          queryKey: ["articles"],
        })

        return result
      } catch (error) {
        console.error("Failed to create article:", error)
        throw error
      }
    },
    [router, queryClient, _createArticle]
  )
}

export const useUpdateArticle = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const _updateArticle = useServerFn(updateArticle)

  return useCallback(
    async (id: string, article: UpdateArticle) => {
      try {
        const result = await _updateArticle({ data: { id, data: article } })

        // Invalidate router and queries
        router.invalidate()
        queryClient.invalidateQueries({
          queryKey: ["articles"],
        })
        queryClient.invalidateQueries({
          queryKey: ["articles", id],
        })

        return result
      } catch (error) {
        console.error("Failed to update article:", error)
        throw error
      }
    },
    [router, queryClient, _updateArticle]
  )
}

export const useDeleteArticle = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const _deleteArticle = useServerFn(deleteArticle)

  return useCallback(
    async (id: string) => {
      try {
        const result = await _deleteArticle({ data: id })

        // Invalidate router and queries
        router.invalidate()
        queryClient.invalidateQueries({
          queryKey: ["articles"],
        })
        queryClient.removeQueries({
          queryKey: ["articles", id],
        })

        return result
      } catch (error) {
        console.error("Failed to delete article:", error)
        throw error
      }
    },
    [router, queryClient, _deleteArticle]
  )
}
