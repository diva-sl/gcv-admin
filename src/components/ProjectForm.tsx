import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

interface Metric {
  label: string;
  value: string;
}

interface Screenshot {
  label: string;
  path: string;
  type: "storefront" | "admin";
}

interface ProjectData {
  projectId: string;
  title: string;
  client: string;
  category: "platform" | "design";
  description: string;
  outcome: string;
  tags: string[];
  image: string;
  challenge: string;
  solution: string;
  architecture: string[];
  metrics: Metric[];
  siteUrl: string;
  adminUrl: string;
  screenshots: Screenshot[];
}

interface ProjectFormProps {
  initialData?: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ProjectFormProps) {
  const [projectId, setProjectId] = useState(initialData?.projectId || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [client, setClient] = useState(initialData?.client || "");
  const [category, setCategory] = useState(initialData?.category || "platform");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [outcome, setOutcome] = useState(initialData?.outcome || "");
  const [tagInput, setTagInput] = useState(initialData?.tags.join(", ") || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [challenge, setChallenge] = useState(initialData?.challenge || "");
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [siteUrl, setSiteUrl] = useState(initialData?.siteUrl || "");
  const [adminUrl, setAdminUrl] = useState(initialData?.adminUrl || "");

  // Dynamic Lists states
  const [architecture, setArchitecture] = useState<string[]>(
    initialData?.architecture || [""],
  );
  const [metrics, setMetrics] = useState<Metric[]>(
    initialData?.metrics || [{ label: "", value: "" }],
  );
  const [screenshots, setScreenshots] = useState<Screenshot[]>(
    initialData?.screenshots || [],
  );

  const handleAddArch = () => setArchitecture([...architecture, ""]);
  const handleRemoveArch = (index: number) =>
    setArchitecture(architecture.filter((_, i) => i !== index));
  const handleArchChange = (index: number, val: string) => {
    const updated = [...architecture];
    updated[index] = val;
    setArchitecture(updated);
  };

  const handleAddMetric = () =>
    setMetrics([...metrics, { label: "", value: "" }]);
  const handleRemoveMetric = (index: number) =>
    setMetrics(metrics.filter((_, i) => i !== index));
  const handleMetricChange = (
    index: number,
    key: "label" | "value",
    val: string,
  ) => {
    const updated = [...metrics];
    updated[index][key] = val;
    setMetrics(updated);
  };

  const handleAddScreenshot = (type: "storefront" | "admin") => {
    setScreenshots([...screenshots, { label: "", path: "", type }]);
  };
  const handleRemoveScreenshot = (index: number) =>
    setScreenshots(screenshots.filter((_, i) => i !== index));
  const handleScreenshotChange = (
    index: number,
    key: keyof Screenshot,
    val: string,
  ) => {
    const updated = [...screenshots];
    updated[index] = { ...updated[index], [key]: val } as Screenshot;
    setScreenshots(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");
    onSubmit({
      projectId,
      title,
      client,
      category,
      description,
      outcome,
      tags,
      image,
      challenge,
      solution,
      architecture: architecture.filter((a) => a.trim() !== ""),
      metrics: metrics.filter(
        (m) => m.label.trim() !== "" && m.value.trim() !== "",
      ),
      siteUrl,
      adminUrl,
      screenshots: screenshots.filter((s) => s.path !== ""),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl"
    >
      {/* Header controls */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel and Back
        </button>
        <button
          type="submit"
          disabled={isLoading || !image}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Saving Case Study..." : "Save Case Study"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Project ID (Unique Key URL prefix, e.g. "kiddostyle")
          </label>
          <input
            type="text"
            required
            disabled={!!initialData}
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            placeholder="kiddostyle"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Project Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kids Wear eCommerce & Warehouse Automation Panel"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Client Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Client Name
          </label>
          <input
            type="text"
            required
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Kids Fashion eCommerce"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Category
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as "platform" | "design")
            }
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          >
            <option value="platform">Enterprise Platform</option>
            <option value="design">UX/UI Design</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Short Card Description
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Engineered a premium children's clothing storefront..."
          className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Outcomes & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Key Outcome (Badge Text, e.g. "+38% sales conversion")
          </label>
          <input
            type="text"
            required
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            placeholder="+38% sales conversion"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Technologies Utilized (Comma Separated)
          </label>
          <input
            type="text"
            required
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Next.js, React 19, Go / Golang, Tailwind CSS"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Main Image S3 Upload */}
      <ImageUploader
        label="Main Showcase Thumbnail (S3 Image Upload)"
        initialUrl={image}
        onUploadSuccess={(url) => setImage(url)}
      />

      {/* Challenge and Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            The Challenge
          </label>
          <textarea
            required
            rows={4}
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="The storefront required capacity to host..."
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            The Solution
          </label>
          <textarea
            required
            rows={4}
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="GCV designed a state-of-the-art Single-Page Application..."
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Production Site URL (Optional)
          </label>
          <input
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://kiddostyle.gcvdanta.com/"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Admin/Panel Portal URL (Optional)
          </label>
          <input
            type="url"
            value={adminUrl}
            onChange={(e) => setAdminUrl(e.target.value)}
            placeholder="https://admin.kiddostyle.gcvdanta.com/"
            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Dynamic Architecture steps */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Core Architecture & Infrastructure Steps
          </label>
          <button
            type="button"
            onClick={handleAddArch}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Step
          </button>
        </div>
        <div className="space-y-2">
          {architecture.map((arch, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                required
                value={arch}
                onChange={(e) => handleArchChange(idx, e.target.value)}
                placeholder="e.g. Secure Stripe API pipelines for seamless credit card authorizations."
                className="flex-1 border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              {architecture.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArch(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Key metrics */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Key Outcome Metrics
          </label>
          <button
            type="button"
            onClick={handleAddMetric}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Metric
          </button>
        </div>
        <div className="space-y-2">
          {metrics.map((metric, idx) => (
            <div key={idx} className="flex gap-4">
              <input
                type="text"
                required
                value={metric.label}
                onChange={(e) =>
                  handleMetricChange(idx, "label", e.target.value)
                }
                placeholder="Metric Label (e.g. Lighthouse Performance Score)"
                className="flex-1 border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <input
                type="text"
                required
                value={metric.value}
                onChange={(e) =>
                  handleMetricChange(idx, "value", e.target.value)
                }
                placeholder="Value (e.g. 98/100)"
                className="w-1/3 border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              {metrics.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(idx)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mock Slideshow & Viewport screenshots list */}
      <div className="space-y-6 border-t border-slate-100 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Showcase Gallery Screenshots (2D UI Mockups)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Add screenshots and mockups representing the live platform pages
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAddScreenshot("storefront")}
              className="px-3 py-1.5 border border-blue-100 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Storefront Slide
            </button>
            <button
              type="button"
              onClick={() => handleAddScreenshot("admin")}
              className="px-3 py-1.5 border border-indigo-100 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Admin Slide
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {screenshots.map((screen, idx) => (
            <div
              key={idx}
              className="bg-slate-50/50 border border-slate-200/50 p-4 rounded-xl space-y-4 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveScreenshot(idx)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                title="Remove Screenshot"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Screenshot Label / Caption
                  </label>
                  <input
                    type="text"
                    required
                    value={screen.label}
                    onChange={(e) =>
                      handleScreenshotChange(idx, "label", e.target.value)
                    }
                    placeholder="e.g. Storefront - Product Detail Page"
                    className="w-full border border-slate-200 bg-white rounded-xl py-2 px-3 text-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Type
                  </label>
                  <select
                    value={screen.type}
                    onChange={(e) =>
                      handleScreenshotChange(idx, "type", e.target.value)
                    }
                    className="w-full border border-slate-200 bg-white rounded-xl py-2.5 px-3 text-slate-800 text-sm focus:outline-none"
                  >
                    <option value="storefront">Storefront Page</option>
                    <option value="admin">Admin Portal View</option>
                  </select>
                </div>
              </div>

              {/* S3 image uploader nested for this screenshot */}
              <ImageUploader
                label="Mockup Screen Upload"
                initialUrl={screen.path}
                onUploadSuccess={(url) =>
                  handleScreenshotChange(idx, "path", url)
                }
              />
            </div>
          ))}

          {screenshots.length === 0 && (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
              No slideshow screenshot mockups added yet. Add storefront or admin
              slides above.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
