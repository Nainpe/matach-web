import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      address?: string;
      postalCode?: string;
      image?: string | null;
      name?: string | null;
      dni: string;
      email: string;
      emailVerified: Date | null;
      createdAt: string;
    } & DefaultSession["user"];
  }
}