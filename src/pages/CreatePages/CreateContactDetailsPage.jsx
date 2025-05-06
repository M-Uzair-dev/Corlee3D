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
    address_mandarin: "",
    city_mandarin: "",
    county_mandarin: "",
    country_mandarin: "",
    city: "",
    county: "",
    postal_code: "",
    country: "",
    latitude: "",
    longitude: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    line: "",
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
