import * as React from "react";
import { useState, useCallback, useContext, createContext } from "react";
import type { ToastProps } from "@/components/ui/toast";

type Toast = ToastProps & {
  id: string;
};

type ToastContextValue = {
  toasts: Toast[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastId = 0;

export const ToastProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (props: ToastProps) => {
      const id = `toast-${toastId++}`;
      const toastWithId: Toast = { id, ...props };
      setToasts((current) => [...current, toastWithId]);
      if (props.duration && props.duration > 0) {
        setTimeout(() => dismiss(id), props.duration);
      }
    },
    [dismiss],
  );

  const value: ToastContextValue = {
    toasts,
    toast,
    dismiss,
  };

  return React.createElement(ToastContext.Provider, { value }, children);
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProviderInner");
  }
  return ctx;
}

export const toast = (props: ToastProps) => {
  // This placeholder will be replaced at runtime when wrapped in provider.
  // In this scaffolded app, Sonner is primarily used for global toasts.
  console.warn("toast() called outside of context", props);
};

