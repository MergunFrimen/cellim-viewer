import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Mock data - would be fetched from backend
const MOCK_ENTRY = {
  id: "1",
  title: "Neuronal Cell Morphology",
  description: "Detailed visualization of neuronal cell structures",
  fullDescription: `
## Neuronal Cell Morphology Study

This entry represents a comprehensive visualization of neuronal cell structures, showcasing:

- Detailed neuronal network mapping
- Synaptic connection analysis
- Cellular compartment visualization
`,
  tags: ["Neuroscience", "Cell Morphology"],
  views: [
    {
      id: "view1",
      title: "Primary Neuronal Network",
      description: "Overview of the primary neuronal connections",
      type: "molviewspec",
    },
    {
      id: "view2",
      title: "Synaptic Detail",
      description: "Close-up of synaptic interactions",
      type: "volseg",
    },
  ],
};

export function EntryDetailsPage4() {
  const [activeView, setActiveView] = useState(MOCK_ENTRY.views[0]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{MOCK_ENTRY.title}</h1>
          <p className="text-muted-foreground mt-2">{MOCK_ENTRY.description}</p>
          <div className="flex space-x-4 mt-2">
            {MOCK_ENTRY.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Button variant="outline">
          <Share2 className="mr-2" size={16} /> Share
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Views List - Left Column */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_ENTRY.views.map((view) => (
                  <div
                    key={view.id}
                    className={`
                      border p-4 rounded-lg cursor-pointer transition-colors
                      ${activeView.id === view.id ? "bg-secondary border-primary" : "hover:bg-secondary/50"}
                    `}
                    onClick={() => setActiveView(view)}
                  >
                    <h3 className="font-semibold">{view.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {view.description}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {view.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization and Description - Right Column */}
        <div className="space-y-6">
          {/* Visualization Section */}
          <Card>
            <CardHeader>
              <CardTitle>{activeView.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                Visualization for "{activeView.title}" will be rendered here
              </div>
            </CardContent>
          </Card>

          {/* Description Section */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="p-6 max-h-[400px] overflow-y-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="scroll-m-20 text-lg font-semibold tracking-tight mb-2">
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="text-xs leading-6 text-foreground/90 mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-4 ml-6 list-disc text-xs text-foreground/90 [&>li]:mt-1.5">
                      {children}
                    </ul>
                  ),
                }}
              >
                {MOCK_ENTRY.fullDescription}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
