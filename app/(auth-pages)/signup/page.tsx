import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Select as CNSelect, SelectItem, SelectTrigger, SelectValue,  SelectContent, SelectLabel} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  const toggleAnimation = () => {
  };
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );

  }

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between p-24  bg-black">
      <div className="w-full max-w-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
        Welcome to Dex 
      </h1>
        <form className="w-full max-w-md">
          <Card className="bg-black border-2 border-pink-500">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-cyan-400">Sign Up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground text-white">
                Already have an account?{" "}
                <Link className="text-primary font-medium underline text-white" href="/login">
                  Sign in
                </Link>
              </p>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="email" className="text-pink-400">Email</Label>
                <Input name="email" placeholder="you@email.com" required className="bg-black border-cyan-500 text-white" />
                <Label htmlFor="password" className="text-pink-400">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="bg-black border-cyan-500 text-white"
                />
                <Label htmlFor="user_type" className="text-pink-400"> Are you a DJ or a Venue? </Label>
                <CNSelect name="user_type" required>
                  <SelectTrigger className="w-[180px] bg-black border-cyan-500 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="w-[180px] bg-black border-cyan-500 text-white">
                    <SelectItem value="DJ">DJ</SelectItem>
                    <SelectItem value="Venue">Venue</SelectItem>
                  </SelectContent>
                </CNSelect>
                <CardFooter>
                  <SubmitButton pendingText="Signing up..." formAction={signUpAction} className="w-full bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-bold">
                    Sign up
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