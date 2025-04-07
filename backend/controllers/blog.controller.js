import  { addBlog, addBlogImage, getAllBlogs } from "../models/blog.models.js"
// Add a new blog with images
export const addBlogController = async (req, res) => {
  try {
    const { username, name, location, content } = req.body;
    const files = req.files;

    // Validate input
    if (!username || !name || !location || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Add the blog
    const blogId = await addBlog(username, name, location, content);

    // Add images if provided
    if (files && files.length > 0) {
      for (const file of files) {
        const imageUrl = `/uploads/${file.filename}`;
        await addBlogImage(blogId, imageUrl);
      }
    }

    // Fetch the blog with images for response
    const blogs = await getAllBlogs();
    const newBlog = blogs.find(b => b.id === blogId);
    return res.status(201).json({
      message: 'Blog added successfully',
      data: newBlog,
    });
  } catch (error) {
    console.error('Error adding blog:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all blogs
export const getBlogsController = async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    return res.status(200).json({ data: blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};