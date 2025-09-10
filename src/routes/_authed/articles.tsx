import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useCreateArticle } from "../../hooks/useArticle"
import { fetchArticles } from "../../utils/articles"

const articleSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  body: z.string().min(1, {
    message: "Body is required.",
  }),
})

export const Route = createFileRoute("/_authed/articles")({
  loader: () => fetchArticles(),
  component: ArticlesComponent,
})

function ArticlesComponent() {
  const articles = Route.useLoaderData()
  const createArticle = useCreateArticle()
  const [isCreating, setIsCreating] = useState(false)

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  })

  const handleCreateArticle = async (values: z.infer<typeof articleSchema>) => {
    setIsCreating(true)
    try {
      await createArticle(values)
      form.reset()
    } catch (error) {
      console.error("Failed to create article:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex gap-4 p-4">
      <div className="w-1/3">
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-bold">Create New Article</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateArticle)} className="space-y-4">
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
                      <Textarea placeholder="Enter article content..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? "Creating..." : "Create Article"}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Articles ({articles.length})</h3>
          <ul className="list-disc pl-4">
            {articles.map((article) => {
              return (
                <li key={article.id} className="whitespace-nowrap">
                  <Link
                    to="/articles/$articleId"
                    params={{
                      articleId: article.id,
                    }}
                    className="block py-1 text-blue-800 hover:text-blue-600"
                    activeProps={{ className: "text-black font-bold" }}
                  >
                    <div>{article.title.substring(0, 30)}</div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
