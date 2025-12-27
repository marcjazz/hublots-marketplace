import { Button, Input } from "@medusajs/ui";
import { useForm } from "react-hook-form";

import { useCreateProduct } from "../../../../hooks/api/products";

const ServiceCreateForm = () => {
  const form = useForm();
  const { mutateAsync } = useCreateProduct();

  const onSubmit = async (data: any) => {
    await mutateAsync(data);
  };

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center">Create Service</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
          <div className="flex flex-col gap-y-4">
            <Input {...form.register("title")} placeholder="Title" />
            <Input {...form.register("description")} placeholder="Description" />
            <Input {...form.register("category")} placeholder="Category" />
            <Input
              {...form.register("min_price")}
              type="number"
              placeholder="Min Price"
            />
            <Input
              {...form.register("max_price")}
              type="number"
              placeholder="Max Price"
            />
          </div>
          <Button className="mt-8 w-full">Create</Button>
        </form>
      </div>
    </div>
  );
};

export { ServiceCreateForm };
