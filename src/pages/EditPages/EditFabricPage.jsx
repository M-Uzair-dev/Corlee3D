import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import "./EditPages.css";

function EditFabricPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    item_code: "",
    description: "",
    composition: "",
    weight: "",
    finish: "",
    product_category: "",
    is_hot_selling: false,
    color_images: [
      {
        color_category: "",
        primary_image: null,
        aux_image1: null,
        aux_image2: null,
        aux_image3: null,
        model_image: null,
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [productCategories, setProductCategories] = useState([]);
  const [colorCategories, setColorCategories] = useState([]);
  const [imageDetails, setImageDetails] = useState({});

  // Media gallery state
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState(null);
  const [currentColorIndex, setCurrentColorIndex] = useState(null);

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [fabricRes, productCategoriesRes, colorCategoriesRes] =
          await Promise.all([
            api.get(`/fabrics/withids/${id}`),
            api.get("/product-categories"),
            api.get("/color-categories"),
          ]);
        // Get data from correct paths in the API responses
        const productCategoriesData = productCategoriesRes?.data?.results || [];
        const colorCategoriesData = colorCategoriesRes?.data || [];

        setProductCategories(productCategoriesData);
        setColorCategories(colorCategoriesData);

        // Log raw data for debugging
        console.log("Raw fabric data:", fabricRes?.data);
        console.log("Product categories:", productCategoriesData);
        console.log("Color categories:", colorCategoriesData);

        const fabricData = fabricRes?.data || {};

        // Find product category ID from name
        let productCategoryId = "";
        if (fabricData?.product_category_name) {
          const matchingCategory = productCategoriesData.find(
            (cat) =>
              cat?.name?.toLowerCase() ===
              fabricData.product_category_name.toLowerCase()
          );
          if (matchingCategory) {
            productCategoryId = matchingCategory.id;
            console.log(
              `Matched product category '${fabricData.product_category_name}' to ID ${productCategoryId}`
            );
          } else {
            console.log(
              `Could not find matching product category for: ${fabricData.product_category_name}`
            );
          }
        }

        // Process color images
        let formattedColorImages = [];
        // Create a map to store original image IDs
        const originalImageIds = {};

        if (
          fabricData?.color_images &&
          Array.isArray(fabricData.color_images)
        ) {
          formattedColorImages = fabricData.color_images.map((colorImg) => {
            // Find color category ID from name
            let colorCategoryId = "";
            if (colorImg?.color) {
              // Try multiple matching strategies
              const matchingColor = colorCategoriesData.find((cat) => {
                const catName = cat?.name?.toLowerCase() || "";
                const catDisplayName = cat?.display_name?.toLowerCase() || "";
                const imgColor = colorImg.color.toLowerCase();

                return catName === imgColor || catDisplayName === imgColor;
              });

              if (matchingColor) {
                colorCategoryId = matchingColor.id;
                console.log(
                  `Matched color '${colorImg.color}' to category ID ${colorCategoryId}`
                );
              } else {
                console.log(
                  `Could not find matching category for color: ${colorImg.color}`
                );
                // If we can't find a perfect match, use the first color category as fallback
                if (colorCategoriesData.length > 0) {
                  colorCategoryId = colorCategoriesData[0].id;
                  console.log(
                    `Using fallback category ID ${colorCategoryId} for color ${colorImg.color}`
                  );
                }
              }
            }

            // Use actual image IDs from the API response when available
            // Otherwise, create temporary IDs for backward compatibility
            const getImageId = (idField, urlField) => {
              // If we have an explicit ID from the API, use that
              if (colorImg[idField]) {
                return colorImg[idField];
              }
              // Fall back to creating a temp ID from URL if no ID is provided
              else if (colorImg[urlField]) {
                const tempId = `temp-${colorImg[urlField].split("/").pop()}`;
                return tempId;
              }
              return null;
            };

            // Get image IDs using the new fields from API
            const primaryImageId = getImageId(
              "primary_image_id",
              "primary_image_url"
            );
            const auxImage1Id = getImageId("aux_image1_id", "aux_image1_url");
            const auxImage2Id = getImageId("aux_image2_id", "aux_image2_url");
            const auxImage3Id = getImageId("aux_image3_id", "aux_image3_url");
            const modelImageId = getImageId(
              "model_image_id",
              "model_image_url"
            );

            // Add image details to our state
            const updateImageDetails = (id, url) => {
              if (id && url) {
                setImageDetails((prev) => ({
                  ...prev,
                  [id]: { id, file_url: url },
                }));
              }
            };

            // Set image details for all images
            updateImageDetails(primaryImageId, colorImg?.primary_image_url);
            updateImageDetails(auxImage1Id, colorImg?.aux_image1_url);
            updateImageDetails(auxImage2Id, colorImg?.aux_image2_url);
            updateImageDetails(auxImage3Id, colorImg?.aux_image3_url);
            updateImageDetails(modelImageId, colorImg?.model_image_url);

            return {
              color_category: colorCategoryId,
              primary_image: primaryImageId,
              aux_image1: auxImage1Id,
              aux_image2: auxImage2Id,
              aux_image3: auxImage3Id,
              model_image: modelImageId,
            };
          });
        }

        // Ensure we have at least one color image
        if (formattedColorImages.length === 0) {
          formattedColorImages = [
            {
              color_category: "",
              primary_image: null,
              aux_image1: null,
              aux_image2: null,
              aux_image3: null,
              model_image: null,
            },
          ];
        }

        // Set form data from API response
        const updatedFormData = {
          title: fabricData?.title || "",
          item_code: fabricData?.item_code || "",
          description: fabricData?.description || "",
          composition: fabricData?.composition || "",
          weight: fabricData?.weight || "",
          finish: fabricData?.finish || "",
          product_category: productCategoryId,
          is_hot_selling: fabricData?.is_hot_selling || false,
          color_images: formattedColorImages,
          // Store the mapping of temporary IDs to original IDs
          _originalImageIds: originalImageIds,
        };

        console.log("Processed form data:", updatedFormData);
        console.log("Original image IDs mapping:", originalImageIds);
        setFormData(updatedFormData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load fabric data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle color image field changes
  const handleColorImageChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedColorImages = [...prevData.color_images];
      updatedColorImages[index] = {
        ...updatedColorImages[index],
        [field]: value,
      };
      return {
        ...prevData,
        color_images: updatedColorImages,
      };
    });
  };

  // Add a new color image
  const addColorImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      color_images: [
        ...prevData.color_images,
        {
          color_category: "",
          primary_image: null,
          aux_image1: null,
          aux_image2: null,
          aux_image3: null,
          model_image: null,
        },
      ],
    }));
  };

  // Remove a color image
  const removeColorImage = (index) => {
    if (formData.color_images.length > 1) {
      setFormData((prevData) => {
        const updatedColorImages = [...prevData.color_images];
        updatedColorImages.splice(index, 1);
        return {
          ...prevData,
          color_images: updatedColorImages,
        };
      });
    } else {
      toast.error("At least one color image is required");
    }
  };

  // Open media gallery to select an image
  const openMediaGallery = (colorIndex, field) => {
    setCurrentColorIndex(colorIndex);
    setCurrentImageField(field);
    setIsGalleryOpen(true);
  };

  // Handle image selection from media gallery
  const handleSelectImage = (imageId) => {
    if (currentColorIndex !== null && currentImageField !== null) {
      // Update the color image with the selected image
      handleColorImageChange(currentColorIndex, currentImageField, imageId);
      fetchImageDetails(imageId);

      // Close the gallery
      setIsGalleryOpen(false);
      setCurrentColorIndex(null);
      setCurrentImageField(null);
    }
  };

  // Fetch image details when an image is selected
  const fetchImageDetails = async (imageId) => {
    if (!imageId) return;

    try {
      // Skip if we already have this image's details
      if (imageDetails[imageId]) return;

      // For temporary IDs (URLs), we already have the details
      if (String(imageId).startsWith("temp-")) return;

      const response = await api.get(`/media/${imageId}/`);
      setImageDetails((prevDetails) => ({
        ...prevDetails,
        [imageId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching image details for ID ${imageId}:`, error);
    }
  };

  // Fetch image details for existing images when component mounts
  useEffect(() => {
    if (!isLoading) {
      formData.color_images.forEach((colorImage) => {
        const imageFields = [
          "primary_image",
          "aux_image1",
          "aux_image2",
          "aux_image3",
          "model_image",
        ];

        imageFields.forEach((field) => {
          if (
            colorImage[field] &&
            !String(colorImage[field]).startsWith("temp-")
          ) {
            fetchImageDetails(colorImage[field]);
          }
        });
      });
    }
  }, [formData.color_images, isLoading]);

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Transform form data for API
      const fabricData = {
        title: formData.title,
        item_code: formData.item_code,
        description: formData.description,
        composition: formData.composition,
        weight: formData.weight,
        finish: formData.finish,
        product_category: parseInt(formData.product_category, 10),
        is_hot_selling: formData.is_hot_selling,
        color_images: formData.color_images
          .filter((image) => image.color_category)
          .map((image) => {
            // Process each image's fields
            const processImage = (imageId) => {
              if (!imageId) return null;

              // If it's a numeric ID or not a temp ID, it's a valid backend ID
              if (!String(imageId).startsWith("temp-")) {
                return imageId;
              }

              // For temporary IDs, return null - backend will handle missing IDs
              return null;
            };

            return {
              color_category: parseInt(image.color_category, 10),
              primary_image: processImage(image.primary_image),
              aux_image1: processImage(image.aux_image1),
              aux_image2: processImage(image.aux_image2),
              aux_image3: processImage(image.aux_image3),
              model_image: processImage(image.model_image),
            };
          }),
      };

      console.log("Submitting data:", fabricData);
      // Use the update endpoint as specified in the API docs
      const response = await api.put(`/fabrics/${id}/update/`, fabricData);
      console.log("API Response:", response?.data);

      toast.success("Fabric updated successfully!");
      navigate("/dashboard/fabrics");
    } catch (error) {
      console.error("Error updating fabric:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data,
        endpoint: `/fabrics/${id}/update/`,
      });

      // Try to extract the most helpful error message
      let errorMsg;
      if (error?.response?.data) {
        if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else if (typeof error.response.data === "object") {
          const errorData = error.response.data;
          if (errorData.detail) {
            errorMsg = errorData.detail;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          } else {
            // Check for field-specific errors
            const fieldErrors = Object.entries(errorData)
              .filter(
                ([key, value]) =>
                  typeof value === "string" || Array.isArray(value)
              )
              .map(([key, value]) => {
                const errorValue = Array.isArray(value)
                  ? value.join(", ")
                  : value;
                return `${key}: ${errorValue}`;
              });

            if (fieldErrors.length > 0) {
              errorMsg = fieldErrors.join("\n");
            } else {
              errorMsg = JSON.stringify(errorData);
            }
          }
        }
      } else {
        errorMsg = error?.message || "An unknown error occurred";
      }

      setErrorMessage(`Failed to update fabric: ${errorMsg}`);
      toast.error("Error updating fabric");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="dashboard-content-card"
        style={{ position: "relative", minHeight: "300px" }}
      >
        <LoadingSpinner text="Loading fabric data..." overlay />
      </div>
    );
  }

  return (
    <div className="dashboard-content-card create-page-container">
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/fabrics")}
        >
          ← Back to Fabrics
        </button>
      </div>

      <h2
        className="create-heading"
        onClick={() => {
          console.log("Current form data:", formData);
          console.log("Image details:", imageDetails);
          console.log("Product categories:", productCategories);
          console.log("Color categories:", colorCategories);
        }}
      >
        Edit Fabric
      </h2>

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-section">
          <h3>Fabric Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="item_code">Item Code *</label>
              <input
                type="text"
                id="item_code"
                name="item_code"
                value={formData.item_code}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="product_category">Product Category *</label>
            <select
              id="product_category"
              name="product_category"
              value={formData.product_category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {productCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="composition">Composition</label>
              <input
                type="text"
                id="composition"
                name="composition"
                value={formData.composition}
                onChange={handleInputChange}
                placeholder="e.g., 100% Cotton"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 200 gsm"
              />
            </div>

            <div className="form-group">
              <label htmlFor="finish">Finish</label>
              <input
                type="text"
                id="finish"
                name="finish"
                value={formData.finish}
                onChange={handleInputChange}
                placeholder="e.g., Soft, Matte"
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="is_hot_selling"
              name="is_hot_selling"
              checked={formData.is_hot_selling}
              onChange={handleInputChange}
            />
            <label htmlFor="is_hot_selling">Mark as Hot Selling</label>
          </div>
        </div>

        <div className="form-section">
          <h3>Color Images</h3>
          <p className="section-info">
            Add at least one color with a primary image
          </p>

          {formData.color_images.map((colorImage, index) => (
            <div key={index} className="color-image-container">
              <div className="color-image-header">
                <h4>Color Variant {index + 1}</h4>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeColorImage(index)}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label htmlFor={`color_category_${index}`}>
                  Color Category *
                </label>
                <select
                  id={`color_category_${index}`}
                  value={colorImage.color_category}
                  onChange={(e) =>
                    handleColorImageChange(
                      index,
                      "color_category",
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">Select a color</option>
                  {colorCategories.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color?.display_name || color?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="images-grid">
                <div className="image-item">
                  <label>Primary Image *</label>
                  <div className="image-preview">
                    {colorImage.primary_image ? (
                      imageDetails[colorImage.primary_image] ? (
                        <>
                          <img
                            src={
                              imageDetails[colorImage.primary_image]?.file_url
                            }
                            alt="Primary"
                            className="preview-image"
                          />
                          <button
                            className="remove-preview-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorImageChange(
                                index,
                                "primary_image",
                                null
                              );
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="selected-image">Loading image...</div>
                      )
                    ) : (
                      <div className="no-image">No image selected</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="select-image-button"
                    onClick={() => openMediaGallery(index, "primary_image")}
                  >
                    Select Image
                  </button>
                </div>

                <div className="image-item">
                  <label>Additional Image 1</label>
                  <div className="image-preview">
                    {colorImage.aux_image1 ? (
                      imageDetails[colorImage.aux_image1] ? (
                        <>
                          <img
                            src={imageDetails[colorImage.aux_image1]?.file_url}
                            alt="Additional 1"
                            className="preview-image"
                          />
                          <button
                            className="remove-preview-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorImageChange(index, "aux_image1", null);
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="selected-image">Loading image...</div>
                      )
                    ) : (
                      <div className="no-image">No image selected</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="select-image-button"
                    onClick={() => openMediaGallery(index, "aux_image1")}
                  >
                    Select Image
                  </button>
                </div>

                <div className="image-item">
                  <label>Additional Image 2</label>
                  <div className="image-preview">
                    {colorImage.aux_image2 ? (
                      imageDetails[colorImage.aux_image2] ? (
                        <>
                          <img
                            src={imageDetails[colorImage.aux_image2]?.file_url}
                            alt="Additional 2"
                            className="preview-image"
                          />
                          <button
                            className="remove-preview-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorImageChange(index, "aux_image2", null);
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="selected-image">Loading image...</div>
                      )
                    ) : (
                      <div className="no-image">No image selected</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="select-image-button"
                    onClick={() => openMediaGallery(index, "aux_image2")}
                  >
                    Select Image
                  </button>
                </div>

                <div className="image-item">
                  <label>Additional Image 3</label>
                  <div className="image-preview">
                    {colorImage.aux_image3 ? (
                      imageDetails[colorImage.aux_image3] ? (
                        <>
                          <img
                            src={imageDetails[colorImage.aux_image3]?.file_url}
                            alt="Additional 3"
                            className="preview-image"
                          />
                          <button
                            className="remove-preview-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorImageChange(index, "aux_image3", null);
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="selected-image">Loading image...</div>
                      )
                    ) : (
                      <div className="no-image">No image selected</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="select-image-button"
                    onClick={() => openMediaGallery(index, "aux_image3")}
                  >
                    Select Image
                  </button>
                </div>

                <div className="image-item">
                  <label>Model Image</label>
                  <div className="image-preview">
                    {colorImage.model_image ? (
                      imageDetails[colorImage.model_image] ? (
                        <>
                          <img
                            src={imageDetails[colorImage.model_image]?.file_url}
                            alt="Model"
                            className="preview-image"
                          />
                          <button
                            className="remove-preview-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleColorImageChange(
                                index,
                                "model_image",
                                null
                              );
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <div className="selected-image">Loading image...</div>
                      )
                    ) : (
                      <div className="no-image">No image selected</div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="select-image-button"
                    onClick={() => openMediaGallery(index, "model_image")}
                  >
                    Select Image
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="add-color-button"
            onClick={addColorImage}
          >
            Add Another Color
          </button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/dashboard/fabrics")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Fabric"}
          </button>
        </div>
      </form>

      <MediaGalleryPopup
        isOpen={isGalleryOpen}
        setIsOpen={setIsGalleryOpen}
        onSelectImage={handleSelectImage}
      />

      <style jsx>{`
        .create-heading {
          color: #4285f4;
          margin-bottom: 24px;
        }

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .section-info {
          color: #666;
          font-size: 14px;
          margin-top: -8px;
          margin-bottom: 16px;
        }

        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 8px;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
          flex: 1;
        }

        label {
          font-weight: 500;
          margin-bottom: 8px;
          color: #333;
        }

        input[type="text"],
        input[type="number"],
        textarea,
        select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .checkbox-group {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        .checkbox-group label {
          margin-bottom: 0;
        }

        .color-image-container {
          background-color: #fff;
          border: 1px solid #eee;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .color-image-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .color-image-header h4 {
          margin: 0;
          color: #333;
        }

        .remove-button {
          background-color: #f8f8f8;
          color: #d32f2f;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
        }

        .remove-button:hover {
          background-color: #fff0f0;
          border-color: #ffcdd2;
        }

        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .image-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .image-preview {
          height: 150px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f7fa;
          overflow: hidden;
          position: relative;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease-in-out;
        }

        .image-preview:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .remove-preview-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: rgba(255, 0, 0, 0.8);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          padding: 0;
          line-height: 1;
          aspect-ratio: 1;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .image-preview:hover .remove-preview-button {
          opacity: 1;
        }

        .preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 6px;
          transition: transform 0.3s ease;
        }

        .image-preview:hover .preview-image {
          transform: scale(1.03);
        }

        .no-image {
          color: #999;
          font-size: 13px;
          padding: 20px;
          border: 1px dashed #ccc;
          border-radius: 6px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fafbfc;
        }

        .selected-image {
          color: #333;
          font-size: 13px;
          text-align: center;
          padding: 8px;
          background-color: #f1f3f4;
          border-radius: 6px;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .select-image-button {
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .select-image-button:hover {
          background-color: #e3e3e3;
          transform: translateY(-1px);
        }

        .add-color-button {
          background-color: #f1f3f4;
          color: #1a73e8;
          border: 1px dashed #1a73e8;
          border-radius: 4px;
          padding: 10px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 100%;
          margin-top: 8px;
        }

        .add-color-button:hover {
          background-color: #e8f0fe;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 24px;
        }

        .cancel-button {
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cancel-button:hover {
          background-color: #e3e3e3;
        }

        .submit-button {
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #3367d6;
        }

        .submit-button:disabled {
          background-color: #a8c7fa;
          cursor: not-allowed;
        }

        .error-message {
          background-color: #fdeded;
          color: #d32f2f;
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
          gap: 16px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #4285f4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default EditFabricPage;
