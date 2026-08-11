import { cookies } from "next/headers";
import { jwtUtils } from "./jwt";


const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

type AuthResult =
  | {
      success: true;
      accessToken: string;
    }
  | {
      success: false;
      message: string;
    };

export async function getDashboardAuth(): Promise<AuthResult> {
  if (!jwtAccessSecret) {
    throw new Error("JWT_ACCESS_SECRET is not configured.");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "You are not authenticated.",
    };
  }

  const verify = jwtUtils.verifyToken(
    accessToken,
    jwtAccessSecret,
  );

  if (!verify.success) {
    return {
      success: false,
      message: "Your session is invalid or expired.",
    };
  }

  return {
    success: true,
    accessToken,
  };
}