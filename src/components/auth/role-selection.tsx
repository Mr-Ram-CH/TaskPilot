'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { initialUsers } from '@/lib/data';

type Role = 'Project Manager' | 'User';

export function RoleSelection() {
  const { login } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loadingRole, setLoadingRole] = useState<Role | null>(null);

  const handleRoleSelect = async (role: Role) => {
    setLoadingRole(role);
    try {
      let userIdToLogin: string | undefined;

      if (role === 'Project Manager') {
        userIdToLogin = initialUsers.find(u => u.role === 'Project Manager')?.id;
      } else {
        userIdToLogin = initialUsers.find(u => u.role === 'User')?.id;
      }
      
      if (!userIdToLogin) {
        throw new Error(`No default ${role} found.`);
      }

      await login(userIdToLogin);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setLoadingRole(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-lg hover:border-primary',
          loadingRole === 'Project Manager' && 'animate-pulse'
        )}
        onClick={() => handleRoleSelect('Project Manager')}
      >
        <CardHeader className="items-center text-center">
          {loadingRole === 'Project Manager' ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <Shield className="h-10 w-10 text-primary" />
          )}
          <CardTitle>Project Manager</CardTitle>
          <CardDescription>Access the PM dashboard</CardDescription>
        </CardHeader>
      </Card>
      <Card
        className={cn(
          'cursor-pointer transition-all hover:shadow-lg hover:border-primary',
          loadingRole === 'User' && 'animate-pulse'
        )}
        onClick={() => handleRoleSelect('User')}
      >
        <CardHeader className="items-center text-center">
          {loadingRole === 'User' ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : (
            <User className="h-10 w-10 text-primary" />
          )}
          <CardTitle>User</CardTitle>
          <CardDescription>Access your assigned tasks</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
