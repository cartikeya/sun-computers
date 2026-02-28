import { useState } from "react";

const LandingPage = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    deviceType: "",
    issueDescription: "",
  });

  // State for showing a success message
  const [statusMessage, setStatusMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the form to your backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("Sending...");

    try {
      const response = await fetch("https://sun-computers.onrender.com/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusMessage("✅ Request sent! We will contact you shortly.");
        setFormData({
          customerName: "",
          phone: "",
          deviceType: "",
          issueDescription: "",
        }); // Clear form
      } else {
        setStatusMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatusMessage("❌ Cannot connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* NAVBAR */}
      {/* NAVBAR */}
      <nav className="bg-slate-900 text-white p-4 shadow-md flex justify-between items-center">
        {/* Brand Section with Logo */}
        <div className="flex items-center space-x-3">
          {/* Change "shop-logo.png" to match whatever you named your file in the public folder */}
          <img
            src="https://yt3.googleusercontent.com/ZF9cS8CRrhkraXxQ3NqGm5BgZs5QzU5NDDl-1tYm71ozk779thrmdwy4yMpEYhg31iAFhDWhSf8=s160-c-k-c0x00ffffff-no-rj"
            alt="Shop Logo"
            className="h-16 w-auto rounded-md object-contain"
          />
          {/* The name hides on super small screens so the logo and button fit perfectly */}
          <h1 className="text-xl font-bold tracking-wider hidden sm:block">
            Sun Computers - VIZAG
          </h1>
        </div>

        {/* CTA Button */}
        <a
          href="#quote"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-semibold transition"
        >
          Get a Quote
        </a>
      </nav>
      {/* HERO SECTION */}
      <header className="text-center py-20 px-4">
        <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 mb-6 tracking-tight">
          Fast, Reliable Device Repair.
        </h2>
        <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          From shattered screens to dead motherboards, we bring your tech back
          to life. Watch us work below.
        </p>
        <a
          href="#quote"
          className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out"
        >
          Book Your Repair Now
        </a>
      </header>

      {/* SOCIAL PROOF (YOUTUBE SHORTS GRID) */}
      <section className="py-16 bg-white px-4">
        <h3 className="text-3xl font-bold text-center mb-10">
          Don't just take our word for it.
        </h3>
        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {/* YouTube Short 1 */}
          <div className="w-64 h-[455px] bg-slate-200 rounded-xl overflow-hidden shadow-lg border border-slate-300 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/FRj8NKaegU4"
              title="YouTube Short 1"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          {/* YouTube Short 2 */}
          <div className="w-64 h-[455px] bg-slate-200 rounded-xl overflow-hidden shadow-lg border border-slate-300 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Fbf0ocBqSo0"
              title="YouTube Short 2"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          {/* YouTube Short 3 */}
          <div className="w-64 h-[455px] bg-slate-200 rounded-xl overflow-hidden shadow-lg border border-slate-300 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-in-out">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/CupBO2K3Mk4"
              title="YouTube Short 3"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* THE QUOTE FORM */}
      <section id="quote" className="py-20 px-4 bg-slate-100">
        <div className="max-w-xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Request a Free Estimate
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Device Model
              </label>
              <input
                type="text"
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. iPhone 13 Pro, Lenovo ThinkPad"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                What's the issue?
              </label>
              <textarea
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Screen is cracked and touch isn't working..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Submit Request
            </button>
          </form>

          {statusMessage && (
            <div className="mt-4 p-3 text-center rounded-lg font-semibold bg-green-100 text-green-800">
              {statusMessage}
            </div>
          )}
        </div>
      </section>

      {/* LOCATION & FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 text-center border-t-4 border-blue-500">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-4">
          <h3 className="text-2xl font-bold text-white tracking-wide">
            Visit Our Shop
          </h3>

          <div className="flex items-center space-x-2 text-lg md:text-xl font-medium bg-slate-800 py-3 px-6 rounded-lg shadow-inner">
            <span>📍</span>
            <p>Opp to Budhil Park, Dwarakanagar 1st Lane, Visakhapatnam</p>
          </div>

          <div className="flex space-x-4 mt-4">
            <p>🕒 Mon - Sat: 10:00 AM - 8:00 PM</p>
          </div>

          <p className="text-sm mt-8 border-t border-slate-700 pt-8 w-full text-slate-500">
            &copy; 2026 Sun computers - VIZAG. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
