import { useState } from "react";

export function EntryDetailsPage() {
  const [entry, setEntry] = useState({
    id: "1",
    name: "Sample Entry",
    description: "# Detailed Description\n\nThis is a markdown description.",
    views: [
      {
        id: "view1",
        title: "Initial View",
        description: "First visualization of the dataset",
        molViewSpecState: "some-mol-view-spec-state",
        volsegLink: "/volseg/example",
      },
    ],
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{entry.name}</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="prose">
            {/* Markdown rendering would typically use a library like react-markdown */}
            <p>{entry.description}</p>
          </div>

          <h2 className="text-2xl mt-6 mb-4">Available Views</h2>
          <div className="space-y-4">
            {entry.views.map((view) => (
              <div key={view.id} className="border p-4 rounded">
                <h3 className="font-semibold">{view.title}</h3>
                <p className="text-gray-600 mb-2">{view.description}</p>
                <div className="flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-3 py-2 rounded"
                    onClick={() => {
                      /* Implement view loading logic */
                    }}
                  >
                    Load View
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-2 rounded"
                    onClick={() => {
                      /* Implement share link generation */
                    }}
                  >
                    Share Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          {/* Placeholder for visualization component */}
          <div className="h-96 flex items-center justify-center text-gray-500">
            Visualization Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
