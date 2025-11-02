import { RoleSelection } from '@/components/auth/role-selection';
import { Logo } from '@/components/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center justify-center gap-2 text-center">
          <Logo />
          <CardTitle className="text-2xl">Welcome to TaskPilot</CardTitle>
          <CardDescription>Please select your role to continue.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <RoleSelection />
        </CardContent>
      </Card>
    </main>
  );
}
