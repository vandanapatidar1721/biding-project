import tyre1 from "@/assets/tyre-1.jpg";
import tyre2 from "@/assets/tyre-2.jpg";
import tyre3 from "@/assets/tyre-3.jpg";
import tyre4 from "@/assets/tyre-4.jpg";

export interface Bid {
  id: string;
  dealerName: string;
  amount: number;
  timestamp: Date;
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  size: string;
  brand: string;
  quantity: number;
  startingPrice: number;
  currentBid: number;
  totalBids: number;
  timeLeft: string;
  status: "live" | "upcoming" | "ended";
  bids: Bid[];
}

export const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Premium All-Terrain 265/70R17",
    description: "Re-engineered all-terrain tyres with reinforced sidewalls. Perfect for SUVs and light trucks.",
    image: tyre1,
    size: "265/70R17",
    brand: "Regrip AT Pro",
    quantity: 50,
    startingPrice: 3200,
    currentBid: 4850,
    totalBids: 23,
    timeLeft: "2h 15m",
    status: "live",
    bids: [
      { id: "b1", dealerName: "AutoZone Delhi", amount: 4850, timestamp: new Date() },
      { id: "b2", dealerName: "TyreMart Mumbai", amount: 4700, timestamp: new Date(Date.now() - 60000) },
      { id: "b3", dealerName: "WheelHub Pune", amount: 4500, timestamp: new Date(Date.now() - 120000) },
    ],
  },
  {
    id: "2",
    title: "Highway Cruiser 205/55R16",
    description: "Fuel-efficient highway tyres with low rolling resistance and excellent wet grip.",
    image: tyre2,
    size: "205/55R16",
    brand: "Regrip Eco",
    quantity: 120,
    startingPrice: 1800,
    currentBid: 2400,
    totalBids: 45,
    timeLeft: "45m",
    status: "live",
    bids: [
      { id: "b4", dealerName: "SpeedWheels", amount: 2400, timestamp: new Date() },
      { id: "b5", dealerName: "TyreKing", amount: 2350, timestamp: new Date(Date.now() - 30000) },
    ],
  },
  {
    id: "3",
    title: "Heavy Duty Radial 12.00R20",
    description: "Commercial-grade radial tyres for heavy trucks. Extra durable compound for long haul.",
    image: tyre3,
    size: "12.00R20",
    brand: "Regrip HD",
    quantity: 30,
    startingPrice: 8500,
    currentBid: 11200,
    totalBids: 18,
    timeLeft: "5h 30m",
    status: "live",
    bids: [
      { id: "b6", dealerName: "FleetPro", amount: 11200, timestamp: new Date() },
    ],
  },
  {
    id: "4",
    title: "Sport Performance 225/45R18",
    description: "High-performance tyres with asymmetric tread for maximum cornering grip.",
    image: tyre4,
    size: "225/45R18",
    brand: "Regrip Sport",
    quantity: 40,
    startingPrice: 4500,
    currentBid: 5800,
    totalBids: 31,
    timeLeft: "1h 10m",
    status: "live",
    bids: [
      { id: "b7", dealerName: "RaceLine Auto", amount: 5800, timestamp: new Date() },
      { id: "b8", dealerName: "PremiumTyres", amount: 5600, timestamp: new Date(Date.now() - 45000) },
    ],
  },
  {
    id: "5",
    title: "Budget Commuter 175/65R14",
    description: "Affordable re-engineered tyres ideal for city driving. Great mileage warranty.",
    image: tyre1,
    size: "175/65R14",
    brand: "Regrip City",
    quantity: 200,
    startingPrice: 1200,
    currentBid: 1200,
    totalBids: 0,
    timeLeft: "8h",
    status: "upcoming",
    bids: [],
  },
  {
    id: "6",
    title: "Off-Road Mud Terrain 315/75R16",
    description: "Aggressive mud-terrain tyres with self-cleaning tread and stone ejectors.",
    image: tyre2,
    size: "315/75R16",
    brand: "Regrip MudX",
    quantity: 25,
    startingPrice: 6200,
    currentBid: 8900,
    totalBids: 52,
    timeLeft: "Ended",
    status: "ended",
    bids: [
      { id: "b9", dealerName: "4x4 World", amount: 8900, timestamp: new Date(Date.now() - 3600000) },
    ],
  },
  {
    id: "7",
    title: "Van Load Carrier 195/75R16C",
    description: "Load-rated commercial van tyres with reinforced construction.",
    image: tyre3,
    size: "195/75R16C",
    brand: "Regrip Van",
    quantity: 80,
    startingPrice: 2800,
    currentBid: 3600,
    totalBids: 15,
    timeLeft: "3h 45m",
    status: "live",
    bids: [
      { id: "b10", dealerName: "VanFleet", amount: 3600, timestamp: new Date() },
    ],
  },
  {
    id: "8",
    title: "Winter Grip 215/60R17",
    description: "Cold-weather compound with siping for ice and snow traction.",
    image: tyre4,
    size: "215/60R17",
    brand: "Regrip Ice",
    quantity: 60,
    startingPrice: 3800,
    currentBid: 4200,
    totalBids: 8,
    timeLeft: "6h 20m",
    status: "live",
    bids: [
      { id: "b11", dealerName: "NorthDrive", amount: 4200, timestamp: new Date() },
    ],
  },
];
