'use client';
import { useParams } from 'next/navigation';
import { useOrigin } from '@/hooks/useOrigin';
import { ApiAlert } from '@/components/ApiAlert';

interface Props {
  entityName: string;
  entityIdName: string;
}

export const ApiList: React.FC<Props> = ({ entityName, entityIdName }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseURL = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title='GET'
        description={`${baseURL}/${entityName}`}
        variant='public'
      />
      <ApiAlert
        title='GET'
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
        variant='public'
      />
      <ApiAlert
        title='POST'
        description={`${baseURL}/${entityName}`}
        variant='admin'
      />
      <ApiAlert
        title='PATCH'
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
        variant='admin'
      />
      <ApiAlert
        title='DELETE'
        description={`${baseURL}/${entityName}/{${entityIdName}}`}
        variant='admin'
      />
    </>
  );
};
