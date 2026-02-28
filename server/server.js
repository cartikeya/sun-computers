require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose"); 
const Ticket = require("./models/Ticket");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const cors = require("cors");


const app = express();

app.use(cors()); 
app.use(express.json());

// THE BOUNCER: Middleware to protect routes
const verifyToken = (req, res, next) => {
  // 1. Look for the token in the headers of the request
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied! No VIP Badge." });
  }

  try {
    // 2. The token usually looks like "Bearer eyJhbGciOi...", so we strip out the word "Bearer "
    const token = authHeader.replace("Bearer ", "");

    // 3. Verify the token using our secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. If it's valid, let them pass!
    req.user = verified;
    next(); 
  } catch (error) {
    res.status(400).json({ message: "Invalid VIP Badge!" });
  }
};


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected Successfully!"))
  .catch((err) => console.log("Database Connection Failed:", err));



app.get("/api/test", (req, res) => {
  res.json({ message: "The server is alive and listening!" });
});


// POST ROUTE: Receive a new repair request from the React frontend
app.post("/api/tickets", async (req, res) => {
  try {
    // 1. Grab the data the frontend sent us in the "body" of the request
    const { customerName, phone, deviceType, issueDescription } = req.body;

    // 2. Use our blueprint to build a new Ticket object
    const newTicket = new Ticket({
      customerName: customerName,
      phone: phone,
      deviceType: deviceType,
      issueDescription: issueDescription,
    });

    // 3. Save it permanently to MongoDB Atlas
    await newTicket.save();

    // 4. Send a success receipt back to the frontend (Status 201 means "Created")
    res.status(201).json({ 
      message: "Repair ticket submitted successfully!", 
      ticket: newTicket 
    });

  } catch (error) {
    // If something goes wrong (like missing a required field), catch the error so the server doesn't crash
    console.error("Error saving ticket:", error);
    res.status(500).json({ message: "Failed to submit ticket. Please try again." });
  }
});


// GET ROUTE: Fetch all repair tickets (PROTECTED BY BOUNCER)
app.get("/api/tickets", verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Failed to fetch tickets." });
  }
});
// PUT ROUTE: Update a ticket's status (PROTECTED BY BOUNCER)
app.put("/api/tickets/:id", verifyToken, async (req, res) => {
  try {
    // 1. Grab the new status from the frontend ("In Progress" or "Completed")
    const { status } = req.body;

    // 2. Ask MongoDB to find the ticket by its ID and update its status
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true } // This tells MongoDB to send us back the newly updated ticket
    );

    // 3. Send the updated ticket back to the frontend
    res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Failed to update ticket status." });
  }
});



// POST ROUTE: One-time setup to create the Admin account
app.post("/api/admin/setup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if an admin already exists (we only want one owner!)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Admin account already exists!" });
    }

    // 2. Scramble (Hash) the password. '10' is the security level.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user with the scrambled password
    const newAdmin = new User({
      email: email,
      password: hashedPassword
    });

    // 4. Save to database
    await newAdmin.save();
    res.status(201).json({ message: "Admin account created successfully!" });

  } catch (error) {
    console.error("Setup error:", error);
    res.status(500).json({ message: "Failed to create admin." });
  }
});

// POST ROUTE: Admin Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // 2. Compare the typed password with the scrambled one in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    // 3. Password is correct! Create the VIP Badge (JWT)
    // We sign it with our secret key so hackers can't fake it. It expires in 1 day.
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // 4. Send the badge back to the frontend
    res.status(200).json({ 
      message: "Login successful!", 
      token: token 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});