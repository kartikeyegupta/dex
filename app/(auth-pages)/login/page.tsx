import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Login(props: { searchParams: Promise<Message> }) {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('auth_token')
  
  if (isAuthenticated) {
    redirect('/demo')
  }
  const searchParams = await props.searchParams;
  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between p-24  bg-black">
        <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            Welcome to Dex
            </h1>
            <form className="w-full max-w-md">
                <Card className="bg-black border-2 border-pink-500">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center text-cyan-400">Login to Dex</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                            <p className="text-sm text-foreground text-white">
                            Don't have an account?{" "}
                            <Link className="text-foreground font-medium underline text-white" href="/signup">
                                Sign up
                            </Link>
                            </p>
                            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                            <Label htmlFor="email" className="text-pink-400">Email</Label>
                            <Input name="email" 
                                placeholder="you@domain.com" 
                                required 
                                className="bg-black border-cyan-500 text-white"
                            />
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-pink-400">Password</Label>
                                <Link
                                className="text-xs text-foreground underline text-white"
                                href="/forgot-password"
                                >
                                Forgot Password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Your password"
                                required
                                className="bg-black border-cyan-500 text-white"
                            />
                            <CardFooter>
                                <SubmitButton pendingText="Signing In..." formAction={signInAction} className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold">
                                    Sign in
                                </SubmitButton>
                            </CardFooter>
                            <FormMessage message={searchParams} />
                            </div>
                        </CardContent>
                    </Card>
            </form>
        </div>
    </main>
  );
}