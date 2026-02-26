import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AuctionCard from "@/components/AuctionCard";
import OnboardingModal from "@/components/OnboardingModal";
import { api } from "@/lib/api";
import { mapApiAuctionToAuction, type ApiAuction, type Auction } from "@/types/auction";

type FilterStatus = "all" | "live" | "upcoming" | "ended";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: auctions = [], isLoading, isError, error } = useQuery({
    queryKey: ["auctions"],
    queryFn: async () => {
      const raw = await api.get<unknown>("/api/auctions");
      const list = Array.isArray(raw) ? (raw as ApiAuction[]) : [];
      return list.map(mapApiAuctionToAuction);
    },
  });

  useEffect(() => {
    const seen = localStorage.getItem("regrip-onboarding-seen");
    if (!seen) {
      setShowOnboarding(true);
      localStorage.setItem("regrip-onboarding-seen", "true");
    }
  }, []);

  const filters: { label: string; value: FilterStatus; count: number }[] = [
    { label: "All", value: "all", count: auctions.length },
    { label: "Live", value: "live", count: auctions.filter((a) => a.status === "live").length },
    { label: "Upcoming", value: "upcoming", count: auctions.filter((a) => a.status === "upcoming").length },
    { label: "Ended", value: "ended", count: auctions.filter((a) => a.status === "ended").length },
  ];

  const filtered = auctions.filter((a: Auction) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.brand.toLowerCase().includes(search.toLowerCase()) ||
      a.size.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pt-20 pb-12">
      <OnboardingModal open={showOnboarding} onClose={() => setShowOnboarding(false)} />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Flame className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl font-bold text-foreground">Live Auctions</h1>
          </div>
          <p className="text-muted-foreground">Browse and bid on re-engineered tyres in real-time</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand, or size..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Badge
                key={f.value}
                variant={filter === f.value ? "default" : "secondary"}
                className="cursor-pointer transition-all hover:scale-105 px-3 py-1.5 text-xs"
                onClick={() => setFilter(f.value)}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{f.count}</span>
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Masonry Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">Loading auctions...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-destructive">
            <p className="text-lg font-medium">Failed to load auctions</p>
            <p className="text-sm">{error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="masonry-grid">
            {filtered.map((auction, index) => (
              <AuctionCard key={auction.id} auction={auction} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <SlidersHorizontal className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">No auctions found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
