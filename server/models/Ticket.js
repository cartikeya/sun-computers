// server/models/Ticket.js
const mongoose = require("mongoose");

// This is the strict blueprint. Every ticket MUST match this shape.
const ticketSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true // They cannot submit the form without a name
  },
  phone: { 
    type: String, 
    required: true 
  },
  deviceType: { 
    type: String, 
    required: true // e.g., "iPhone 13", "Lenovo Laptop"
  },
  issueDescription: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    default: "Pending" // When a new ticket is made, it automatically starts as "Pending"
  },
  createdAt: { 
    type: Date, 
    default: Date.now // Automatically stamps the exact time they clicked submit
  }
});

// We package this blueprint up so our waiter (server.js) can use it
module.exports = mongoose.model("Ticket", ticketSchema);