import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertOrder } from "@shared/schema";
import { z } from "zod";

// Helper to handle form data coercion since JSON doesn't preserve types
const orderInputSchema = api.orders.create.input.extend({
  studentId: z.coerce.number(),
  snackId: z.coerce.number(),
  quantity: z.coerce.number(),
});

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertOrder) => {
      // Validate and coerce types before sending
      const validated = orderInputSchema.parse(data);
      
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create order");
      }
      
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: [api.students.list.path] });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] }); // simplified check
    },
  });
}
