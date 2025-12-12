// import Card from "../../../Components/UI/Card";
// // import { useProducts } from "../../../Hooks/useProduct";
// import Loader from  "../../../Components/Common/Loader";
// import BarChart from "../../../Components/Chart/Barchart";
// import { useAuth } from "../../../Provider/AuthProvider";

const AdminDashboard = () => {
  // const { user } = useAuth();
  // // const { data: products, isLoading: productsLoading } = useProducts();
  // // const { data: orders, isLoading: ordersLoading } = useQuery("orders", () =>
  // //   orderService.getAll()
  // // );
  // // const { data: users, isLoading: usersLoading } = useQuery("users", () =>
  // //   userService.getAll()
  // // );

  // // if (productsLoading || ordersLoading || usersLoading) {
  // //   return <Loader className="h-64" />;
  // // }

  // // const chartData = {
  // //   labels: ["Products", "Orders", "Users"],
  // //   datasets: [
  // //     {
  // //       label: "Count",
  // //       data: [products?.length || 0, orders?.length || 0, users?.length || 0],
  // //       backgroundColor: ["#4f46e5", "#10b981", "#f59e0b"],
  // //     },
  // //   ],
  // // };

  // return (
  //   <div className="p-6">
  //     <h1 className="text-3xl font-bold text-gray-900 mb-6">
  //       Welcome back, {user?.name} 👋
  //     </h1>

  //     {/* Stats Grid */}
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  //       <Card>
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm text-gray-600">Total Products</p>
  //             <p className="text-2xl font-bold">{products?.length || 0}</p>
  //           </div>
  //           <div className="p-3 bg-blue-100 rounded-lg">
  //             <svg
  //               className="w-6 h-6 text-blue-600"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
  //               />
  //             </svg>
  //           </div>
  //         </div>
  //       </Card>

  //       <Card>
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm text-gray-600">Total Orders</p>
  //             <p className="text-2xl font-bold">{orders?.length || 0}</p>
  //           </div>
  //           <div className="p-3 bg-green-100 rounded-lg">
  //             <svg
  //               className="w-6 h-6 text-green-600"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
  //               />
  //             </svg>
  //           </div>
  //         </div>
  //       </Card>

  //       <Card>
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm text-gray-600">Total Users</p>
  //             <p className="text-2xl font-bold">{users?.length || 0}</p>
  //           </div>
  //           <div className="p-3 bg-yellow-100 rounded-lg">
  //             <svg
  //               className="w-6 h-6 text-yellow-600"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth={2}
  //                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.175a4 4 0 01-6.18 5.304"
  //               />
  //             </svg>
  //           </div>
  //         </div>
  //       </Card>
  //     </div>

  //     {/* Charts */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       <Card>
  //         <h3 className="text-lg font-semibold mb-4">Overview</h3>
  //         <BarChart data={chartData} />
  //       </Card>

  //       <Card>
  //         <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
  //         <div className="overflow-x-auto">
  //           <table className="min-w-full divide-y divide-gray-200">
  //             <thead>
  //               <tr>
  //                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Order ID
  //                 </th>
  //                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Status
  //                 </th>
  //                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  //                   Amount
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody className="divide-y divide-gray-200">
  //               {orders?.slice(0, 5).map((order) => (
  //                 <tr key={order._id}>
  //                   <td className="px-4 py-3 text-sm">{order._id.slice(-6)}</td>
  //                   <td className="px-4 py-3">
  //                     <span
  //                       className={`px-2 py-1 text-xs rounded-full ${
  //                         order.status === "delivered"
  //                           ? "bg-green-100 text-green-800"
  //                           : order.status === "pending"
  //                           ? "bg-yellow-100 text-yellow-800"
  //                           : "bg-blue-100 text-blue-800"
  //                       }`}
  //                     >
  //                       {order.status}
  //                     </span>
  //                   </td>
  //                   <td className="px-4 py-3 text-sm">${order.totalAmount}</td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </Card>
  //     </div>
  //   </div>
  // );
};

export default AdminDashboard;
