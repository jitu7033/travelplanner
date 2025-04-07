import pool from "../config/db.js";

// Add a new blog
export const addBlog = async (userName, name, content, location) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO blogs (username, name, content, created_at, location) VALUES (?, ?, ?, NOW(), ?)",
      [userName, name, content, location]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
};

// Add an image for a blog
export const addBlogImage = async (blog_id, image_url) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO blog_images (blog_id, image_url) VALUES (?, ?)",
      [blog_id, image_url]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error adding blog image:', error);
    throw error;
  }
};

// Get all blogs with their images
export const getAllBlogs = async () => {
  try {
    const [blogs] = await pool.query("SELECT * FROM blogs");
    const blogData = await Promise.all(
      blogs.map(async (blog) => {
        const [images] = await pool.query('SELECT * FROM blog_images WHERE blog_id = ?', [blog.id]);
        return {
          ...blog,
          images: images.map(img => img.image_url),
        };
      })
    );
    return blogData;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};