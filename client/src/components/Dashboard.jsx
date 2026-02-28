import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Grab the VIP badge from the browser's memory
    const token = localStorage.getItem("token");

    // 2. If they don't have a badge, kick them out to the login page
    if (!token) {
      navigate("/login");
      return;
    }

    // 3. If they have a badge, ask the server for the tickets
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/tickets", {
          headers: {
            Authorization: `Bearer ${token}`, // Show the badge to the Bouncer
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTickets(data); // Save the tickets to our React state
        } else {
          // If the token is expired or fake, clear it and kick them out
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      }
    };

    fetchTickets();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Rip up the VIP badge
    navigate("/login"); // Send back to login
  };
  // Function to update the status in the database and the UI
  const updateStatus = async (ticketId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5001/api/tickets/${ticketId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Show the VIP badge
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        // If the database updated successfully, update our local React state instantly
        setTickets(
          tickets.map((ticket) =>
            ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket,
          ),
        );
      } else {
        alert("Failed to update status. Please log in again.");
      }
    } catch (error) {
      alert("Cannot connect to server.");
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Repair Tickets
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold transition shadow"
          >
            Logout
          </button>
        </div>

        {error && <p className="text-red-500 font-bold mb-4">{error}</p>}

        {/* The Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Device</th>
                <th className="p-4 font-semibold">Issue</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-slate-500 font-semibold italic"
                  >
                    No repair tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-4 text-sm text-slate-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {ticket.customerName}
                    </td>
                    <td className="p-4 text-blue-600 font-medium">
                      {ticket.phone}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {ticket.deviceType}
                    </td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                      {ticket.issueDescription}
                    </td>
                    <td className="p-4">
                      <select
                        value={ticket.status}
                        onChange={(e) =>
                          updateStatus(ticket._id, e.target.value)
                        }
                        className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider cursor-pointer outline-none border-none
                        ${ticket.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${ticket.status === "In Progress" ? "bg-blue-100 text-blue-800" : ""}
                        ${ticket.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                      `}    
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
