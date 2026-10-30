import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<
   typeof TooltipPrimitive.Popup
> {
   sideOffset?: number;
}

export const TooltipContent = React.forwardRef<
   HTMLDivElement,
   TooltipContentProps
>(({ className, sideOffset = 4, children, ...props }, ref) => (
   <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner sideOffset={sideOffset}>
         <TooltipPrimitive.Popup
            ref={ref}
            className={cn(
               "z-50 overflow-hidden rounded-md bg-foreground px-2.5 py-1 text-xs font-semibold text-background shadow-md animate-in fade-in-0 zoom-in-95",
               className,
            )}
            {...props}
         >
            {children}
         </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
   </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

/**
 * Convenient wrapper for icon action buttons
 * Usage:
 * <ActionTooltip content="Permanently Delete">
 *    <button ... />
 * </ActionTooltip>
 */
export const ActionTooltip = ({
   content,
   children,
}: {
   content: React.ReactNode;
   children: React.ReactElement;
}) => {
   if (!content) return children;

   return (
      <Tooltip>
         <TooltipTrigger render={children} />
         <TooltipContent>{content}</TooltipContent>
      </Tooltip>
   );
};
