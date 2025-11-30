import { useEffect, useState } from "react";
import {
  createTodo,
  getTodo,
  updateTodo,
  deleteTodo,
} from "../../services/api";
import { InputField } from "../../components/InputField";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

const TodoItem = ({
  item,
  isEditing,
  editingData,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onEditChange,
  onStatusToggle,
  isSaving,
  isDeleting,
}) => {
  // Determine border color based on priority (using Tailwind CSS classes)
  const borderColor =
    item.priority === "High"
      ? "border-l-4 border-red-500"
      : item.priority === "Medium"
      ? "border-l-4 border-orange-400"
      : "border-l-4 border-green-400";

  // Determine if the task is completed for visual styling
  const isCompleted = item.status === "Completed";
  const statusStyle = isCompleted
    ? "opacity-60 line-through text-gray-500"
    : "text-gray-800";

  // Render the editing form if the item is currently being edited
  if (isEditing) {
    return (
      <div className={`p-6 bg-blue-100 rounded-lg shadow-xl ${borderColor}`}>
        <InputField label="Title">
          <input
            name="title"
            value={editingData.title}
            onChange={onEditChange}
            className="bg-white p-2 border rounded w-full focus:ring-blue-500"
            placeholder="Task Title"
          />
        </InputField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
          <InputField label="Priority">
            <select
              name="priority"
              value={editingData.priority}
              onChange={onEditChange}
              className="bg-white p-2 border rounded w-full"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟠 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </InputField>
          <InputField label="Status">
            <select
              name="status"
              value={editingData.status}
              onChange={onEditChange}
              className="bg-white p-2 border rounded w-full"
            >
              <option value="Pending">🟡 Pending</option>
              <option value="In-Progress">🔵 In-Progress</option>
              <option value="Completed">🟢 Completed</option>
            </select>
          </InputField>
          <InputField label="Category">
            <select
              name="category"
              value={editingData.category}
              onChange={onEditChange}
              className="bg-white p-2 border rounded w-full"
            >
              <option value="Personal">🧑 Personal</option>
              <option value="Work">💼 Work</option>
              <option value="Ideas">💡 Ideas</option>
            </select>
          </InputField>
        </div>
        <InputField label="Description">
          <textarea
            name="description"
            value={editingData.description}
            onChange={onEditChange}
            className="bg-white p-2 border rounded w-full mt-2 resize-none focus:ring-blue-500"
            rows="3"
          />
        </InputField>

        <div className="flex gap-2 mt-4 justify-end">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className={`bg-gray-500 ${
              isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-600"
            } text-white px-4 py-2 rounded transition`}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(item._id)}
            disabled={isSaving}
            className={`font-medium px-4 py-2 rounded transition ${
              isSaving
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-md ${borderColor} hover:shadow-lg transition-shadow flex items-start space-x-4`}
    >
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={() => onStatusToggle(item._id, isCompleted)}
        className="w-5 h-5 mt-1 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
      />

      <div className={`flex-1 ${statusStyle}`}>
        <h3 className="font-bold text-xl mb-1">{item.title}</h3>
        <p className="text-sm mb-3 text-gray-600">{item.description}</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-medium text-gray-600 mb-4">
          <span className="bg-gray-100 px-2 py-1 rounded inline-flex items-center">
            {item.priority === "High"
              ? "🔴"
              : item.priority === "Medium"
              ? "🟠"
              : "🟢"}{" "}
            Priority: {item.priority}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded inline-flex items-center">
            {item.status === "Pending"
              ? "🟡"
              : item.status === "In-Progress"
              ? "🔵"
              : "🟢"}{" "}
            Status: {item.status}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded inline-flex items-center">
            {item.category === "Personal"
              ? "🧑"
              : item.category === "Work"
              ? "💼"
              : "💡"}{" "}
            Category: {item.category}
          </span>
        </div>

        <div className="flex gap-3 border-t pt-3">
          <button
            onClick={() => onEdit()}
            disabled={isDeleting} // Disable edit while deletion is pending
            className={`text-blue-600 ${
              isDeleting
                ? "opacity-70 cursor-not-allowed"
                : "hover:text-blue-800"
            } font-medium transition`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            disabled={isDeleting} // Disable delete button while deleting
            className={`font-medium transition ${
              isDeleting
                ? "text-red-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-800"
            }`}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main TodoList Component ---
export const TodoList = () => {
  const { logout, user } = useAuth();
  const userName = user?.name || "Guest";

  const emptyTodo = {
    title: "",
    description: "",
    priority: "",
    status: "",
    category: "",
  };

  const [formData, setFormData] = useState(emptyTodo);
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState("");
  const [operationError, setOperationError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Fetch Todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const response = await getTodo();
        if (response && response.data) {
          setList(response.data);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
        setOperationError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
  };

  const handleAdd = async () => {
    if (
      !formData.title ||
      !formData.priority ||
      !formData.status ||
      !formData.category ||
      !formData.description
    ) {
      setValidationError("Please fill all fields.");
      return;
    }

    try {
      setOperationError("");
      setIsAdding(true);
      const response = await createTodo(formData);

      if (response && response.data) {
        setList((prev) => [response.data, ...prev]);
        setFormData(emptyTodo);
      }
    } catch (err) {
      console.error("Error creating todo:", err);
      setOperationError("Failed to add task.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setEditingData({
      title: item.title,
      priority: item.priority,
      category: item.category,
      status: item.status,
      description: item.description,
    });
    setOperationError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      setOperationError("");
      setIsSaving(true);
      const response = await updateTodo(id, editingData);

      if (response && response.data) {
        setList((prev) =>
          prev.map((item) => (item._id === id ? response.data : item))
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      setOperationError("Failed to update task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleStatusToggle = async (id, isCompleted) => {
    const newStatus = isCompleted ? "Pending" : "Completed";
    setOperationError("");

    const originalList = list;
    const itemToUpdate = originalList.find((item) => item._id === id);
    if (!itemToUpdate) return;

    const updatedItem = { ...itemToUpdate, status: newStatus };
    setList((prev) =>
      prev.map((item) => (item._id === id ? updatedItem : item))
    );

    try {
      const response = await updateTodo(id, { status: newStatus });

      if (response && response.data && response.data.status !== newStatus) {
        setList((prev) =>
          prev.map((item) => (item._id === id ? response.data : item))
        );
      }
    } catch (error) {
      console.error("Error toggling status, reverting UI:", error);
      setOperationError("Failed to update task status. Reverting change.");
      setList(originalList);
    }
  };

  const handleDelete = (id) => {
    // Start a delete confirmation flow (no window.confirm)
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;
    if (!id) return;
    try {
      setOperationError("");
      setIsDeletingId(id);
      await deleteTodo(id);
      setList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
      setOperationError("Failed to delete task.");
    } finally {
      setIsDeletingId(null);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setOperationError("Logout failed. Please try again.");
      setIsLoggingOut(false);
    }
  };

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="text-xl font-bold text-gray-700 animate-pulse">
          Logging Out...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full sm:p-8 p-4 mx-auto mt-10 bg-amber-50 rounded-lg shadow-xl">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`font-medium py-2 px-4 rounded-lg transition duration-200 ${
            isLoggingOut
              ? "bg-red-400 cursor-wait"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {isLoggingOut ? "Logging Out..." : "Logout"}
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          👋 Welcome, {userName}
        </h2>
      </div>

      <h3 className="flex items-center text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
        <img src={logo} alt="Logo" className="w-8 h-8 mr-2" />
        To Do List
      </h3>

      {validationError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          {validationError}
        </div>
      )}
      {operationError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          {operationError}
        </div>
      )}
      {pendingDeleteId && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 flex items-center justify-between">
          <div>Are you sure you want to delete this task?</div>
          <div className="flex gap-2">
            <button
              onClick={cancelDelete}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-100">
        <InputField label="Title">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-gray-50 p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Title Here"
          />
        </InputField>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <InputField label="Priority">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="bg-gray-50 p-3 border rounded-lg w-full"
            >
              <option value="">Priority</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟠 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </InputField>

          <InputField label="Status">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-50 p-3 border rounded-lg w-full"
            >
              <option value="">Status</option>
              <option value="Pending">🟡 Pending</option>
              <option value="In-Progress">🔵 In-Progress</option>
              <option value="Completed">🟢 Completed</option>
            </select>
          </InputField>

          <InputField label="Category">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="bg-gray-50 p-3 border rounded-lg w-full"
            >
              <option value="">Category</option>
              <option value="Personal">🧑 Personal</option>
              <option value="Work">💼 Work</option>
              <option value="Ideas">💡 Ideas</option>
            </select>
          </InputField>
        </div>

        <div className="mt-4">
          <InputField label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-50 p-3 border rounded-lg w-full resize-none"
              placeholder="Write ToDo details..."
              rows="3"
            />
          </InputField>
        </div>

        <button
          onClick={handleAdd}
          disabled={isAdding}
          className={`w-full font-bold py-3 px-4 rounded-lg mt-6 transition duration-200 ${
            isAdding
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isAdding ? "Adding Task..." : "Add Task"}
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading tasks...</div>
        ) : list.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              No tasks yet. Create one above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((item) => (
              <TodoItem
                key={item._id}
                item={item}
                isEditing={editingId === item._id}
                editingData={editingData}
                onEdit={() => handleEdit(item)}
                onDelete={handleDelete}
                onSave={handleSave}
                onCancel={handleCancelEdit}
                onEditChange={handleEditChange}
                onStatusToggle={handleStatusToggle}
                isSaving={isSaving && editingId === item._id}
                isDeleting={isDeletingId === item._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
