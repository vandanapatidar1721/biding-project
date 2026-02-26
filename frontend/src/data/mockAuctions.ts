export type AuctionStatus = "live" | "upcoming" | "ended";

export type Auction = {
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
};

export const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Premium Re-Engineered Truck Tyres",
    brand: "Regrip Max",
    size: "295/80 R22.5",
    status: "live",
    currentBid: 18500,
    endTime: "2026-03-01T18:30:00+05:30",
    bids: 12,
    location: "Mumbai, MH",
  },
  {
    id: "2",
    title: "City Bus Radial Tyres",
    brand: "UrbanGrip",
    size: "245/75 R17.5",
    status: "live",
    currentBid: 13250,
    endTime: "2026-03-01T19:00:00+05:30",
    bids: 8,
    location: "Pune, MH",
  },
  {
    id: "3",
    title: "Long Haul Trailer Tyres",
    brand: "HighwayPro",
    size: "11R22.5",
    status: "upcoming",
    currentBid: 0,
    endTime: "2026-03-02T10:00:00+05:30",
    bids: 0,
    location: "Ahmedabad, GJ",
  },
  {
    id: "4",
    title: "Regional Delivery Tyres",
    brand: "FleetSure",
    size: "10.00 R20",
    status: "ended",
    currentBid: 16200,
    endTime: "2026-02-24T17:30:00+05:30",
    bids: 21,
    location: "Bengaluru, KA",
  },
];

