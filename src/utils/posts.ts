import { notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { Database } from "database.types"

import { getSupabaseServerClient } from "./supabase"

export type PostType = Database["public"]["Tables"]["posts"]["Row"]

export const fetchPost = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async ({ data: postId }) => {
    const supabase = getSupabaseServerClient()

    const { data: post, error } = await supabase.from("posts").select("*").eq("id", postId).single()

    if (error) {
      console.error("Error fetching post:", error)
      if (error.code === "PGRST116") {
        throw notFound()
      }
      throw new Error(`Failed to fetch post: ${error.message}`)
    }

    if (!post) {
      throw notFound()
    }

    return post as PostType
  })

export const fetchPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient()

  const { data: posts, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
    throw new Error(`Failed to fetch posts: ${error.message}`)
  }

  return posts as PostType[]
})

export const createPost = createServerFn({ method: "POST" })
  .validator((d: { title: string; body: string }) => d)
  .handler(async ({ data: { title, body } }) => {
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

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title,
        body,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating post:", error)
      throw new Error(`Failed to create post: ${error.message}`)
    }

    return post as PostType
  })
