import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  authGetUsersTokenOptions,
  authReadUsersMeOptions,
  meListEntriesForUserOptions,
  meListVolsegEntriesForUserOptions,
} from "@/lib/client/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();

  const entriesResult = useQuery({
    ...meListEntriesForUserOptions(),
  });

  const volsegEntriesResult = useQuery({
    ...meListVolsegEntriesForUserOptions(),
  });

  const userResult = useQuery({
    ...authReadUsersMeOptions(),
  });

  const tokenResult = useQuery({
    ...authGetUsersTokenOptions(),
  });

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <Card>
        <CardContent className="py-4 px-6 space-y-2">
          <h2 className="text-xl font-semibold mb-2">User Info</h2>
          {userResult.isLoading ? (
            <p>Loading user info...</p>
          ) : userResult.data ? (
            <div className="text-sm space-y-1">
              <p>
                <strong>ID:</strong> {userResult.data.id}
              </p>
              <p>
                <strong>Email:</strong> {userResult.data.email}
              </p>
              <p>
                <strong>OpenID:</strong> {userResult.data.openid}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(userResult.data.created_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="text-destructive">Failed to load user info.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 px-6 space-y-3">
          <h2 className="text-xl font-semibold mb-4">Auth Token</h2>
          <pre className="bg-accent p-4 rounded text-sm break-words whitespace-pre-wrap">
            {tokenResult.data ? tokenResult.data : "No token"}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 px-6">
          <h2 className="text-xl font-semibold mb-4">Your Entries</h2>

          {entriesResult.isLoading && <p>Loading entries...</p>}
          {entriesResult.isError && (
            <p className="text-destructive">Failed to load entries.</p>
          )}

          {entriesResult.data && entriesResult.data.items.length > 0 ? (
            <ul className="space-y-3">
              {entriesResult.data.items.map((entry) => (
                <li
                  key={entry.id}
                  className="border rounded p-4 bg-background shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {entry.name || "Untitled Entry"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/entries/${entry.id}`)}
                  >
                    View Entry
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            !entriesResult.isLoading && <p>No entries found.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 px-6">
          <h2 className="text-xl font-semibold mb-4">Your Volseg Entries</h2>

          {volsegEntriesResult.isLoading && <p>Loading volseg entries...</p>}
          {volsegEntriesResult.isError && (
            <p className="text-destructive">Failed to load volseg entries.</p>
          )}

          {volsegEntriesResult.data && volsegEntriesResult.data.length > 0 ? (
            <ul className="space-y-3">
              {volsegEntriesResult.data.map((entry) => (
                <li
                  key={entry.id}
                  className="border rounded p-4 bg-background shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {entry.entry_id || "Untitled Volseg Entry"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(entry.created_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/volseg-entries/${entry.id}`)}
                  >
                    View Entry
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            !volsegEntriesResult.isLoading && <p>No volseg entries found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
