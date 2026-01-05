import { useRoute } from "wouter";
import { useStudent } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import { Loader2, ArrowLeft, Receipt, Trophy } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function StudentDetails() {
  const [, params] = useRoute("/students/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: student, isLoading, error } = useStudent(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Student Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the student you're looking for.</p>
          <Link href="/students" className="text-primary hover:underline font-medium">Back to Students</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link href="/students" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to list
        </Link>

        {/* Profile Header */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white flex items-center justify-center text-4xl font-display font-bold shadow-lg shadow-primary/20">
              {student.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{student.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-muted rounded-lg text-sm font-mono font-medium text-foreground/70 border border-border">
                  {student.referralCode}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-200 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Active Member
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-2xl border border-border/50 text-right min-w-[200px]">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Lifetime Spend</p>
            <p className="text-3xl font-mono font-bold text-primary">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(student.totalSpent / 100)}
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Receipt className="w-6 h-6 text-primary" />
            Order History
          </h2>

          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            {student.orders?.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p>No orders placed yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 text-left border-b border-border/50">
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-1/4">Date</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-1/3">Item</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-1/6 text-center">Qty</th>
                      <th className="p-4 font-semibold text-sm text-muted-foreground w-1/4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {student.orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 text-sm font-medium text-muted-foreground">
                          {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a') : '-'}
                        </td>
                        <td className="p-4 font-medium text-foreground">
                          {order.snack.name}
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-sm font-bold">
                            {order.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-medium text-foreground">
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.amount / 100)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
