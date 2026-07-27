export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number;
  unit: string;
  quantity: number;
};
