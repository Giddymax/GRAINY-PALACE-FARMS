/**
 * Canonical product taxonomy (brief §3). This is the single source of truth
 * mirrored into `supabase/schema.sql` seed data — keep the two in sync.
 */
export type Subcategory = {
  slug: string;
  name: string;
};

/** Lucide icon name used as the branded fallback tile until real product
 *  photography is uploaded via the admin Catalogue (Storage-backed image_url). */
export type Category = {
  slug: string;
  name: string;
  blurb: string;
  icon: CategoryIconName;
  subcategories: Subcategory[];
};

export type CategoryIconName =
  | "wheat"
  | "bean"
  | "carrot"
  | "sprout"
  | "flower"
  | "egg"
  | "beef"
  | "fish"
  | "trees"
  | "package"
  | "tractor";

export const categories: Category[] = [
  {
    slug: "grains-cereals",
    name: "Grains & Cereals",
    blurb: "Maize, rice, millet and sorghum from certified fields.",
    icon: "wheat",
    subcategories: [
      { slug: "maize-grain", name: "Maize (Grain)" },
      { slug: "milled-maize", name: "Milled Maize" },
      { slug: "rice", name: "Rice (Paddy & Milled)" },
      { slug: "millet", name: "Millet" },
      { slug: "sorghum", name: "Sorghum" },
    ],
  },
  {
    slug: "legumes-nuts",
    name: "Legumes & Nuts",
    blurb: "Protein-rich cowpea, soybean and groundnut.",
    icon: "bean",
    subcategories: [
      { slug: "cowpea", name: "Cowpea (Beans)" },
      { slug: "soybean", name: "Soybean" },
      { slug: "groundnut", name: "Groundnut" },
    ],
  },
  {
    slug: "vegetables",
    name: "Vegetables",
    blurb: "Fresh and crated tomatoes, okra, garden eggs and pepper.",
    icon: "carrot",
    subcategories: [
      { slug: "tomatoes", name: "Tomatoes" },
      { slug: "okra", name: "Okra" },
      { slug: "garden-eggs", name: "Garden Eggs" },
      { slug: "pepper", name: "Pepper" },
    ],
  },
  {
    slug: "roots-tubers",
    name: "Roots & Tubers",
    blurb: "Cassava, yam and cocoyam straight from the farm.",
    icon: "sprout",
    subcategories: [
      { slug: "cassava", name: "Cassava" },
      { slug: "yam", name: "Yam" },
      { slug: "cocoyam", name: "Cocoyam" },
    ],
  },
  {
    slug: "cash-industrial-crops",
    name: "Cash & Industrial Crops",
    blurb: "Sesame (beniseed) and shea for processors and exporters.",
    icon: "flower",
    subcategories: [
      { slug: "sesame", name: "Sesame (Beniseed)" },
      { slug: "shea", name: "Shea" },
    ],
  },
  {
    slug: "poultry-eggs",
    name: "Poultry & Eggs",
    blurb: "Cage-free eggs, dressed and frozen chicken, guinea fowl.",
    icon: "egg",
    subcategories: [
      { slug: "dressed-chicken", name: "Dressed Chicken" },
      { slug: "frozen-chicken-portions", name: "Frozen Chicken Portions" },
      { slug: "live-broilers", name: "Live Broilers" },
      { slug: "table-eggs", name: "Table Eggs" },
      { slug: "guinea-fowl", name: "Guinea Fowl" },
    ],
  },
  {
    slug: "meat-livestock",
    name: "Meat & Livestock",
    blurb: "Chevon, mutton, pork, rabbit and live animals.",
    icon: "beef",
    subcategories: [
      { slug: "chevon-goat", name: "Chevon (Goat)" },
      { slug: "mutton-sheep", name: "Mutton (Sheep)" },
      { slug: "pork", name: "Pork" },
      { slug: "rabbit", name: "Rabbit" },
      { slug: "live-animals", name: "Live Animals" },
      { slug: "halal-beef", name: "Halal Beef (Coming Soon)" },
    ],
  },
  {
    slug: "fish-seafood",
    name: "Fish & Seafood",
    blurb: "Fresh and smoked tilapia, catfish and frozen fillets.",
    icon: "fish",
    subcategories: [
      { slug: "fresh-tilapia", name: "Fresh Tilapia" },
      { slug: "fresh-catfish", name: "Fresh Catfish" },
      { slug: "smoked-catfish", name: "Smoked Catfish" },
      { slug: "frozen-tilapia-fillets", name: "Frozen Tilapia Fillets" },
    ],
  },
  {
    slug: "seedlings",
    name: "Tree & Economic Plants (Seedlings)",
    blurb: "Oil palm, cocoa, cashew, moringa and agroforestry seedlings.",
    icon: "trees",
    subcategories: [
      { slug: "oil-palm", name: "Oil Palm" },
      { slug: "cocoa", name: "Cocoa" },
      { slug: "cashew", name: "Cashew" },
      { slug: "mango", name: "Mango" },
      { slug: "citrus", name: "Citrus" },
      { slug: "moringa", name: "Moringa" },
      { slug: "shea-seedling", name: "Shea" },
      { slug: "teak", name: "Teak" },
      { slug: "plantain-suckers", name: "Plantain Suckers" },
      { slug: "mixed-agroforestry", name: "Mixed Agroforestry Seedlings" },
    ],
  },
  {
    slug: "processed-foods",
    name: "Processed & Value-Added Foods",
    blurb: "Organic flours, porridge mixes, cold-pressed oils and gift baskets.",
    icon: "package",
    subcategories: [
      { slug: "organic-flours", name: "Organic Flours" },
      { slug: "porridge-weaning-mixes", name: "Porridge & Weaning Mixes" },
      { slug: "cold-pressed-oils", name: "Cold-Pressed Groundnut & Sesame Oil" },
      { slug: "dried-vegetable-packs", name: "Dried Vegetable Packs" },
      { slug: "gift-baskets", name: "Branded Grain Gift Baskets" },
    ],
  },
  {
    slug: "farm-inputs-feed",
    name: "Farm Inputs & Feed",
    blurb: "Livestock feed, organic compost and certified seeds/fingerlings.",
    icon: "tractor",
    subcategories: [
      { slug: "livestock-feed", name: "Livestock/Poultry Feed" },
      { slug: "organic-compost", name: "Organic Compost Fertiliser" },
      { slug: "seeds-fingerlings", name: "Certified Seeds & Fingerlings" },
    ],
  },
];

export const productUnits = [
  "kg",
  "bag",
  "crate",
  "dozen",
  "pack",
  "each",
  "seedling",
  "litre",
  "olonka",
] as const;

export const productTags = [
  "Organic",
  "Cage-Free",
  "Halal",
  "Smoked",
  "Frozen",
  "Fresh",
  "Certified",
  "Traceable",
] as const;

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
