import { type Snack } from "@shared/schema";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface SnackCardProps {
  snack: Snack;
  onOrder: (snack: Snack) => void;
}

export function SnackCard({ snack, onOrder }: SnackCardProps) {
  // Format cents to currency
  const priceFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(snack.price / 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
            🍿
          </div>
          <span className="font-mono text-sm font-bold bg-muted px-3 py-1 rounded-full text-foreground/80 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            {priceFormatted}
          </span>
        </div>
        
        <h3 className="text-xl font-bold font-display text-foreground mb-2 group-hover:text-primary transition-colors">
          {snack.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          Delicious school cafeteria snack. Freshly prepared daily.
        </p>
      </div>

      <button
        onClick={() => onOrder(snack)}
        className="mt-6 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2
          bg-accent/10 text-accent hover:bg-accent hover:text-white
          active:scale-95 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Order Now
      </button>
    </motion.div>
  );
}
