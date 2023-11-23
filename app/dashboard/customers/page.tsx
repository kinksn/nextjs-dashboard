import { Metadata } from 'next';
import { Suspense } from 'react';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import Table from '@/app/ui/customers/table';

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Customers({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: number;
}}) {
  const query = searchParams?.query || '';
  return (
    <div className="w-full">
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Table query={query} />
      </Suspense>
    </div>
  );
}