import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: Big note.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |

## Tasklist

* [ ] to do
* [x] done  
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

export function EntryDetailsPage3() {
  const [activeView, setActiveView] = useState(MOCK_ENTRY.views[0]);

  return (
    <div className="space-y-6">
      {/* Header with title, description and share button */}
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

      {/* Main content area with side-by-side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - view list */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold text-lg mb-4">Available Views</h2>
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
        </div>

        {/* Right column - visualization */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6 flex justify-center items-center min-h-[400px]">
              <div className="text-center text-muted-foreground">
                Visualization for "{activeView.title}" will be rendered here
              </div>
            </CardContent>
          </Card>

          {/* Description section */}
          <Card>
            <CardContent className="p-6 max-h-[400px] overflow-y-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headers
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
                  h3: ({ children }) => (
                    <h3 className="scroll-m-20 text-base font-semibold tracking-tight mb-2">
                      {children}
                    </h3>
                  ),
                  // Paragraphs and text
                  p: ({ children }) => (
                    <p className="text-xs leading-6 text-foreground/90 mb-3">
                      {children}
                    </p>
                  ),
                  // Links
                  a: ({ href, children }) => (
                    <a href={href || "#"} className="text-blue-500">
                      {children}
                    </a>
                  ),
                  // Blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="mt-4 border-l-2 border-primary pl-6 italic text-foreground/80">
                      {children}
                    </blockquote>
                  ),
                  // Lists
                  ul: ({ children }) => (
                    <ul className="my-4 ml-6 list-disc text-xs text-foreground/90 [&>li]:mt-1.5">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-4 ml-6 list-decimal text-xs text-foreground/90 [&>li]:mt-1.5">
                      {children}
                    </ol>
                  ),
                  // Tables
                  table: ({ children }) => (
                    <div className="my-4 w-full overflow-y-auto">
                      <table className="w-full border-collapse text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="border-b">{children}</thead>
                  ),
                  tr: ({ children }) => (
                    <tr className="m-0 border-t p-0 even:bg-muted">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="border px-3 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border px-3 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                      {children}
                    </td>
                  ),
                  // Horizontal rule
                  hr: () => <hr className="my-4 border-muted" />,
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
