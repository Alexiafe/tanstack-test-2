# Supabase Posts Setup

This guide will help you set up the posts functionality with Supabase.

## Database Setup

1. **Run the migration**: Execute the SQL migration file to create the posts table:

   ```sql
   -- Run this in your Supabase SQL editor
   -- File: supabase/migrations/001_create_posts_table.sql
   ```

2. **Environment Variables**: Make sure your `.env` file contains:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Features

### Posts Table

- **id**: UUID primary key
- **title**: Post title (required)
- **body**: Post content (required)
- **user_id**: References auth.users(id) with CASCADE delete
- **created_at**: Timestamp with timezone
- **updated_at**: Timestamp with timezone

### Row Level Security (RLS)

- Users can only view, create, update, and delete their own posts
- All operations are automatically filtered by the authenticated user's ID

### API Functions

- `fetchPosts()`: Get all posts for the authenticated user
- `fetchPost(id)`: Get a specific post by ID
- `createPost({ title, body })`: Create a new post

## Testing

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to `/posts`** after logging in

3. **Create new posts**: Use the form to create your own posts

4. **View posts**: Click on any post title to view the full post content

## Notes

- All posts are user-specific due to RLS policies
- The posts are ordered by creation date (newest first)
- The UI includes a form for creating new posts with validation
- Error handling is included for database operations
