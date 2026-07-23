import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "./api";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import ProjectForm from "./components/ProjectForm";
import { Loader } from "lucide-react";

type AdminView = "dashboard" | "create" | "edit";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Check login state on initial load
  useEffect(() => {
    const token = localStorage.getItem("gcv_admin_token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  // Create Project mutation
  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post("/admin/projects", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCurrentView("dashboard");
      alert("Case study created successfully!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to create case study.");
    },
    onSettled: () => setIsSubmitting(false),
  });

  // Edit Project mutation
  const editMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.put(`/admin/projects/${data.projectId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setCurrentView("dashboard");
      alert("Case study updated successfully!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to update case study.");
    },
    onSettled: () => setIsSubmitting(false),
  });

  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    if (currentView === "create") {
      createMutation.mutate(data);
    } else {
      editMutation.mutate(data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gcv_admin_token");
    localStorage.removeItem("gcv_admin_email");
    setIsAuthenticated(false);
    setCurrentView("dashboard");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {currentView === "dashboard" && (
        <Dashboard
          onAddProject={() => setCurrentView("create")}
          onEditProject={(project) => {
            setEditingProject(project);
            setCurrentView("edit");
          }}
          onLogout={handleLogout}
        />
      )}

      {currentView === "create" && (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <div className="space-y-1">
            <h1 className="font-headline text-2xl font-extrabold text-slate-800 tracking-tight">
              Create New Showcase
            </h1>
            <p className="text-xs text-slate-400">
              Add a client case study dynamically synced to S3
            </p>
          </div>
          <ProjectForm
            onSubmit={handleFormSubmit}
            onCancel={() => setCurrentView("dashboard")}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {currentView === "edit" && (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          <div className="space-y-1">
            <h1 className="font-headline text-2xl font-extrabold text-slate-800 tracking-tight">
              Modify Showcase: {editingProject?.title}
            </h1>
            <p className="text-xs text-slate-400">
              Update parameters, add screens, or change key metrics
            </p>
          </div>
          <ProjectForm
            initialData={editingProject}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setEditingProject(null);
              setCurrentView("dashboard");
            }}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
