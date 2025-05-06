import React, { useState, useEffect } from "react";
import { api } from "../../config/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import MediaGalleryPopup from "../../components/MediaGalleryPopup";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import { handleApiError } from "../../util/errorHandling";
import "./CreatePages.css";

function CreateFabricPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [productCategories, setProductCategories] = useState([]);
  const [colorCategories, setColorCategories] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageField, setActiveImageField] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    composition: "",
    weight: "",
    finish: "",
    title_mandarin: "",
    description_mandarin: "",
    composition_mandarin: "",
    weight_mandarin: "",
    finish_mandarin: "",
    item_code: "",
    is_hot_selling: false,
    product_category: "",
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

  // Add new state for image previews
  const [imageDetails, setImageDetails] = useState({});

  // Fetch product categories and color categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [productResponse, colorResponse] = await Promise.all([
          api.get("/product-categories/"),
          api.get("/color-categories/"),
        ]);

        setProductCategories(
          productResponse.data.results || productResponse.data
        );
        setColorCategories(colorResponse.data.results || colorResponse.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories data");
      }
    };

    fetchCategories();
  }, []);

  // Fetch image details when an image is selected
  const fetchImageDetails = async (imageId) => {
    if (!imageId) return;

    try {
      // Check if we already have this image's details
      if (imageDetails[imageId]) return;

      const response = await api.get(`/media/${imageId}/`);
      setImageDetails((prevDetails) => ({
        ...prevDetails,
        [imageId]: response.data,
      }));
    } catch (error) {
      console.error(`Error fetching image details for ID ${imageId}:`, error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle color images changes
  const handleColorImageChange = (index, field, value) => {
    const updatedColorImages = [...formData.color_images];
    updatedColorImages[index] = {
      ...updatedColorImages[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      color_images: updatedColorImages,
    });
  };

  // Open media gallery for selecting an image
  const openMediaGallery = (index, field) => {
    setActiveImageField({ index, field });
    setIsGalleryOpen(true);
  };

  // Enhanced handleSelectImage to also fetch image details
  const handleSelectImage = (imageId) => {
    if (activeImageField) {
      const { index, field } = activeImageField;
      handleColorImageChange(index, field, imageId);
      fetchImageDetails(imageId);
    }
    setIsGalleryOpen(false);
  };

  // Fetch image details for existing images on component mount and when color_images change
  useEffect(() => {
    formData.color_images.forEach((colorImage) => {
      const imageFields = [
        "primary_image",
        "aux_image1",
        "aux_image2",
        "aux_image3",
        "model_image",
      ];
      imageFields.forEach((field) => {
        if (colorImage[field]) {
          fetchImageDetails(colorImage[field]);
        }
      });
    });
  }, [formData.color_images]);

  // Add a new color image entry
  const addColorImage = () => {
    setFormData({
      ...formData,
      color_images: [
        ...formData.color_images,
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
  };

  // Remove a color image entry
  const removeColorImage = (index) => {
    if (formData.color_images.length > 1) {
      const updatedColorImages = formData.color_images.filter(
        (_, i) => i !== index
      );
      setFormData({
        ...formData,
        color_images: updatedColorImages,
      });
    } else {
      toast.error("At least one color image is required");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setFieldErrors({});

    // Validate form
    if (!formData.title || !formData.product_category || !formData.item_code) {
      setErrorMessage("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Validate color images
    const validColorImages = formData.color_images.filter(
      (image) => image.color_category && image.primary_image
    );

    if (validColorImages.length === 0) {
      setErrorMessage("At least one color with a primary image is required");
      setIsSubmitting(false);
      return;
    }

    // Prepare data for API
    const apiData = {
      ...formData,
      product_category: formData.product_category,
      color_images: formData.color_images.filter(
        (image) => image.color_category && image.primary_image
      ),
    };

    try {
      const response = await api.post("/fabrics/", apiData);
      toast.success("Fabric created successfully");
      navigate("/dashboard/fabrics");
    } catch (error) {
      // Use the error handling utility
      handleApiError(error, "Fabric", setErrorMessage, setFieldErrors, false);
      toast.error("Failed to create fabric");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="dashboard-content-card create-page-container"
      style={{ position: "relative" }}
    >
      {isSubmitting && <LoadingSpinner text="Creating fabric..." overlay />}
      <div className="create-page-header">
        <button
          className="back-button"
          onClick={() => navigate("/dashboard/fabrics")}
        >
          ← Back to Fabrics
        </button>
      </div>

      <h2 className="create-heading">Create New Fabric</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

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
                className={fieldErrors.title ? "input-error" : ""}
              />
              {fieldErrors.title && (
                <div className="field-error">{fieldErrors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="title_mandarin">Title (Mandarin)</label>
              <input
                type="text"
                id="title_mandarin"
                name="title_mandarin"
                value={formData.title_mandarin}
                onChange={handleInputChange}
                className={fieldErrors.title_mandarin ? "input-error" : ""}
              />
              {fieldErrors.title_mandarin && (
                <div className="field-error">{fieldErrors.title_mandarin}</div>
              )}
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
                className={fieldErrors.item_code ? "input-error" : ""}
              />
              {fieldErrors.item_code && (
                <div className="field-error">{fieldErrors.item_code}</div>
              )}
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
              className={fieldErrors.product_category ? "input-error" : ""}
            >
              <option value="">Select a category</option>
              {productCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.product_category && (
              <div className="field-error">{fieldErrors.product_category}</div>
            )}
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

          <div className="form-group">
            <label htmlFor="description_mandarin">Description (Mandarin)</label>
            <textarea
              id="description_mandarin"
              name="description_mandarin"
              value={formData.description_mandarin}
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
              <label htmlFor="composition_mandarin">
                Composition (Mandarin)
              </label>
              <input
                type="text"
                id="composition_mandarin"
                name="composition_mandarin"
                value={formData.composition_mandarin}
                onChange={handleInputChange}
                placeholder="棉质100%"
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
              <label htmlFor="weight_mandarin">Weight (Mandarin)</label>
              <input
                type="text"
                id="weight_mandarin"
                name="weight_mandarin"
                value={formData.weight_mandarin}
                onChange={handleInputChange}
                placeholder="200克/平方米"
              />
            </div>
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="finish_mandarin">Finish (Mandarin)</label>
              <input
                type="text"
                id="finish_mandarin"
                name="finish_mandarin"
                value={formData.finish_mandarin}
                onChange={handleInputChange}
                placeholder="柔软，哑光"
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
                      {color.display_name || color.name}
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
                              imageDetails[colorImage.primary_image].file_url
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
                            src={imageDetails[colorImage.aux_image1].file_url}
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
                            src={imageDetails[colorImage.aux_image2].file_url}
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
                            src={imageDetails[colorImage.aux_image3].file_url}
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
                            src={imageDetails[colorImage.model_image].file_url}
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
            {isSubmitting ? "Creating..." : "Create Fabric"}
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
          height: 120px;
          border: 1px dashed #ccc;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f9f9f9;
          overflow: hidden;
          position: relative;
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
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .no-image {
          color: #999;
          font-size: 13px;
        }

        .selected-image {
          color: #333;
          font-size: 13px;
          text-align: center;
          padding: 8px;
        }

        .select-image-button {
          background-color: #f1f1f1;
          color: #333;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .select-image-button:hover {
          background-color: #e3e3e3;
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
          background-color: #34a853;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 24px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover {
          background-color: #2e8b46;
        }

        .submit-button:disabled {
          background-color: #a8d5b5;
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

        .input-error {
          border-color: red;
        }

        .field-error {
          color: red;
          font-size: 12px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

export default CreateFabricPage;
