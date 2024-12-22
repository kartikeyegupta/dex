import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between p-24  bg-black">
      <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
              Need Help Getting Back Into Dex?
          </h1>
        <form className="w-full max-w-md">
          <Card className="bg-black border-2 border-pink-500">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-cyan-400">Reset your Password</CardTitle>
              <CardDescription className="text-white">
                  Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-1">
                <Label htmlFor="email" className="text-pink-400">Email</Label>
                <Input name="email" placeholder="you@example.com" required className="bg-black border-cyan-500 text-white"/>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-cyan-400">
                Remember your password?{' '}
                <a href="/login" className="text-pink-400 hover:underline">
                  Log in
                </a>
              </p>
            </CardFooter>
            <FormMessage message={searchParams} />
          </Card>
        </form>
      </div>
    </main>
  );
}
