import { useState } from "react";
import { Link } from "react-router-dom";

export function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState([
    // Placeholder entries - would be replaced with actual API call
    {
      id: "1",
      name: "Sample Entry 1",
      description: "A fascinating biological sample",
    },
    {
      id: "2",
      name: "Sample Entry 2",
      description: "Another intriguing dataset",
    },
  ]);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">CELLIM View Entries</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{entry.name}</h2>
            <p className="text-gray-600">{entry.description}</p>
            <Link
              to={`/entry/${entry.id}`}
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
