import React, { useEffect } from "react";
import "./DocumentsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FetchDocumentsByProjectId } from "../../Slices/ProjectSlice";

const DocumentsPage = () => {
const params=useParams()
const {projectError,ProjectDocuments,ProjectLoading,ProjectDetails}=useSelector((state)=>state.Project)
// const dispatch=useDispatch()
// console.log(ProjectDetails);

// useEffect(()=>{
//   dispatch(FetchDocumentsByProjectId(params.id))

// },[params.id])
console.log("hi",ProjectDocuments);
// if(!ProjectDocuments.files){
//   return "no files uploaded"
// }

  return (
    <div className="documents-container">
      <h1 className="pg-title">📂 Projects Attachments</h1>
      <div className="documents-grid">
      
          <div  className="document-card">
            <h2 className="document-title">{ProjectDetails.name}</h2>
            <p className="document-description">{ProjectDocuments.description}</p>
            
            <table className="files-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Uploaded At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

                {ProjectDetails?.files?.map((file) => (
                  <tr key={file._id}>
                    <td>{file.filename}</td>
                    <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                    <td>
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="download-btn"
                        download
                      >
                        ⬇ Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
      </div>
    </div>
  );
};

export default DocumentsPage;
