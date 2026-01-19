import React, { useState, useEffect} from "react";
import {
  FaEdit,
  FaUser,
  FaSearch,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdEmail,MdInfo } from "react-icons/md";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Loading from "../../../Components/Common/Loding/Loding";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(0); 
  const [usersPerPage] = useState(6);
  const [editingUser, setEditingUser] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [updating, setUpdating] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendFeedback, setSuspendFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const axiosSecure = useAxiosSecure();


  const fetchUsers = async () => {
    try {
      setLoading(true);
    
      const res = await axiosSecure.get(
        `/users?searchText=${searchTerm}&page=${
          currentPage + 1
        }&limit=${usersPerPage}&role=${filterRole}&status=${filterStatus}`
      );

      if (res.data && res.data?.success) {
        setUsers(res.data?.data || []);
        setTotalUsers(res.data?.total || 0);
        setTotalPages(
          res?.data?.totalPages || Math.ceil((res.data?.total || 0) / usersPerPage)
        );
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalUsers(res.data?.length);
        setTotalPages(Math.ceil(res.data?.length / usersPerPage));
      } else {
        setUsers([]);
        setTotalUsers(0);
        setTotalPages(0);
        console.error("Unexpected API response structure:", res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users", {
        position: "top-center",
        autoClose: 2000,
      });
      setUsers([]);
      setTotalUsers(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };



 useEffect(() => {
   fetchUsers();
 }, [currentPage, searchTerm, filterRole, filterStatus]);
  
  const handleRoleUpdate = async () => {
    if (!editingUser || !selectedRole) return;

    try {
      setUpdating(true);
      const response = await axiosSecure.patch(
        `/users/role/${editingUser?._id}`,
        { role: selectedRole }
      );

      if (response.data.modifiedCount > 0 || response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === editingUser._id
              ? { ...user, role: selectedRole }
              : user
          )
        );
        toast.success(`User role updated to ${selectedRole}`, {
          position: "top-center",
          autoClose: 2000,
        });
        setRoleModalOpen(false);
        setEditingUser(null);
        setSelectedRole("");
      }
    } catch (error) {
      console.error("Error updating user role:", error, {
        position: "top-center",
        autoClose: 2000,
      });
      toast.error("Failed to update user role", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setUpdating(false);
    }
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected); 
  };

  const handleApproveUser = async () => {
    try {
      const res = await axiosSecure.patch(`/users/status/${editingUser?._id}`, {
        status: "active",
      });

      if (res?.data?.success) {
        setUsers(
          users.map((u) =>
            u._id === editingUser?._id ? { ...u, status: "active" } : u
          )
        );
        toast.success("User approved", {
          position: "top-center",
          autoClose: 2000,
        });
        closeUpdateModal();
      }
    } catch {
      toast.error("Approve failed", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleSuspendUser = async () => {
    if (!suspendReason.trim()) {
      toast.error("Suspension reason required", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      const res = await axiosSecure.patch(`/users/status/${editingUser?._id}`, {
        status: "suspended",
        suspendReason,
        suspendFeedback,
      });

      if (res?.data.success) {
        setUsers(
          users.map((u) =>
            u._id === editingUser?._id
              ? { ...u, status: "suspended", suspendReason, suspendFeedback }
              : u
          )
        );
        toast.success("User suspended", {
          position: "top-center",
          autoClose: 2000,
        });
        closeUpdateModal();
      }
    } catch {
      toast.error("Suspend failed", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleActivateUser = async () => {
      try {
        const res = await axiosSecure.patch(
          `/users/status/${editingUser?._id}`,
          {
            status: "active",
            suspendReason: "",
            suspendFeedback: "",
          }
        );

        if (res?.data.success) {
          setUsers(
            users.map((u) =>
              u._id === editingUser?._id ? { ...u, status: "active" } : u
            )
          );
          toast.success("User activated", {
            position: "top-center",
            autoClose: 2000,
          });
          closeUpdateModal();
        }
      } catch {
        toast.error("Activation failed", {
          position: "top-center",
          autoClose: 2000,
        });
      }
  };

  const openUpdateModal = (user) => {
    setEditingUser(user);
    setSuspendReason("");
    setSuspendFeedback("");
    setUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setEditingUser(null);
    setUpdateModalOpen(false);
  };

  const getRoleColor = (userRole) => {
    switch (userRole) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "buyer":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openRoleModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user?.role || "buyer");
    setRoleModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterRole("all");
    setFilterStatus("all");
    setCurrentPage(0); 
  };

  return (
    <div className="p-3 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        </div>
        <button
          onClick={() => {
            fetchUsers();
          }}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-red-800 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mt-4 bg-amber-100 rounded-4xl shadow p-4">
        <div className="flex items-center justify-between mb-4">
          {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-red-800 flex items-center"
            >
              <FaTimes className="mr-1" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Search by name or email..."
                className="pl-10 w-full px-3 py-2 placeholder-green-500 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border text-green-500 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full px-3 py-2 border text-green-500 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">User all Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loading></Loading>
          <span className="text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <>
          <div className="mt-4 bg-white rounded-4xl shadow overflow-hidden ">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      User Status
                    </th>
                    <th className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Manage Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-amber-100 divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user?._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={
                              user?.photoURL || "https://via.placeholder.com/48"
                            }
                            alt={user?.name}
                          />

                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user?.name || "No Name"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MdEmail className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {user?.email}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRoleColor(
                            user?.role
                          )}`}
                        >
                          {user?.role || "buyer"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              user?.status || "active"
                            )} mb-1 w-fit`}
                          >
                            {user?.status || "active"}
                          </span>
                          {user?.status === "suspended" &&
                            user?.suspendReason && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <MdInfo className="mr-1" />
                                {user?.suspendReason}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {/* Update Role Button */}
                          <button
                            onClick={() => openRoleModal(user)}
                            disabled={user?.role === "admin"}
                            className={`flex items-center ${
                              user?.role === "admin" ?
                                "text-gray-400 cursor-not-allowed"
                              : "hover:bg-red-800 px-3 py-1 rounded-full text-white bg-indigo-600 "
                            }`}
                            title="Update Role"
                          >
                            <FaEdit className="mr-1" />
                            Edit Role
                          </button>

                          {/*Update status Button */}
                          <button
                            onClick={() => openUpdateModal(user)}
                            className={`flex items-center ${
                              user?.role === "admin" ?
                                "text-gray-400 cursor-not-allowed"
                              : "hover:bg-red-800 px-3 py-1 rounded-full text-white bg-green-600"
                            }`}
                          >
                            <GrDocumentUpdate className="mr-1" />
                            Update status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {users.length === 0 && !loading && (
              <div className="text-center bg-amber-100 py-12">
                <div className="text-gray-400 mb-4">
                  <FaUser className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No users found here
                </h3>
                <p className="text-gray-500">
                  Try to find your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* React Paginate Component */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-center items-center mt-6">
              <ReactPaginate
                breakLabel="..."
                nextLabel={
                  <div className="flex items-center">
                    Next
                    <FaChevronRight className="ml-1 h-3 w-3" />
                  </div>
                }
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                forcePage={currentPage}
                previousLabel={
                  <div className="flex items-center">
                    <FaChevronLeft className="mr-1 h-3 w-3" />
                    Previous
                  </div>
                }
                renderOnZeroPageCount={null}
                containerClassName="flex items-center justify-center space-x-1 md:space-x-2 mb-4 md:mb-0"
                pageClassName="hidden sm:block"
                pageLinkClassName="px-3 py-1 text-sm font-medium text-gray-700  rounded-full transition-colors"
                activeClassName="hidden sm:block"
                activeLinkClassName="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full"
                previousClassName="px-3 py-1 text-sm font-medium text-white bg-green-800 hover:bg-red-800 rounded-full border border-gray-300"
                previousLinkClassName="flex items-center px-2 py-1"
                nextClassName="px-3 py-1 text-sm font-medium text-white bg-green-800  hover:bg-red-800 rounded-full border border-gray-300"
                nextLinkClassName="flex items-center px-2 py-1"
                breakClassName="hidden sm:block"
                breakLinkClassName="px-3 py-1 text-sm font-medium text-gray-700"
                disabledClassName="opacity-50 cursor-not-allowed"
                disabledLinkClassName="text-gray-400 hover:text-gray-400 hover:bg-transparent"
              />
            </div>
          )}
        </>
      )}

      {/* Role Update Modal */}
      {roleModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-amber-100 rounded-4xl  shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-bold text-center text-gray-900 mb-4">
                Update User Role
              </h3>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Name:{" "}
                  <span className="font-medium text-black">
                    {editingUser?.name}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Role:{" "}
                  <span className="font-medium text-black">
                    {editingUser?.role || "Unknown"}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="buyer">Buyer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setRoleModalOpen(false);
                    setEditingUser(null);
                    setSelectedRole("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-800 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRoleUpdate}
                  disabled={updating || !selectedRole}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-red-800 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Role"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend User Modal */}
      {updateModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-amber-100 rounded-4xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg text-center font-bold mb-4">
              Update Status
            </h3>
            {/* STATUS ACTIONS */}
            {editingUser?.status === "pending" && (
              <button
                onClick={handleApproveUser}
                className="w-full bg-green-600 text-white py-2 rounded-full mb-2"
              >
                Approve User
              </button>
            )}

            {editingUser?.status === "active" && (
              <>
                <select
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full border border-gray-400 rounded-xl px-3 py-2 mb-2"
                >
                  <option value="">Select suspend reason</option>
                  <option value="Violation of terms">Violation of terms</option>
                  <option value="Suspicious activity">
                    Suspicious activity
                  </option>
                  <option value="Payment Related Issue">
                    Payment Related Issue
                  </option>
                </select>

                <textarea
                  value={suspendFeedback}
                  onChange={(e) => setSuspendFeedback(e.target.value)}
                  placeholder="Suspend feedback"
                  className="w-full border border-gray-400 rounded-xl px-3 py-2 mb-2"
                />

                <button
                  onClick={handleSuspendUser}
                  className="w-full bg-red-600 rounded-full text-white py-2 rounded"
                >
                  Suspend User
                </button>
              </>
            )}

            {editingUser?.status === "suspended" && (
              <button
                onClick={handleActivateUser}
                className="w-full bg-blue-600 text-white py-2 rounded-full"
              >
                Activate User
              </button>
            )}

            <button
              onClick={closeUpdateModal}
              className="w-full mt-3 bg-gray-400  rounded-full  py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
