import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Database } from "database.types"
import { z } from "zod"

import { getSupabaseServerClient } from "./supabase"

// Zod schemas for validation
export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
})

export const CreateArticleSchema = ArticleSchema.omit({
  id: true,
})

export const UpdateArticleSchema = CreateArticleSchema.partial()

// TypeScript types derived from schemas
export type Article = z.infer<typeof ArticleSchema>
export type CreateArticle = z.infer<typeof CreateArticleSchema>
export type UpdateArticle = z.infer<typeof UpdateArticleSchema>

// Database type
export type ArticleType = Database["public"]["Tables"]["articles"]["Row"]

// Server functions
export const fetchArticle = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: articleId }) => {
    const supabase = getSupabaseServerClient()

    const { data: article, error } = await supabase.from("articles").select("*").eq("id", articleId).single()

    if (error) {
      console.error("Error fetching article:", error)
      if (error.code === "PGRST116") {
        throw notFound()
      }
      throw new Error(`Failed to fetch article: ${error.message}`)
    }

    if (!article) {
      throw notFound()
    }

    return article as ArticleType
  })

export const fetchArticles = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient()

  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching articles:", error)
    throw new Error(`Failed to fetch articles: ${error.message}`)
  }

  return articles as ArticleType[]
})

export const createArticle = createServerFn({ method: "POST" })
  .validator(CreateArticleSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    const { data: article, error } = await supabase
      .from("articles")
      .insert({
        ...data,
        author_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating article:", error)
      throw new Error(`Failed to create article: ${error.message}`)
    }

    return article as ArticleType
  })

export const updateArticle = createServerFn({ method: "POST" })
  .validator((d: { id: string; data: UpdateArticle }) => d)
  .handler(async ({ data: { id, data: updateData } }) => {
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    const { data: article, error } = await supabase
      .from("articles")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("author_id", user.id) // Ensure user can only update their own articles
      .select()
      .single()

    if (error) {
      console.error("Error updating article:", error)
      throw new Error(`Failed to update article: ${error.message}`)
    }

    return article as ArticleType
  })

export const deleteArticle = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async ({ data: articleId }) => {
    const supabase = getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Error getting user:", userError)
      throw new Error("User not authenticated")
    }

    const { error } = await supabase.from("articles").delete().eq("id", articleId).eq("author_id", user.id) // Ensure user can only delete their own articles

    if (error) {
      console.error("Error deleting article:", error)
      throw new Error(`Failed to delete article: ${error.message}`)
    }

    return { success: true }
  })
