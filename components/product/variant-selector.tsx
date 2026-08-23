"use client";

import type { ProductOption, ProductVariant } from "@/types/shopify";

export function VariantSelector({
  options,
  selectedOptions,
  onChange,
  variants,
}: {
  options: ProductOption[];
  selectedOptions: Record<string, string>;
  onChange: (name: string, value: string) => void;
  variants: ProductVariant[];
}) {
  function isValueAvailable(optionName: string, value: string): boolean {
    return variants.some(
      (variant) =>
        variant.availableForSale &&
        variant.selectedOptions.every((opt) => (opt.name === optionName ? opt.value === value : opt.value === selectedOptions[opt.name] || true))
    );
  }

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.name}>
          <p className="mb-2 text-sm font-medium">
            {option.name}: <span className="font-normal text-stone-600">{selectedOptions[option.name]}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const selected = selectedOptions[option.name] === value;
              const available = isValueAvailable(option.name, value);
              return (
                <button
                  key={value}
                  onClick={() => onChange(option.name, value)}
                  disabled={!available}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selected
                      ? "border-ink bg-ink text-paper"
                      : available
                      ? "border-border hover:border-ink"
                      : "border-stone-200 text-stone-400 line-through"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
