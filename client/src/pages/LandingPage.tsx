import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Globe, Lock, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-4 mt-24">
        <h1 className="text-4xl md:text-5xl font-bold">CELLIM View</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced visualization platform for cellular and molecular data from
          the CELLIM research group
        </p>
      </section>

      {/* Featured Visualizations */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Visualizations</h2>
          <Button variant="outline" asChild>
            <Link to="/search">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          TODO
        </div>
      </section>

      {/* About Section */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <h2 className="text-2xl font-semibold mb-4">About CELLIM View</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              CELLIM View is a specialized platform designed to visualize
              complex cellular and molecular data produced by the CELLIM
              research group. Our platform enables researchers to explore
              detailed cellular structures and interactions through advanced
              visualization techniques.
            </p>
            <p>
              Featuring support for both volume and segmentation visualizations,
              CELLIM View offers powerful tools to examine neuronal networks,
              mitochondrial structures, and other cellular components with
              unprecedented detail.
            </p>
          </div>
          <div className="mt-6 space-x-4">
            <Button asChild>
              <Link to="/search">Browse Library</Link>
            </Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-10">
          <h3 className="font-semibold mb-4">Key Features</h3>
          <ul className="space-y-6">
            <li className="flex">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Database size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Public & Private Repositories</h4>
                <p className="text-sm text-muted-foreground">
                  Access public visualizations or create private ones shared via
                  secure links
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Globe size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Multiple Visualization Types</h4>
                <p className="text-sm text-muted-foreground">
                  Support for MolViewSpec states and VolSeg entries with custom
                  camera positions
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Share2 size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Shareable States</h4>
                <p className="text-sm text-muted-foreground">
                  Generate links to specific views and camera positions for
                  collaboration
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="mr-4 bg-primary/10 p-2 rounded-full">
                <Lock size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Secure Access Control</h4>
                <p className="text-sm text-muted-foreground">
                  Protect sensitive data with UUID-based private sharing
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
