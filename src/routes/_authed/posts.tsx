import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { createPost, fetchPosts } from "../../utils/posts"

const postSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  body: z.string().min(1, {
    message: "Body is required.",
  }),
})

export const Route = createFileRoute("/_authed/posts")({
  loader: () => fetchPosts(),
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
    },
  })

  const handleCreatePost = async (values: z.infer<typeof postSchema>) => {
    setIsCreating(true)
    try {
      await createPost({ data: values })
      router.invalidate()
      form.reset()
    } catch (error) {
      console.error("Failed to create post:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="flex gap-4 p-4">
      <div className="w-1/3">
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-bold">Create New Post</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePost)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title..." {...field} />
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
                      <Textarea placeholder="Enter post content..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isCreating} className="w-full">
                {isCreating ? "Creating..." : "Create Post"}
              </Button>
            </form>
          </Form>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold">Posts ({posts.length})</h3>
          <ul className="list-disc pl-4">
            {posts.map((post) => {
              return (
                <li key={post.id} className="whitespace-nowrap">
                  <Link
                    to="/posts/$postId"
                    params={{
                      postId: post.id,
                    }}
                    className="block py-1 text-blue-800 hover:text-blue-600"
                    activeProps={{ className: "text-black font-bold" }}
                  >
                    <div>{post.title.substring(0, 30)}</div>
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
