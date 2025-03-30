import React from "react";
import CreatePageTemplate from "./CreatePageTemplate";

function CreateOrderPage() {
  // Initial empty data for a new order
  const initialData = {
    order_number: "",
    customer_name: "",
    product: "",
    quantity: 1,
    total_price: 0,
    status: "Pending",
    order_date: new Date().toISOString().split("T")[0], // Default to today
  };

  return (
    <CreatePageTemplate
      entityName="Order"
      createEndpoint="/api/orders"
      redirectPath="/dashboard/orders"
      initialData={initialData}
    />
  );
}

export default CreateOrderPage;
