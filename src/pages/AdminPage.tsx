import { useState } from "react";

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    name: "",
    description: "",
    isPublic: false,
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement actual authentication logic
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl mb-4">Create New Entry</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Entry Name"
              value={newEntry.name}
              onChange={(e) =>
                setNewEntry({ ...newEntry, name: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Description (Markdown supported)"
              value={newEntry.description}
              onChange={(e) =>
                setNewEntry({ ...newEntry, description: e.target.value })
              }
              className="w-full p-2 border rounded h-40"
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newEntry.isPublic}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, isPublic: e.target.checked })
                }
                className="mr-2"
              />
              Public Entry
            </label>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Create Entry
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl mb-4">Existing Entries</h2>
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{entry.name}</span>
                <div className="space-x-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
