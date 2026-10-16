function subscriptionPeriod(subscription, field, planItem) {
  const legacy = Reflect.get(subscription, field);
  if (typeof legacy === 'number') return legacy;
  const list = Reflect.get(subscription, 'items');
  const data = list && typeof list === 'object' ? Reflect.get(list, 'data') : undefined;
  const items = (Array.isArray(data) ? data : []).filter(
    (item) => typeof item === 'object' && item !== null,
  );
  const periods = new Set(items.map((item) => Reflect.get(item, field)));
  const chosen = periods.size === 1 ? items[0] : planItem?.(items);
  const value = chosen ? Reflect.get(chosen, field) : undefined;
  return typeof value === 'number' ? value : undefined;
}

export function getSubscriptionPeriodStart(subscription, planItem) {
  return subscriptionPeriod(subscription, 'current_period_start', planItem);
}

export function getSubscriptionPeriodEnd(subscription, planItem) {
  return subscriptionPeriod(subscription, 'current_period_end', planItem);
}

// The old top-level field when present (old-version payloads), otherwise the new location.
export function getInvoiceSubscription(invoice) {
  const legacy = Reflect.get(invoice, 'subscription');
  const parent = Reflect.get(invoice, 'parent');
  const details =
    parent && typeof parent === 'object' ? Reflect.get(parent, 'subscription_details') : undefined;
  const moved =
    details && typeof details === 'object' ? Reflect.get(details, 'subscription') : undefined;
  return (legacy !== undefined ? legacy : (moved ?? null));
}
