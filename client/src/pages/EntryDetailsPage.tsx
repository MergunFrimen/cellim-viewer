// src/pages/EntryDetailsPage.tsx
import { useEntryViews } from "@/hooks/useEntryViews";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Info, Share2 } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams } from "react-router-dom";
import { ViewResponse } from "@/types";

export function EntryDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: views, isLoading, error } = useEntryViews(id!);
  const [activeView, setActiveView] = useState(views?.[0]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Entry Title</h1>
          <p className="text-muted-foreground mt-2">Entry Description</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share2 className="mr-2" size={16} /> Share
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        {Array.from(["tag1", "tag2"]).map((tag) => (
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
                MARKDOWN
              </ReactMarkdown>
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
                {views?.map((view: ViewResponse) => (
                  <div
                    key={view.id}
                    className={`
                      border p-4 rounded-lg cursor-pointer 
                      ${activeView?.id === view.id ? "bg-secondary" : "hover:bg-secondary/50"}
                    `}
                    onClick={() => setActiveView(view)}
                  >
                    <h3 className="font-semibold">{view.title}</h3>
                    <p className="text-muted-foreground">{view.description}</p>
                    <Badge variant="outline" className="mt-2">
                      badge
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
                Visualization for "{activeView?.title}" will be rendered here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
