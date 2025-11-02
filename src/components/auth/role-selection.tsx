'use client';

import { useRouter } from 'next/navigation';
import { User, Shield } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';

type Role = 'Project Manager' | 'User';

export function RoleSelection() {
  const router = useRouter();

  const handleRoleSelect = (role: Role) => {
    // Navigate to the login page with the selected role as a query parameter
    const roleParam = role.toLowerCase().replace(' ', '-');
    router.push(`/login?role=${roleParam}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
        onClick={() => handleRoleSelect('Project Manager')}
      >
        <CardHeader className="items-center text-center">
          <Shield className="h-10 w-10 text-primary" />
          <CardTitle>Project Manager</CardTitle>
          <CardDescription>Access the PM dashboard</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
        onClick={() => handleRoleSelect('User')}
      >
        <CardHeader className="items-center text-center">
          <User className="h-10 w-10 text-primary" />
          <CardTitle>User</CardTitle>
          <CardDescription>Access your assigned tasks</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
