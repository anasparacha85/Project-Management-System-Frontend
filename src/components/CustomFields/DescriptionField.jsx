import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ApiServices from "../../ApiService/ApiService";

export default function DescriptionField({ description, setDescription, name, label = "Description" ,type,parent}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Generate description using AI
  const handleAIGenerate = async () => {
    if (!name?.trim()) {
      setError("Please enter a name before generating description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await ApiServices.GenerateDescription({name,type,parent})

    
      console.log(data);
      
      if (data.error) throw new Error(data.error);

      setDescription(data.description);
    } catch (err) {
      setError("AI failed to generate description. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 mt-4">
      <label className="block font-semibold text-gray-700">{label}</label>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md hover:scale-105 transition"
        >
          {loading ? "Generating..." : "✨ Generate with AI"}
        </button>
        <span className="text-gray-400 text-sm">or write manually below 👇</span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Quill Editor */}
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        placeholder={`Write or edit your ${label.toLowerCase()} here...`}
        className="bg-white border border-gray-300 rounded-lg min-h-[150px]"
      />

      <p className="text-xs text-gray-500">
        Tip: You can <b>bold</b>, <i>italicize</i>, or create bullet lists using the toolbar.
      </p>
    </div>
  );
}
