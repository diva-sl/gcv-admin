import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import {
  Plus,
  Trash2,
  Edit2,
  Link,
  LogOut,
  Loader,
  Database,
  FileSpreadsheet,
  LayoutGrid,
} from "lucide-react";

interface Project {
  projectId: string;
  title: string;
  client: string;
  category: "platform" | "design";
  outcome: string;
  image: string;
}

interface DashboardProps {
  onAddProject: () => void;
  onEditProject: (project: any) => void;
  onLogout: () => void;
}

export default function Dashboard({
  onAddProject,
  onEditProject,
  onLogout,
}: DashboardProps) {
  const queryClient = useQueryClient();

  // 🔄 Fetch all projects dynamically using React Query
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data;
    },
  });

  // 🗑️ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (projectId: string) => {
      await api.delete(`/admin/projects/${projectId}`);
    },
    onSuccess: () => {
      // Invalidate projects cache to refresh dashboard list immediately
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to delete case study.");
    },
  });

  const handleDelete = (projectId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(projectId);
    }
  };

  const platformCount =
    projects?.filter((p) => p.category === "platform").length || 0;
  const designCount =
    projects?.filter((p) => p.category === "design").length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-6 h-6 text-blue-500 shrink-0" />
            <span className="font-headline text-lg font-extrabold tracking-tight">
              GCV Digital Engineering Management
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700/50">
              Admin: {localStorage.getItem("gcv_admin_email")}
            </span>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Statistics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-5">
            <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block font-mono">
                {projects?.length || 0}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Case Studies
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-5">
            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block font-mono">
                {platformCount}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Platform Solutions
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-5">
            <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
              <Link className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block font-mono">
                {designCount}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                UX/UI Mockups
              </span>
            </div>
          </div>
        </div>

        {/* Action Panel and List container */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-headline text-lg font-bold text-slate-800 uppercase tracking-wider">
                Case Study Showcases
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Create or modify existing client mockups and performance metrics
              </p>
            </div>

            <button
              onClick={onAddProject}
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              Add New Showcase
            </button>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Loading showcases...
              </span>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500 text-sm">
              Failed to fetch case study records from database. Verify database
              logs.
            </div>
          ) : projects?.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              No project showcases present. Click "Add New Showcase" above to
              create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects?.map((project) => (
                <div
                  key={project.projectId}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors"
                >
                  {/* Left info block */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800">
                          {project.title}
                        </h3>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200/50">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Client: {project.client} | Outcome: {project.outcome}
                      </p>
                    </div>
                  </div>

                  {/* Actions Block */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onEditProject(project)}
                      className="p-2 border border-slate-200 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 text-slate-500 rounded-lg transition-all cursor-pointer"
                      title="Edit Case Study"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(project.projectId, project.title)
                      }
                      disabled={deleteMutation.isPending}
                      className="p-2 border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 text-slate-500 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                      title="Delete Case Study"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
