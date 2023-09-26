import { useEffect, useState } from 'react';

export const useOrigin = () => {
  const [origin, setOrigin] = useState('');
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const currentOrigin = window.location.origin || '';
      setOrigin(currentOrigin);
    }
  }, [mounted]);

  return origin;
};
