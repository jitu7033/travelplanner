import { createRating, getRating } from "../models/rating.models.js";
// save into rating table 
export const addRating = async (req, res) => {
  try {
    const {id} = req.params;
    const { name, rating, description } = req.body; // Fixed "descreption" typo to "description"
    const hotelId = id;
    console.log(name,rating,description);
    console.log(hotelId);

    if (!name || !rating || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure hotelId is a valid integer
    if (isNaN(hotelId)) {
      return res.status(400).json({ error: "Invalid hotel ID" });
    }
    // Add rating to the database
    await createRating(hotelId, name, rating, description);

    res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({
      error: "Internal server error while adding rating",
      details: error.message,
    });
  }
};

export const getAllRating = async(req,res) => {
  try{
    const {id} = req.params;
    const rating = await getRating(id);
    res.status(200).json(rating);
  }
  catch(error){
    res.status(500).json({error : "some internal error fetching the rating from the databases",error : error.message});
  }
}

