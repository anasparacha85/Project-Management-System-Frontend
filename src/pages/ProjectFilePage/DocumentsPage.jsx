import React, { useEffect, useState, useRef } from "react";
import "./DocumentsPage.css";
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
      <div className="documents-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      {/* Header Section */}
      <div className="documents-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="doc-page-title">
              <span className="doc-title-icon">📂</span>
              Project Documents
            </h1>
            <p className="doc-page-subtitle">
              Manage and organize your project files and documents
            </p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{ProjectDetails?.files?.length || 0}</span>
              <span className="stat-label">Files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div className="upload-card">
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleFileInputClick}
          >
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
            <h3 className="upload-title">Upload Documents</h3>
            <p className="upload-description">
              Drag and drop files here, or click to select files
            </p>
            <p className="upload-hint">
              Support for PDF, DOC, PPT, Images and more (Max 10MB per file)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="file-input-hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
            />
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="selected-files">
              <h4 className="selected-files-title">
                Selected Files ({selectedFiles.length})
              </h4>
              <div className="selected-files-list">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="selected-file-item">
                    <div className="file-info">
                      <span className="file-icon">{getFileIcon(file.name)}</span>
                      <div className="file-details">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    {isUploading && uploadProgress[index] !== undefined ? (
                      <div className="upload-progress">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{uploadProgress[index]}%</span>
                      </div>
                    ) : (
                      <button
                        className="remove-file-btn"
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
              <div className="upload-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedFiles([])}
                  disabled={isUploading}
                >
                  Clear All
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                >
                  {isUploading ? (
                    <>
                      <div className="btn-spinner"></div>
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
      <div className="documents-grid">
        <div className="document-card">
          <div className="card-header">
            <div className="card-title-section">
              <h2 className="document-title">
                {ProjectDetails?.name || "Project Files"}
              </h2>
              <p className="document-description">
                {ProjectDetails?.description || "All project related documents and files"}
              </p>
            </div>
            <div className="card-actions">
              <button className="btn btn-outline">
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
            <div className="files-table-container">
              <table className="files-table">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ProjectDetails.files.map((file, index) => (
                    <tr key={file._id || index} className="file-row">
                      <td className="file-cell">
                        <div className="file-info">
                          <span className="file-icon">{getFileIcon(file.filename)}</span>
                          <div className="file-details">
                            <span className="file-name">{file.filename}</span>
                            <span className="file-extension">
                              {file.filename?.split('.').pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="file-size">
                        {file.size ? formatFileSize(file.size) : 'N/A'}
                      </td>
                      <td className="file-date">
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
                      <td className="file-actions">
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
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
                            className="action-btn download-btn"
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
            <div className="empty-state">
              <div className="empty-icon">
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
              <h3>No documents yet</h3>
              <p>Upload your first document to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;