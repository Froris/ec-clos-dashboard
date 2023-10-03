'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';

type Image = { url: string; cloudinaryImageId: string };

type Props = {
  isBillboard?: boolean;
  disabled?: boolean;
  onChange: (value: { url: string; cloudinaryImageId: string }) => void;
  onRemove: (value: string) => void;
  value: Image[];
};

export const ImageUpload: React.FC<Props> = ({
  isBillboard = false,
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [mounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange({
      url: result.info.secure_url,
      cloudinaryImageId: result.info.public_id,
    });
  };

  if (!mounted) return null;

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {value.map(
          ({ url, cloudinaryImageId }) =>
            url && (
              <div
                key={cloudinaryImageId}
                className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                <div className='z-10 absolute top-2 right-2'>
                  <Button
                    type='button'
                    onClick={() => onRemove(cloudinaryImageId)}
                    variant='destructive'
                    size='icon'>
                    <TrashIcon className='h-4 w-4' />
                  </Button>
                </div>

                <Image fill className='object-cover' alt='Image' src={url} />
              </div>
            )
        )}
      </div>
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset='fbldikmi'
        options={{ multiple: !isBillboard }}>
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type='button'
              disabled={disabled}
              variant='secondary'
              onClick={onClick}>
              <ImagePlus className='h-4 w-4 mr-2' />
              Upload an image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
