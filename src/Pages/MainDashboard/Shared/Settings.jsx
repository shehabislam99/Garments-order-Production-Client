import { useState } from "react";
import toast from "react-hot-toast";

const Settings = () => {
  const [form, setForm] = useState({
    displayName: "",
    photoURL: "",
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    setTimeout(() => {
      toast.success("Settings update request submitted.");
      setSaving(false);
    }, 600);
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
            <label htmlFor="photoURL" className="block text-sm font-medium mb-1">
              Profile Image URL
            </label>
            <input
              id="photoURL"
              name="photoURL"
              value={form.photoURL}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-4xl border app-border app-surface"
            />
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
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
};

export default Settings;
