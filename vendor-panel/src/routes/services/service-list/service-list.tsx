import { Button } from "@medusajs/ui";

const ServiceList = () => {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <Button>Create Service</Button>
      </div>
    </div>
  );
};

export { ServiceList };
