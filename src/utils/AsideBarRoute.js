// src/routes/sidebarRoutes.js

// Define routes for each user role
const adminRoutes = [
  { path: "/admin/dashboard", title: "Dashboard", icon: "📊" },
  { path: "/admin/users", title: "User Management", icon: "👥" },
  { path: "/admin/products", title: "Products", icon: "📦" },
  { path: "/admin/analytics", title: "Analytics", icon: "📈" },
  { path: "/admin/settings", title: "Settings", icon: "⚙️" },
];

const managerRoutes = [
  { path: "/manager/dashboard", title: "Dashboard", icon: "📊" },
  { path: "/manager/orders", title: "Order Management", icon: "📋" },
  { path: "/manager/inventory", title: "Inventory", icon: "📦" },
  { path: "/manager/reports", title: "Reports", icon: "📄" },
  { path: "/manager/team", title: "Team", icon: "👥" },
];

const buyerRoutes = [
  { path: "/buyer/dashboard", title: "My Dashboard", icon: "📊" },
  { path: "/buyer/orders", title: "My Orders", icon: "📦" },
  { path: "/buyer/profile", title: "Profile", icon: "👤" },
  { path: "/buyer/wishlist", title: "Wishlist", icon: "❤️" },
  { path: "/buyer/settings", title: "Settings", icon: "⚙️" },
];

const guestRoutes = [
  { path: "/", title: "Home", icon: "🏠" },
  { path: "/products", title: "Products", icon: "🛒" },
];

/**
 * Get sidebar routes based on user role
 * @param {string} role - User role (admin, manager, buyer, etc.)
 * @returns {Array} Array of route objects for the sidebar
 */
export const getSidebarRoutes = (role) => {
  switch (role) {
    case "admin":
      return adminRoutes;
    case "manager":
      return managerRoutes;
    case "buyer":
      return buyerRoutes;
    default:
      return guestRoutes; // For unauthenticated users or unknown roles
  }
};

// Export individual route arrays if needed elsewhere
export { adminRoutes, managerRoutes, buyerRoutes, guestRoutes };

// Export a function to get all unique routes for router configuration
export const getAllRoutes = () => {
  const allRoutes = [
    ...adminRoutes,
    ...managerRoutes,
    ...buyerRoutes,
    ...guestRoutes,
  ];
  // Remove duplicates by path
  const uniqueRoutes = Array.from(
    new Map(allRoutes.map((route) => [route.path, route])).values()
  );
  return uniqueRoutes;
};
