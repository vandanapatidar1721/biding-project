import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, MapPin, IndianRupee, Gavel } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, isLoggedIn } from "@/lib/api";
import { isDealer } from "@/lib/auth";
import { toast } from "sonner";
import type { Auction } from "@/types/auction";

interface AuctionCardProps {
  auction: Auction;
  index: number;
}

const statusConfig: Record<
  Auction["status"],
  { label: string; badgeClass: string }
> = {
  live: {
    label: "Live",
    badgeClass: "bg-[hsl(var(--bid-success))]/15 text-[hsl(var(--bid-success))] border-[hsl(var(--bid-success))]/40",
  },
  upcoming: {
    label: "Upcoming",
    badgeClass: "bg-primary/10 text-primary border-primary/40",
  },
  ended: {
    label: "Ended",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
};

const AuctionCard = ({ auction, index }: AuctionCardProps) => {
  const queryClient = useQueryClient();
  const [bidOpen, setBidOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [placing, setPlacing] = useState(false);
  const { label, badgeClass } = statusConfig[auction.status];

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      toast.error("Please log in to place a bid");
      return;
    }
    if (!isDealer()) {
      toast.error("Only dealers can place bids. You are logged in as admin.");
      return;
    }
    const amount = parseFloat(bidAmount);
    if (Number.isNaN(amount) || amount <= auction.currentBid) {
      toast.error(`Bid must be higher than ₹${auction.currentBid.toLocaleString("en-IN")}`);
      return;
    }
    setPlacing(true);
    try {
      await api.post<{ bid: unknown; currentPrice: number }>(
        `/api/auctions/${auction.id}/bids`,
        { amount: Number(amount), idempotencyKey: crypto.randomUUID() }
      );
      toast.success("Bid placed successfully!");
      setBidOpen(false);
      setBidAmount("");
      await queryClient.invalidateQueries({ queryKey: ["auctions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place bid");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <motion.div
      layout
      className="masonry-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="overflow-hidden border-border/60 bg-[hsl(var(--surface))]">
        <CardHeader className="space-y-2 border-b border-border/40 pb-3">
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 ${badgeClass}`}
            >
              <span className="relative flex h-2 w-2">
                {auction.status === "live" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--live-pulse))]/60 opacity-75" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--live-pulse))]" />
              </span>
              {label}
            </Badge>
            {auction.bids > 0 && (
              <span className="text-[11px] font-medium text-muted-foreground">
                {auction.bids} bids
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-semibold leading-snug text-foreground">
            {auction.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {auction.brand} • {auction.size}
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="text-xl font-semibold tracking-tight text-foreground">
                {auction.currentBid.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{auction.status === "ended" ? "Closed" : "Ends soon"}</span>
            </div>
          </div>

          {auction.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{auction.location}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-border/40 pt-3">
          <Button
            variant={auction.status === "ended" ? "outline" : "default"}
            size="sm"
            className="w-full gap-1.5 text-xs"
            disabled={auction.status === "ended"}
            onClick={() => auction.status === "live" && setBidOpen(true)}
          >
            <Gavel className="h-3.5 w-3.5" />
            {auction.status === "ended" ? "View result" : "Place bid"}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={bidOpen} onOpenChange={setBidOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Place bid</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePlaceBid} className="space-y-4">
            <p className="text-sm text-muted-foreground">{auction.title}</p>
            <p className="text-sm">
              Current: <span className="font-semibold">₹{auction.currentBid.toLocaleString("en-IN")}</span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="bid-amount">Your bid (₹)</Label>
              <Input
                id="bid-amount"
                type="number"
                min={auction.currentBid + 1}
                step={1}
                placeholder={`Min ₹${(auction.currentBid + 1).toLocaleString("en-IN")}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bg-card"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setBidOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={placing}>
                {placing ? "Placing…" : "Place bid"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AuctionCard;

