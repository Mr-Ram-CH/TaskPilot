import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center gap-2 text-center">
            <Logo />
            <CardTitle className="text-2xl">Sign in to TaskPilot</CardTitle>
            <CardDescription>
                Enter your credentials to access your account.
            </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">
                {"Don't have an account? "}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </CardFooter>
      </Card>
    </main>
  );
}
