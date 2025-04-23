import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to CELLIM Viewer
        </h1>
        <p className="text-lg max-w-3xl text-muted-foreground">
          A molecular structures visualization platform for sharing and
          collaborating on biological data
        </p>

        <div className="flex gap-4 mt-8">
          <Button asChild size="lg">
            <Link to="/entries/new">Create New Entry</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link to="/docs">View Documentation</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature cards would go here */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-xl font-semibold mb-2">
            Interactive Visualization
          </h3>
          <p className="text-muted-foreground">
            Explore molecular structures with advanced 3D rendering powered by
            Mol*.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-xl font-semibold mb-2">Shareable Links</h3>
          <p className="text-muted-foreground">
            Create and share links to provide access to your molecular
            visualizations.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-xl font-semibold mb-2">Multiple Views</h3>
          <p className="text-muted-foreground">
            Save multiple visualization states for each molecular structure.
          </p>
        </div>
      </div>
    </div>
  );
}
