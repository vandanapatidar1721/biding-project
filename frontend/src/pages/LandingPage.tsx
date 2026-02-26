import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Real-Time Bidding",
    description: "WebSocket-powered live updates. See every bid as it happens.",
  },
  {
    icon: Shield,
    title: "Concurrency Safe",
    description: "Row-level locking ensures zero double-awards under high traffic.",
  },
  {
    icon: Globe,
    title: "100+ Dealers",
    description: "A growing network of verified tyre dealers competing for the best price.",
  },
  {
    icon: TrendingUp,
    title: "Best Prices",
    description: "Competitive auctions drive fair market value for re-engineered tyres.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(74,222,128,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_55%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.8),_transparent_60%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.9),_transparent_55%)]" />

        <div className="container relative z-10 mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary border border-primary/20"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-live" />
              Live Auctions Running Now
            </motion.div>

            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Bid on Premium{" "}
              <span className="text-gradient">Re-Engineered</span>{" "}
              Tyres
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              India's first real-time bidding platform for re-engineered tyres. 
              Transparent pricing, live auctions, instant results.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 text-base glow-green">
                  Join Auction <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="text-base">
                  Create Account
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex gap-8">
              {[
                { value: "500+", label: "Auctions" },
                { value: "120+", label: "Dealers" },
                { value: "₹2Cr+", label: "Volume" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Why <span className="text-gradient">RegripBid</span>?
            </h2>
            <p className="mt-3 text-muted-foreground">Built for speed, fairness, and scale.</p>
          </motion.div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl bg-card border border-border/50 p-6 transition-all hover:border-primary/30 hover:glow-green-sm"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 p-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Ready to Start Bidding?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Join hundreds of dealers already winning auctions on our platform.
            </p>
            <div className="mt-8">
              <Link to="/signup">
                <Button size="lg" className="gap-2 text-base glow-green">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <p>© 2026 Regrip India Private Limited. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
