"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
};

type ConfirmContextType = {
  confirm: (
    options: ConfirmOptions
  ) => Promise<boolean>;
};

const ConfirmContext =
  createContext<ConfirmContextType | null>(
    null
  );

export function useConfirm() {
  const context =
    useContext(ConfirmContext);

  if (!context) {
    throw new Error(
      "useConfirm must be used inside ConfirmProvider"
    );
  }

  return context;
}

export function ConfirmProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] =
    useState(false);

  const [options, setOptions] =
    useState<ConfirmOptions | null>(
      null
    );

  const [resolver, setResolver] =
    useState<
      ((value: boolean) => void) | null
    >(null);

  const confirm = (
    options: ConfirmOptions
  ) => {
    setOptions(options);

    setOpen(true);

    return new Promise<boolean>(
      (resolve) => {
        setResolver(() => resolve);
      }
    );
  };

  function handleCancel() {
    setOpen(false);

    resolver?.(false);

    setResolver(null);
  }

  function handleConfirm() {
    setOpen(false);

    resolver?.(true);

    setResolver(null);
  }

  return (
    <ConfirmContext.Provider
      value={{ confirm }}
    >
      {children}

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              {options?.title}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {options?.description}
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel
              onClick={handleCancel}
            >
              {options?.cancelText ??
                "Annuleren"}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirm}
              className={
                options?.destructive
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
              }
            >
              {options?.confirmText ??
                "Bevestigen"}
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </ConfirmContext.Provider>
  );
}