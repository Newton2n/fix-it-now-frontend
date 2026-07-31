import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-bold tracking-tight">
            404
          </CardTitle>

          <CardDescription className="mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          Please check the URL or go back to the homepage.
        </CardContent>

        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}