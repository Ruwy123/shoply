"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";

const CredentialsSignInForm = () => {
  return (
    <form className="space-y-6">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
        ></Input>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="password"
          defaultValue={signInDefaultValues.password}
        ></Input>
      </div>
      <div>
        <Button className="w-full" variant="default">
          Sign In
        </Button>
        <div className="text-sm text-center text-muted-foreground pt-5">
          Don&apos;t have and account?
          <Link href="/sign-up" target="_self" className="link ">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};
export default CredentialsSignInForm;
