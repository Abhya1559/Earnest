import Link from "next/link";

export default function Hero() {
  return (
    <main className="min-h-screen bg-linear-to-br from-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Manage Your Tasks <br />
          <span className="text-blue-400">Smart & Fast</span>
        </h1>

        <p className="text-gray-300 max-w-xl mb-8 text-lg">
          Organize your work, track progress, and boost productivity with our
          modern task management platform.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-blue-500 px-6 py-3 rounded font-semibold hover:bg-blue-600 transition"
          >
            Get Started
          </Link>

          <Link
            href="/register"
            className="border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-black transition"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-950 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose TaskManager?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">🔐 Secure Login</h3>

              <p className="text-gray-400">
                JWT authentication with refresh tokens keeps your data safe.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">
                📋 Smart Task Management
              </h3>

              <p className="text-gray-400">
                Create, update, filter, and search tasks effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition">
              <h3 className="text-xl font-semibold mb-2">
                📱 Fully Responsive
              </h3>

              <p className="text-gray-400">
                Works perfectly on mobile, tablet, and desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Organizing Today 🚀
        </h2>

        <p className="text-gray-300 mb-8">
          Join thousands of users boosting productivity.
        </p>

        <Link
          href="/register"
          className="bg-green-500 px-8 py-3 rounded text-lg font-semibold hover:bg-green-600 transition"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-center text-gray-400">
        © {new Date().getFullYear()} TaskManager — Built by Abhya 💙
      </footer>
    </main>
  );
}
