This document explains how to use the download functionality for exporting data as XLSX files from the Corlee backend API.

## Overview

The download functionality provides three endpoints to export data:

- **Fabrics**: Export all fabric data with details
- **Orders**: Export all orders with user and item information
- **Users**: Export all user data with statistics

## API Endpoints

### 1. Download Fabrics Data

**Endpoint:** `GET /download/fabrics/`

**Description:** Downloads an XLSX file containing all fabric data including multilingual fields, categories, and available colors.

**Authentication:** No authentication required

**Response:** XLSX file download with filename format: `fabrics_data_YYYYMMDD_HHMMSS.xlsx`

**Data Included:**

- ID
- Title (English & Mandarin)
- Description (English & Mandarin)
- Composition (English & Mandarin)
- Weight (English & Mandarin)
- Finish (English & Mandarin)
- Item Code
- Product Category
- Is Hot Selling
- Created At
- Available Colors

### 2. Download Orders Data

**Endpoint:** `GET /download/orders/`

**Description:** Downloads an XLSX file containing all order data with user information and order items.

**Authentication:** No authentication required

**Response:** XLSX file download with filename format: `orders_data_YYYYMMDD_HHMMSS.xlsx`

**Data Included:**

- Order ID
- User ID
- User Name
- User Email
- Order Date
- Total Items
- Fabric Title
- Fabric Item Code
- Color
- Quantity

**Note:** Each row represents an order item. Orders with multiple items will have multiple rows.

### 3. Download Users Data

**Endpoint:** `GET /download/users/`

**Description:** Downloads an XLSX file containing all user data with account statistics.

**Authentication:** No authentication required

**Response:** XLSX file download with filename format: `users_data_YYYYMMDD_HHMMSS.xlsx`
