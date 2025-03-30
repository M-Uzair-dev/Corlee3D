import React from "react";
import CreatePageTemplate from "./CreatePageTemplate";

function CreateContactDetailsPage() {
  // Initial empty data for new contact details
  const initialData = {
    address: "",
    phone: "",
    email: "",
    business_hours: "",
    map_location: "",
  };

  return (
    <CreatePageTemplate
      entityName="Contact Details"
      createEndpoint="/api/contact-details"
      redirectPath="/dashboard/contact-details"
      initialData={initialData}
    />
  );
}

export default CreateContactDetailsPage;
