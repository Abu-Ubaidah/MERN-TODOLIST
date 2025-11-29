export const InputField = ({ label, children }) => (
  <div className="flex flex-col mt-1 gap-1">
    <label className="text-lg font-semibold text-gray-700">{label}</label>
    <div className="flex gap-2 w-full">{children}</div>
  </div>
);
