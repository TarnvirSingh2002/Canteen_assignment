import { useState } from "react";
import { Link } from "wouter";
import { useStudents, useCreateStudent } from "@/hooks/use-students";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, ChevronRight, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clsx } from "clsx";

export default function Students() {
  const { data: students, isLoading } = useStudents();
  const { mutate: createStudent, isPending: isCreating } = useCreateStudent();
  const { toast } = useToast();
  
  const [newStudentName, setNewStudentName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = () => {
    if (!newStudentName.trim()) return;
    
    createStudent(
      { name: newStudentName },
      {
        onSuccess: () => {
          toast({ title: "Success", description: "Student registered successfully" });
          setNewStudentName("");
          setIsDialogOpen(false);
        },
        onError: (error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Students</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage student accounts and track their orders.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 text-base font-semibold">
                <UserPlus className="w-5 h-5 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">New Student</DialogTitle>
                <DialogDescription>
                  Enter the student's full name. A unique referral code will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="h-12 rounded-xl border-border focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleCreate} 
                  disabled={isCreating || !newStudentName}
                  className="w-full h-12 rounded-xl font-semibold"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Register Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 divide-y divide-border/50">
              {students?.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No students registered yet.</p>
                </div>
              ) : (
                students?.map((student, index) => (
                  <Link key={student.id} href={`/students/${student.id}`}>
                    <div className={clsx(
                      "group p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors",
                      index % 2 === 0 ? "bg-white/50" : "bg-white/0"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold font-display shadow-inner">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{student.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                            <span className="bg-muted px-2 py-0.5 rounded text-xs border border-border">CODE: {student.referralCode}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Spent</p>
                          <p className="text-xl font-bold font-mono text-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(student.totalSpent / 100)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
