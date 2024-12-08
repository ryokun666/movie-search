// components/ui/button.jsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          // ベーススタイル
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",

          // バリアントスタイル
          {
            // デフォルト
            "bg-primary text-primary-foreground hover:bg-primary/90":
              variant === "default",
            // デストラクティブ
            "bg-destructive text-destructive-foreground hover:bg-destructive/90":
              variant === "destructive",
            // アウトライン
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground":
              variant === "outline",
            // セカンダリー
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            // ゴースト
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            // リンク
            "text-primary underline-offset-4 hover:underline":
              variant === "link",
          },

          // サイズスタイル
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-8 w-8": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
