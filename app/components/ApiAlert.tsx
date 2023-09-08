'use client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CopyIcon, ServerIcon } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

type Props = {
  title: string;
  description: string;
  variant: 'public' | 'admin';
};

const textMap: Record<Props['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
};

const variantMap: Record<Props['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
};

export const ApiAlert: React.FC<Props> = ({
  title,
  description,
  variant = 'public',
}) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success('API route copied to the clipboard.');
  };

  return (
    <Alert>
      <ServerIcon className='h-4 w-4' />
      <AlertTitle className='flex items-center gap-x-2'>
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className='mt-4 items-center justify-between'>
        <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
          {description}
        </code>
      </AlertDescription>
      <Button variant='outline' size='sm' onClick={onCopy}>
        <CopyIcon className='h-4 w-4' />
      </Button>
    </Alert>
  );
};
