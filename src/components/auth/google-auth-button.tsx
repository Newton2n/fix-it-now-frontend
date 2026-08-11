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
              width?: number; // Must be a pixel number between 200 and 400
              locale?: string;
            }
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

export function GoogleAuthButton() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing.");
      return;
    }

    let checkInterval: NodeJS.Timeout | null = null;
    let resizeObserver: ResizeObserver | null = null;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current || !containerRef.current) return;

      // Calculate width dynamically based on parent container width
      const containerWidth = containerRef.current.clientWidth;
      
      // Google SDK restricts button width to between 200px and 400px
      const calculatedWidth = Math.min(Math.max(containerWidth, 200), 400);

      // Clear previous iframe before re-rendering
      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: calculatedWidth, 
        logo_alignment: "left",
      });
    };

    const initAndRender = () => {
      if (!window.google?.accounts?.id) return;

      try {
        window.google.accounts.id.cancel();
      } catch {
        
      }

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        auto_select: false,
        callback: async (response) => {
          if (!response.credential) {
            toast.error("Failed to retrieve Google credential.");
            setIsLoading(false);
            return;
          }

          setIsLoading(true);

          try {
            const result = await googleLogin({ idToken: response.credential });

            if (!result?.success) {
              toast.error(result?.message || "Sign-in failed.");
              setIsLoading(false);
              return;
            }

            toast.success(result.message || "Logged in successfully!");

            const role = result.user?.role;
            let redirectPath = "/dashboard/customer";

            if (role === "ADMIN") redirectPath = "/dashboard/admin";
            else if (role === "TECHNICIAN") redirectPath = "/dashboard/technician";

            window.location.href = redirectPath;
          } catch (error) {
            console.error("Google Auth error:", error);
            toast.error("An unexpected error occurred.");
            setIsLoading(false);
          }
        },
      });

      // Initial render
      renderGoogleButton();

    
      if (containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          renderGoogleButton();
        });
        resizeObserver.observe(containerRef.current);
      }
    };

    if (window.google?.accounts?.id) {
      initAndRender();
    } else {
      checkInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          initAndRender();
          if (checkInterval) clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (resizeObserver) resizeObserver.disconnect();
      try {
        window.google?.accounts?.id?.cancel();
      } catch {
      
      }
    };
  }, [router]);

  return (
    <div 
      ref={containerRef} 
      className="w-full max-w-[400px] mx-auto min-h-[44px] relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xs z-10 flex items-center justify-center rounded-md border">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground font-medium">
            Authenticating...
          </span>
        </div>
      )}


      <div ref={buttonRef} className="w-full flex justify-center [&>div]:w-full" />
    </div>
  );
}