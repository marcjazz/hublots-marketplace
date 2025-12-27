'use client';

import { useState } from 'react';

import { HttpTypes } from '@medusajs/types';
import { Heading, Label } from '@medusajs/ui';

import { Button, Input } from '@/components/atoms';
import { applyPromotions } from '@/lib/data/cart';
import { toast } from '@/lib/helpers/toast';

export default function CartPromotionCode({ cart }: { cart: HttpTypes.StoreCart | null }) {
  const [promotionCode, setPromotionCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleApplyPromotionCode = async () => {
    if (!promotionCode || isLoading) return;

    setIsLoading(true);
    setHasError(false);
    try {
      const result = await applyPromotions([promotionCode]);

      if (!result.success) {
        toast.info({ title: result.error });
        setHasError(true);
        return;
      }

      if (!result.applied) {
        toast.info({ title: 'Promotion code not found' });
        setHasError(true);
        return;
      }

      toast.success({ title: 'Promotion code applied' });
      setPromotionCode('');
      setHasError(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyPromotionCode();
    }
  };

  return (
    <div>
      <Heading
        level="h2"
        className="text-3xl-regular flex flex-row items-center items-baseline gap-x-2"
      >
        Promotion code
      </Heading>
      <div>
        {(() => {
          const promos: any[] = Array.isArray((cart as any)?.promotions) ? (cart as any).promotions : [];
          return promos.map(promo => (
            <div
              key={promo.id}
              className="mb-4 flex flex-row items-center gap-x-2"
            >
              <Label className="text-md">{promo.code}</Label>
            </div>
          ));
        })()}
      </div>
      <Input
        placeholder="Enter your promotion code"
        value={promotionCode}
        onChange={e => {
          setPromotionCode(e.target.value);
          setHasError(false);
        }}
        onKeyDown={handleKeyDown}
        error={hasError}
      />
      <div className="flex justify-end">
        <Button
          className="mt-4 px-6"
          onClick={handleApplyPromotionCode}
          disabled={isLoading || !promotionCode}
          loading={isLoading}
          variant="tonal"
        >
          Use promotion code
        </Button>
      </div>
    </div>
  );
}
