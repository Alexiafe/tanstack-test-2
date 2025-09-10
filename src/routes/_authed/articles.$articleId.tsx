import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, ErrorComponent } from "@tanstack/react-router"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { NotFound } from "~/components/NotFound"
import { useDeleteArticle, useUpdateArticle } from "~/hooks/useArticle"
import { fetchArticle } from "~/utils/articles"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const updateArticleSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  body: z.string().min(1, {
    message: "Body is required.",
  }),
})

export const Route = createFileRoute("/_authed/articles/$articleId")({
  loader: ({ params: { articleId } }) => fetchArticle({ data: articleId }),
  errorComponent: ArticleErrorComponent,
  component: ArticleComponent,
  notFoundComponent: () => {
    return <NotFound>Article not found</NotFound>
  },
})

function ArticleErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function ArticleComponent() {
  const article = Route.useLoaderData()
  const updateArticle = useUpdateArticle()
  const deleteArticle = useDeleteArticle()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const form = useForm<z.infer<typeof updateArticleSchema>>({
    resolver: zodResolver(updateArticleSchema),
    defaultValues: {
      title: article.title,
      body: article.body,
    },
  })

  const handleUpdateArticle = async (values: z.infer<typeof updateArticleSchema>) => {
    setIsUpdating(true)
    try {
      await updateArticle(article.id, values)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update article:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteArticle = async () => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteArticle(article.id)
    } catch (error) {
      console.error("Failed to delete article:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Article</h2>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false)
              form.reset()
            }}
          >
            Cancel
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateArticle)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter article content..." rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update Article"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{article.title}</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
          <Button variant="destructive" onClick={handleDeleteArticle} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xl font-bold underline">{article.title}</h4>
        <div className="text-sm">{article.body}</div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Created: {new Date(article.created_at || "").toLocaleDateString()}</p>
        {article.updated_at && article.updated_at !== article.created_at && (
          <p>Updated: {new Date(article.updated_at).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  )
}
