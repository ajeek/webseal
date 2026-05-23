import TopBar from "./components/layout/TopBar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#06080A] text-gray-900 dark:text-white transition-colors">
      <TopBar />
      <Dashboard />
    </div>
  );
}
