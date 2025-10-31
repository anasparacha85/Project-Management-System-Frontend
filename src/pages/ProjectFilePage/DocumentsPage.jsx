import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FetchDocumentsByProjectId, FetchProjectDetailsById } from "../../Slices/ProjectSlice";
import ApiServices from "../../ApiService/ApiService";

const DocumentsPage = () => {
  const params = useParams();
  const {
    projectError,
    ProjectDocuments,
    ProjectLoading,
    ProjectDetails,
  } = useSelector((state) => state.Project);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // dispatch(FetchDocumentsByProjectId(params.id))
  }, [params.id]);

  console.log("hi", ProjectDocuments);
  console.log("Project Details:", ProjectDetails);

  // Handle file selection
  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Add file validation here (size, type, etc.)
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle file input click
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Remove selected file
  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle file upload
const handleUpload = async () => {
  if (selectedFiles.length === 0) return;

  setIsUploading(true);
  try {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file); // multiple files ek hi key ke under
    });

    const data = await ApiServices.uploadFilesByProjectId(formData, params.id);

    alert(data.SuccessMessage);
    dispatch(FetchProjectDetailsById(params.id));
    setSelectedFiles([]); // clear after success
  } catch (error) {
    alert("Upload failed: " + error.message);
  } finally {
    setIsUploading(false);
  }
};


  // Get file icon based on extension
  const getFileIcon = (filename) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📈';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'mp4':
      case 'mov':
      case 'avi':
        return '🎥';
      case 'zip':
      case 'rar':
        return '🗜️';
      default:
        return '📎';
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (ProjectLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
        <div className="flex flex-col items-center gap-4 py-24 text-slate-600">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg border border-slate-100">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-800 mb-2">
              <span className="text-3xl bg-gradient-to-br from-blue-600 to-blue-800 bg-clip-text text-transparent">📂</span>
              Project Documents
            </h1>
            <p className="text-slate-600 text-base">
              Manage and organize your project files and documents
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center px-5 py-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <span className="block text-2xl font-bold text-blue-800">{ProjectDetails?.files?.length || 0}</span>
              <span className="block text-xs font-medium text-blue-700 uppercase tracking-wide mt-1">Files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
          <div
            className={`border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer transition-all duration-300 bg-slate-50 relative overflow-hidden ${
              dragActive 
                ? 'border-green-500 bg-green-50 scale-105 shadow-lg ring-4 ring-green-100' 
                : 'hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5 hover:shadow-xl'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleFileInputClick}
          >
            <div className={`mb-4 transition-all duration-300 ${
              dragActive 
                ? 'text-green-500 animate-bounce' 
                : 'text-slate-500 hover:text-blue-500 hover:scale-110'
            }`}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto">
                <path
                  d="M28 8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12V36C8 37.0609 8.42143 38.0783 9.17157 38.8284C9.92172 39.5786 10.9391 40 12 40H36C37.0609 40 38.0783 39.5786 38.8284 38.8284C39.5786 38.0783 40 37.0609 40 36V20L28 8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M28 8V20H40"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 26L24 22L28 26"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 22V34"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload Documents</h3>
            <p className="text-slate-600 text-base mb-2">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-slate-500 text-sm">
              Support for PDF, DOC, PPT, Images and more (Max 10MB per file)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
            />
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-base font-semibold text-slate-700 mb-4">
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="flex flex-col gap-3 mb-5">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 transition-all hover:bg-slate-100 hover:border-slate-300 animate-slideIn">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl w-6 text-center">{getFileIcon(file.name)}</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-slate-700">{file.name}</span>
                        <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    {isUploading && uploadProgress[index] !== undefined ? (
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-green-700 min-w-[35px]">{uploadProgress[index]}%</span>
                      </div>
                    ) : (
                      <button
                        className="bg-transparent border-none p-1.5 rounded cursor-pointer text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSelectedFile(index);
                        }}
                        disabled={isUploading}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M12 4L4 12M4 4L12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-slate-50 hover:border-slate-400 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => setSelectedFiles([])}
                  disabled={isUploading}
                >
                  Clear All
                </button>
                <button
                  className="px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none rounded-lg text-sm font-medium cursor-pointer transition-all hover:from-blue-700 hover:to-blue-900 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11.3333 5.33337L8 2.00004L4.66666 5.33337"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 2V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="flex items-start justify-between gap-5 p-6 pb-0">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-800 mb-1">{ProjectDetails?.name || "Project Files"}</h2>
              <p className="text-slate-600 text-sm">
                {ProjectDetails?.description || "All project related documents and files"}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-transparent text-slate-500 border border-slate-300 rounded-lg text-sm font-medium cursor-pointer transition-all hover:bg-slate-50 hover:border-slate-400 hover:text-slate-700 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6.66667 12H9.33333L10 9.33333H6L6.66667 12ZM4.66667 4V5.33333H11.3333V4H4.66667ZM5.33333 6.66667V8H10.6667V6.66667H5.33333Z"
                    fill="currentColor"
                  />
                </svg>
                Filter
              </button>
            </div>
          </div>

          {ProjectDetails?.files?.length > 0 ? (
            <div className="overflow-x-auto p-6 pt-0">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700 bg-slate-50 border-b-2 border-slate-200 text-xs uppercase tracking-wider">File</th>
                    <th className="text-left p-4 font-semibold text-slate-700 bg-slate-50 border-b-2 border-slate-200 text-xs uppercase tracking-wider">Size</th>
                    <th className="text-left p-4 font-semibold text-slate-700 bg-slate-50 border-b-2 border-slate-200 text-xs uppercase tracking-wider">Uploaded</th>
                    <th className="text-left p-4 font-semibold text-slate-700 bg-slate-50 border-b-2 border-slate-200 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ProjectDetails.files.map((file, index) => (
                    <tr key={file._id || index} className="border-b border-slate-100 transition-all hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getFileIcon(file.filename)}</span>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-slate-700">{file.filename}</span>
                            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wide">
                              {file.filename?.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 text-sm font-medium">
                        {file.size ? formatFileSize(file.size) : 'N/A'}
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {file.uploadedAt
                          ? new Date(file.uploadedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-start">
                          <button
                            className="p-2 bg-transparent border border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 text-slate-500"
                            onClick={() => window.open(file.url, '_blank')}
                            title="View file"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M1 8C1 8 3.63636 3 8 3C12.3636 3 15 8 15 8C15 8 12.3636 13 8 13C3.63636 13 1 8 1 8Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <a
                            href={file.url}
                            download
                            className="p-2 bg-transparent border border-slate-300 rounded-lg cursor-pointer transition-all hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-slate-500"
                            title="Download file"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M4.66667 6.66663L8 9.99996L11.3333 6.66663"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M8 2V10"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <div className="text-slate-300 mb-5 flex justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <path
                    d="M37.3333 10.6667H16C14.5275 10.6667 13.1152 11.2524 12.0816 12.2859C11.0481 13.3195 10.4624 14.7319 10.4624 16.2043L10.6667 48C10.6667 49.4725 11.2524 50.8848 12.2859 51.9183C13.3195 52.9519 14.7319 53.5376 16.2043 53.5376H48C49.4725 53.5376 50.8848 52.9519 51.9183 51.9183C52.9519 50.8848 53.5376 49.4725 53.5376 48V26.6667L37.3333 10.6667Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M37.3333 10.6667V26.6667H53.3333"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No documents yet</h3>
              <p className="text-sm">Upload your first document to get started</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 0.6s ease infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default DocumentsPage;