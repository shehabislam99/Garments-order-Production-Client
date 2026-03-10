import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import axios from "axios";

const Settings = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: "",
    photoURL: "",
    currentPassword: "",
    newPassword: "",
  });
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        displayName: user?.name || "",
        photoURL: user?.photoURL || "",
      }));
    }
  }, [user]);

  const uploadToImageBB = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        },
      );

      return response.data?.data?.url || null;
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed. Please try again.");
      return null;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      let uploadedImage = form.photoURL;
      if (selectedFile) {
        const url = await uploadToImageBB(selectedFile);
        if (url) {
          uploadedImage = url;
        }
      }

      if (form.displayName || form.photoURL) {
        await axiosSecure.patch("/auth/profile", {
          ...(form.displayName && { name: form.displayName }),
          ...(uploadedImage && { photoURL: uploadedImage }),
        });
      }

      if (form.currentPassword && form.newPassword) {
        await axiosSecure.patch("/auth/change-password", {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        });
      }

      toast.success("Settings updated successfully.");
      navigate("/dashboard/profile");
      setForm({
        displayName: "",
        photoURL: "",
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(
        error?.response?.data?.message || "Unable to update settings right now.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form
        onSubmit={handleSubmit}
        className="custom-bg p-6 rounded-4xl border app-border space-y-4"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1">
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Photo
            </label>
            <div className="flex rounded-4xl border border-gray-300 bg-white p-3">
              <div className="flex-1">
                <label
                  htmlFor="photoFile"
                  className="flex w-full cursor-pointer items-center justify-between text-sm text-gray-500"
                >
                  {selectedFile?.name || "Upload a new photo…"}
                  <span className="font-semibold text-blue-600">Choose</span>
                </label>
                <input
                  id="photoFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <div className="flex items-center justify-center">
                <BsFillPersonFill className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            {(imagePreview || form.photoURL) && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={imagePreview || form.photoURL}
                  alt="profile preview"
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-200"
                />
                <p className="text-xs text-gray-500">
                  Preview of the saved profile photo.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
              Current Password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-4xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </section>
  );
};

export default Settings;
