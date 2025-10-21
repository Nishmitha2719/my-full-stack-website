import { useState } from 'react'
import { Plus, X } from 'lucide-react'; // Example of using a popular icon library

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header/Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          {/* Logo/Brand */}
          <div className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            Health<span className="text-gray-800">Care</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150">Appointments</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150">Records</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600 transition duration-150">Profile</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 md:hidden text-gray-600 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition duration-150"
          >
            {isMenuOpen ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg pb-2">
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150">Dashboard</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150">Appointments</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150">Records</a>
            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150">Profile</a>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
          Welcome to Your Health Dashboard
        </h1>

        {/* Sample Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Appointments */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upcoming Appointments</h2>
            <p className="text-3xl font-bold text-indigo-600">3</p>
            <p className="text-sm text-gray-500 mt-1">Check your schedule now.</p>
          </div>

          {/* Card 2: Messages */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-teal-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Unread Messages</h2>
            <p className="text-3xl font-bold text-teal-600">5</p>
            <p className="text-sm text-gray-500 mt-1">Respond to your doctor.</p>
          </div>

          {/* Card 3: Prescriptions */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-pink-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Active Prescriptions</h2>
            <p className="text-3xl font-bold text-pink-600">2</p>
            <p className="text-sm text-gray-500 mt-1">Refill soon.</p>
          </div>

          {/* Card 4: Health Score */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-yellow-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Overall Health Score</h2>
            <p className="text-3xl font-bold text-yellow-600">92%</p>
            <p className="text-sm text-gray-500 mt-1">Excellent progress this month.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App