import { requireStaff } from "@/lib/auth/require-role";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New Product — Admin" };

export default async function NewProductPage() {
  await requireStaff();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-heading text-2xl font-semibold">New product</h1>
      <ProductForm />
    </div>
  );
}
