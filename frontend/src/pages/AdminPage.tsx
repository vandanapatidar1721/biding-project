import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Play, Square, IndianRupee, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { isAdmin, getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";
import type { ApiAuction } from "@/types/auction";

const AdminPage = () => {
  const queryClient = useQueryClient();
  const user = getCurrentUser();
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  const [creating, setCreating] = useState(false);
  const [actioningId, setActioningId] = useState<number | null>(null);

  const { data: list = [], isLoading } = useQuery({
    queryKey: ["auctions"],
    queryFn: () => api.get<ApiAuction[]>("/api/auctions"),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(startingPrice);
    if (!title.trim() || Number.isNaN(price) || price < 0 || !endTime.trim()) {
      toast.error("Fill title, starting price (≥ 0), and end time");
      return;
    }
    setCreating(true);
    try {
      await api.post("/api/auctions", {
        title: title.trim(),
        description: description.trim() || undefined,
        starting_price: price,
        end_time: (() => {
          const e = endTime.replace("T", " ");
          return e.length >= 19 ? e.slice(0, 19) : e + ":00";
        })(),
      });
      toast.success("Auction created");
      setCreateOpen(false);
      setTitle("");
      setDescription("");
      setStartingPrice("");
      setEndTime("");
      await queryClient.invalidateQueries({ queryKey: ["auctions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create auction");
    } finally {
      setCreating(false);
    }
  };

  const handleStart = async (id: number) => {
    setActioningId(id);
    try {
      await api.post(`/api/auctions/${id}/start`);
      toast.success("Auction started");
      await queryClient.invalidateQueries({ queryKey: ["auctions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start auction");
    } finally {
      setActioningId(null);
    }
  };

  const handleClose = async (id: number) => {
    setActioningId(id);
    try {
      await api.post(`/api/auctions/${id}/close`);
      toast.success("Auction closed");
      await queryClient.invalidateQueries({ queryKey: ["auctions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to close auction");
    } finally {
      setActioningId(null);
    }
  };

  if (user && !isAdmin()) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <p className="text-muted-foreground">Only admins can access this page.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <p className="text-muted-foreground">Please log in as an admin.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin</h1>
            <p className="text-muted-foreground">Create and manage auctions</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create auction
          </Button>
        </motion.div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading auctions…</p>
        ) : list.length === 0 ? (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>No auctions yet</CardTitle>
              <CardDescription>Create your first auction to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create auction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {list.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <h3 className="font-display font-semibold text-foreground">{a.title}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {a.current_price}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(a.end_time).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {a.status}
                  </span>
                  {a.status === "DRAFT" && (
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={actioningId !== null}
                      onClick={() => handleStart(a.id)}
                    >
                      <Play className="h-3.5 w-3.5" />
                      Start
                    </Button>
                  )}
                  {a.status === "OPEN" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1.5"
                      disabled={actioningId !== null}
                      onClick={() => handleClose(a.id)}
                    >
                      <Square className="h-3.5 w-3.5" />
                      Close
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create auction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-title">Title</Label>
              <Input
                id="admin-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Premium Tyre Lot"
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-desc">Description (optional)</Label>
              <Input
                id="admin-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-price">Starting price (₹)</Label>
              <Input
                id="admin-price"
                type="number"
                min={0}
                step={1}
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-end">End time</Label>
              <Input
                id="admin-end"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-card"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
