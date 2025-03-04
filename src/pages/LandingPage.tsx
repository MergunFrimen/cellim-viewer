import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, ImageIcon, Link as LinkIcon } from "lucide-react";

// Mock data - in real app, this would come from backend
const MOCK_ENTRIES = [
  {
    id: "1",
    title: "Neuronal Cell Morphology",
    description: "Detailed visualization of neuronal cell structures",
    tags: ["Neuroscience", "Cell Morphology"],
  },
  {
    id: "2",
    title: "Mitochondrial Network",
    description: "Complex interactions within mitochondrial networks",
    tags: ["Cell Biology", "Mitochondria"],
  },
];

export function LandingPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to CELLIM View</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore cutting-edge cellular visualization and research data from the
          CELLIM research group.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {MOCK_ENTRIES.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription>{entry.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <ImageIcon className="w-full h-48" />
              </div>
              <div className="flex justify-between">
                <Button variant="default" asChild>
                  <Link to={`/entry/${entry.id}`}>
                    <FileText className="mr-2" size={16} /> View Details
                  </Link>
                </Button>
                <Button variant="secondary">
                  <LinkIcon className="mr-2" size={16} /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg">Explore More Entries</Button>
      </div>
    </div>
  );
}
