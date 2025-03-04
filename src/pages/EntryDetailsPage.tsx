import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, Info, Share2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

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

export function EntryDetailsPage() {
  const [activeView, setActiveView] = useState(MOCK_ENTRY.views[0]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{MOCK_ENTRY.title}</h1>
          <p className="text-muted-foreground mt-2">{MOCK_ENTRY.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share2 className="mr-2" size={16} /> Share
          </Button>
          <Button>
            <Copy className="mr-2" size={16} /> Copy Link
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        {MOCK_ENTRY.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">
            <Info className="mr-2" size={16} /> Description
          </TabsTrigger>
          <TabsTrigger value="views">
            <Eye className="mr-2" size={16} /> Available Views
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <Eye className="mr-2" size={16} /> Visualization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card>
            <CardContent className="p-6">
              <ReactMarkdown>{MOCK_ENTRY.fullDescription}</ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Available Visualization Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_ENTRY.views.map((view) => (
                  <div
                    key={view.id}
                    className={`
                      border p-4 rounded-lg cursor-pointer 
                      ${activeView.id === view.id ? "bg-secondary" : "hover:bg-secondary/50"}
                    `}
                    onClick={() => setActiveView(view)}
                  >
                    <h3 className="font-semibold">{view.title}</h3>
                    <p className="text-muted-foreground">{view.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {view.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          <Card>
            <CardContent className="p-6 flex justify-center items-center min-h-[500px]">
              <div className="text-center text-muted-foreground">
                Visualization for {activeView.title} will be rendered here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
