export const getThemeClasses = (darkMode) => ({
  textCls: darkMode ? "text-white" : "text-gray-900",
  mutedCls: darkMode ? "text-gray-400" : "text-gray-500",
  borderCls: darkMode ? "border-gray-700" : "border-gray-200",
  panelCls: darkMode ? "bg-[#111827]" : "bg-white",
  buttonCls: darkMode
    ? "border border-gray-600 px-4 py-2 text-sm text-white hover:border-gray-400"
    : "border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:border-gray-500",
  bg: darkMode ? "bg-gray-900" : "bg-white",
  hoverBg: darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
  iconCls: darkMode ? "text-white" : "text-gray-900",
});
