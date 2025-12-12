export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  BUYER: "buyer",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Sports",
  "Beauty",
  "Toys",
  "Automotive",
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  PRODUCTS: "/products",
  ORDERS: "/orders",
  USERS: "/users",
};
