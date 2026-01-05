import { useState } from "react";
import { useSnacks } from "@/hooks/use-snacks";
import { useStudents } from "@/hooks/use-students";
import { useCreateOrder } from "@/hooks/use-orders";
import { Layout } from "@/components/Layout";
import { SnackCard } from "@/components/SnackCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Snack } from "@shared/schema";

export default function Home() {
  const { data: snacks, isLoading: loadingSnacks } = useSnacks();
  const { data: students } = useStudents();
  const { mutate: createOrder, isPending: isOrdering } = useCreateOrder();
  const { toast } = useToast();

  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOrder = () => {
    if (!selectedSnack || !selectedStudentId) return;

    createOrder(
      {
        snackId: selectedSnack.id,
        studentId: parseInt(selectedStudentId),
        quantity: quantity,
      },
      {
        onSuccess: () => {
          toast({
            title: "Order Placed! 🌭",
            description: `${quantity}x ${selectedSnack.name} ordered successfully.`,
          });
          setSelectedSnack(null);
          setQuantity(1);
          setSelectedStudentId("");
        },
        onError: (err) => {
          toast({
            title: "Order Failed",
            description: err.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const filteredSnacks = snacks?.filter(snack => 
    snack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Snack Menu</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Tasty treats to fuel your learning journey.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
        </div>

        {/* Content Area */}
        {loadingSnacks ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSnacks?.map((snack) => (
              <SnackCard 
                key={snack.id} 
                snack={snack} 
                onOrder={setSelectedSnack} 
              />
            ))}
            
            {filteredSnacks?.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No snacks found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Order Modal */}
        <Dialog open={!!selectedSnack} onOpenChange={(open) => !open && setSelectedSnack(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl overflow-hidden border-0 shadow-2xl">
            <div className="bg-gradient-to-r from-accent to-accent/80 p-6 -mx-6 -mt-6 mb-6 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">Place Order</DialogTitle>
                <DialogDescription className="text-white/80">
                  Ordering <span className="font-bold text-white">{selectedSnack?.name}</span>
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="student" className="text-sm font-semibold text-foreground/70">Select Student</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger id="student" className="h-12 rounded-xl border-border bg-background focus:ring-accent/20 focus:border-accent">
                    <SelectValue placeholder="Who is this for?" />
                  </SelectTrigger>
                  <SelectContent>
                    {students?.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold text-foreground/70">Quantity</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="h-12 rounded-xl border-border bg-background focus:ring-accent/20 focus:border-accent"
                  />
                  <div className="text-right flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total</p>
                    <p className="text-2xl font-bold font-mono text-accent">
                      {selectedSnack && new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((selectedSnack.price * quantity) / 100)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button 
                onClick={handleOrder} 
                disabled={!selectedStudentId || isOrdering}
                className="w-full h-12 rounded-xl bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/25 text-lg font-semibold"
              >
                {isOrdering ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                  </>
                ) : "Confirm Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
