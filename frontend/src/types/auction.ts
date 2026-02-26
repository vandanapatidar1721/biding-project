/**
 * Backend API auction shape (from GET /api/auctions).
 */
export type ApiAuctionStatus = "DRAFT" | "OPEN" | "CLOSED";

export interface ApiAuction {
  id: number;
  title: string;
  description: string | null;
  status: ApiAuctionStatus;
  starting_price: string;
  current_price: string;
  end_time: string;
  created_by: number;
  winner_user_id: number | null;
}

/**
 * Frontend display type (used by Dashboard & AuctionCard).
 */
export type AuctionStatus = "live" | "upcoming" | "ended";

export interface Auction {
  id: string;
  title: string;
  brand: string;
  size: string;
  status: AuctionStatus;
  currentBid: number;
  endTime: string;
  bids: number;
  location?: string;
  imageUrl?: string;
}

export function mapApiAuctionToAuction(a: ApiAuction): Auction {
  const statusMap: Record<ApiAuctionStatus, AuctionStatus> = {
    OPEN: "live",
    DRAFT: "upcoming",
    CLOSED: "ended",
  };
  return {
    id: String(a.id),
    title: a.title,
    brand: a.description || "—",
    size: "—",
    status: statusMap[a.status],
    currentBid: parseFloat(a.current_price) || 0,
    endTime: a.end_time,
    bids: 0,
  };
}
