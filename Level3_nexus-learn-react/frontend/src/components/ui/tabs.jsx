import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function Tabs({ className, ...props }) {
  return <TabsPrimitive.Root className={cn(className)} {...props} />;
}

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn("glass inline-flex items-center gap-1 rounded-lg p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors",
        "data-[state=active]:gradient-signature data-[state=active]:text-white",
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }) {
  return <TabsPrimitive.Content className={cn("mt-6", className)} {...props} />;
}
