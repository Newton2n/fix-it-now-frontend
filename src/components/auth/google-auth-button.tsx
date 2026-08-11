"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { googleLogin } from "@/actions/auth.action";

interface CredentialResponse {
  credential?: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: CredentialResponse) => Promise<void> | void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parentElement: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "small" | "medium" | "large";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export function GoogleAuthButton() {
  const router = useRouter();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing.");
      return;
    }

    const initAndRender = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;

      // 1. Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            toast.error("Failed to retrieve Google credential.");
            setIsLoading(false);
            return;
          }

          setIsLoading(true);

          try {
            // response.credential is the valid JWT ID Token (eyJ...)
            const result = await googleLogin({ idToken: response.credential });

            if (!result?.success) {
              toast.error(result?.message || "Sign-in failed.");
              setIsLoading(false);
              return;
            }

            toast.success(result.message || "Logged in successfully!");

            const role = result.user?.role;
            if (role === "ADMIN") router.replace("/dashboard/admin");
            else if (role === "TECHNICIAN") router.replace("/dashboard/technician");
            else router.replace("/dashboard/customer");

            router.refresh();
          } catch (error) {
            console.error("Google Auth error:", error);
            toast.error("An unexpected error occurred.");
            setIsLoading(false);
          }
        },
      });

      // 2. Clear previous iframe before rendering (prevents duplicate buttons on re-render)
      buttonRef.current.innerHTML = "";

      // 3. Render official Google Iframe button
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: "100%", // Dynamically spans full width of parent container
        logo_alignment: "left",
      });
    };

    // If Google script is already loaded
    if (window.google?.accounts?.id) {
      initAndRender();
    } else {
      // Check periodically if script was dynamically loaded via layout/head
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initAndRender();
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isMounted, router]);

  return (
    <div className="w-full min-h-[44px] relative flex flex-col items-center justify-center">
      {/* Loading Overlay when authentication action is processing */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xs z-10 flex items-center justify-center rounded-md border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground font-medium">
            Authenticating...
          </span>
        </div>
      )}

      {/* Target Container where Google SDK renders the iframe */}
      <div ref={buttonRef} className="w-full flex justify-center" />
    </div>
  );
}