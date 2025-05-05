// 1. setup the
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const express = require("express");

const Hotel = require("./model/hotel.model");

const app = express();
app.use(express.json());
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Connect to database

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);

    console.log("Successfully connected to the database ");
  } catch (error) {
    console.log("Not able to connect to server");
  }
};

connect();

//show all the hotels

// 1. Try to check all the data from the database for the hotel

const findAllHotel = async () => {
  try {
    const findHotel = await Hotel.find();
    return findHotel;
  } catch (error) {
    console.log("unable to find the data from the database", Error);
  }
};

// 2. create a route to show to the frontent

app.get("/hotels", async (req, res) => {
  try {
    const getHotels = await findAllHotel();

    if (getHotels.length !== 0) {
      res.json(getHotels);
    } else {
      res.status(400).json({ error: "Unable to find the hotels" });
    }
  } catch (error) {
    res.status(400).json({ error: "Unable to get the data" });
  }
});

//Post to add the hotel

app.post("/hotels", async (req, res) => {
  try {
    const newHotel = new Hotel(req.body);
    await newHotel.save();
    res
      .status(201)
      .json({ message: "Hotel added sucessfully", hotel: newHotel });
  } catch (error) {
    console.log("Error Saving Hotel", error.message);
    res.status(500).json({ error: "Failed to add hotel" });
  }
});

//Server

// get througHotelNAme

const findHotelName = async (hotelName) => {
  try {
    const findHotel = await Hotel.find({ name: hotelName });

    return findHotel;
  } catch (error) {
    console.log(error.message);
  }
};

// delete APi

const deleteHotel = async (deleteid) => {
  try {
    const findHotel = await Hotel.findByIdAndDelete(deleteid);
    return findHotel;
  } catch (error) {
    console.log(error.message);
  }
};

app.delete("/hotels/:hotelid", async (req, res) => {
  try {
    const hotelToDelete = await deleteHotel(req.params.hotelid);
    if (hotelToDelete) {
      res
        .status(201)
        .json({ Message: "Sucessfully Done", deleted: hotelToDelete });
    } else {
      res.status(404).json({ error: "Not found the data" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

// Create a route to show the data to frontent

app.get("/hotels/hotelName/:hotelName", async (req, res) => {
  try {
    const getHotel = await findHotelName(req.params.hotelName);

    if (getHotel.length !== 0) {
      res.json(getHotel);
    } else {
      res.status(404).json({ error: "Unable to find the hotel with Name" });
    }
  } catch (error) {
    res.status(404).json({ error: "Unable to fetch the data" });
  }
});

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`You have connected to ${PORT}`);
// });

// to show the phone Number

// const findPhoneNumber = async (number) => {
//   try {
//     const phoneNumber = await Hotel.find({ phoneNumber: number });
//     return phoneNumber;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// app.get("/hotels/phoneNumber/:phoneNumber", async (req, res) => {
//   try {
//     const getPhoneNumber = await findPhoneNumber(req.params.phoneNumber);

//     if (getPhoneNumber !== 0) {
//       res.json(getPhoneNumber);
//     } else {
//       res.status(404).json({ error: "not able to find the phone Number" });
//     }
//   } catch (error) {
//     res
//       .status(404)
//       .json({ error: "unable to find the phone Number, you have passed" });
//   }
// });

// // get the hotel Rating

// const findHotelRating = async (hotelRating) => {
//   try {
//     const findRating = await Hotel.find({ rating: hotelRating });
//     return findRating;
//   } catch (error) {
//     console.log(
//       "Unable to find the rating data in the database",
//       error.message
//     );
//   }
// };

// // Know show to the frontend

// app.get("/hotels/rating/:hotelRating", async (req, res) => {
//   try {
//     const getRating = await findHotelRating(req.params.hotelRating);

//     if (getRating.length !== 0) {
//       res.json(getRating);
//     } else {
//       res.status(404).json({ error: "No data found" });
//     }
//   } catch (error) {
//     res.status(400).json({ error: "Not able to get the hotelRating " });
//   }
// });

// // find the hotelCategory

// const findHotelCategory = async (name) => {
//   try {
//     const findCategory = await Hotel.find({ category: name });
//     return findCategory;
//   } catch (error) {
//     console.log("Unable to find the data in the database");
//   }
// };

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const getCategory = await findHotelCategory(req.params.hotelCategory);

    if (getCategory.length !== 0) {
      res.json(getCategory);
    } else {
      res.status(404).json({ error: "Not able to get the category" });
    }
  } catch (error) {
    req.status(404).json({ error: "Unable to find the hotelCatgory" });
  }
});

// Update the cuisine by their ID

const updateCuisineData = async (restuarantId, updateCuisine) => {
  try {
    const updateCuisineValue = await Hotel.findByIdAndUpdate(
      restuarantId,
      updateCuisine,
      { new: true }
    );

    return updateCuisineValue;
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/restaurant/:restaurantId", async (req, res) => {
  try {
    const updatedData = await updateCuisineData(
      req.params.restaurantId,
      req.body
    );
    if (updatedData) {
      res.status(201).json({
        message: "sucessfully updated",
        showupdatedValue: updatedData,
      });
    } else {
      res.status(404).json({ error: "Unable to updated the data" });
    }
  } catch (error) {
    res.status(404).json({ error: "Something is wrong with the API" });
  }
});

const updateHotel = async (hotelId, updatedHotel) => {
  try {
    const updateHotelValue = await Hotel.findByIdAndUpdate(
      hotelId,
      updatedHotel,
      { new: true }
    );

    return updateHotelValue;
  } catch (error) {
    console.log(error.message);
  }
};

app.post("/hotel/:hotelId", async (req, res) => {
  try {
    // 1 we trying to grab the id from route and updated the passed data on body
    console.log("Request Body", req.body);
    const updateHotelValue = await updateHotel(req.params.hotelId, req.body);

    if (updateHotelValue) {
      res.status(200).json({
        message: "Sucessfully Updated",
        updatedValue: updateHotelValue,
      });
    } else {
      res.status(404).json({ error: "Unable to update the Hotel " });
    }
  } catch (error) {
    res.status(404).json({ error: "Something in the wrong in Route" });
  }
});
