"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "warning" | "info";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  function show(message: string, type: ToastType = "info", timeout = 3000) {
    setToast({ message, type });
    setTimeout(() => setToast(null), timeout);
  }

  const colors: Record<ToastType, string> = {
    success: "bg-[#0046AD] text-white", // Sponsorjobs navy-blue
    error: "bg-red-600 text-white",
    warning: "bg-amber-500 text-black",
    info: "bg-gray-800 text-white",
  };

  const icons: Record<ToastType, string> = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  const Toast = (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 ${colors[toast.type]} z-50`}
        >
          <span className="text-lg">{icons[toast.type]}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return { Toast, show };
}
