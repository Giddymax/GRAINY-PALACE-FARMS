import {
  Wheat,
  Bean,
  Carrot,
  Sprout,
  Flower2,
  Egg,
  Beef,
  Fish,
  Trees,
  Package,
  Tractor,
  type LucideIcon,
} from "lucide-react";
import type { CategoryIconName } from "@/lib/taxonomy";

const iconMap: Record<CategoryIconName, LucideIcon> = {
  wheat: Wheat,
  bean: Bean,
  carrot: Carrot,
  sprout: Sprout,
  flower: Flower2,
  egg: Egg,
  beef: Beef,
  fish: Fish,
  trees: Trees,
  package: Package,
  tractor: Tractor,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: CategoryIconName;
  className?: string;
}) {
  const Icon = iconMap[name] ?? Package;
  return <Icon className={className} aria-hidden="true" />;
}
