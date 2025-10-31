import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchTeamByProjectId } from "../../Slices/ProjectSlice";
import { useNavigate, useParams } from "react-router-dom";

export default function TeamPage() {
  const params = useParams();
  const projectId = params.id;
  const { projectError, team, ProjectLoading, ProjectDetails } = useSelector((state) => state.Project);
  const dispatch = useDispatch();
  const [selectedMember, setSelectedMember] = useState(null);
  console.log(ProjectDetails);
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(FetchTeamByProjectId(projectId)).unwrap()
      .then((data) => {
        console.log(data);
      });
  }, []);

  const handleViewDetail = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  const getRoleBadgeClass = (role) => {
    return role === 'manager' 
      ? 'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200' 
      : 'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200';
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active'
      ? 'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200'
      : 'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-100 text-red-600 border border-red-200';
  };
  
  console.log("hi", team);

  if (ProjectLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Error loading team members: {projectError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-slate-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">Team Members ({team.length})</h1>
        <p className="text-lg text-slate-500">Project team overview and member details</p>
      </div>

      {team && team.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
              <tr>
                <th className="px-6 py-5 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">Member</th>
                <th className="px-6 py-5 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-5 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">Email</th>
                <th className="px-6 py-5 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-5 border-b-2 border-slate-200 text-left font-bold text-gray-700 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr key={member._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 min-w-[250px]">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member?.user?.avatarUrl} 
                        alt={member?.user?.name} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = 'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png';
                        }}
                      />
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-slate-800 text-sm">{member?.user?.name}</span>
                        <span className="text-xs text-slate-500 font-mono">ID: {member.user?._id.slice(-8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={getRoleBadgeClass(member.user?.role)}>
                      {member.role.charAt(0).toUpperCase() + member.user?.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-600 font-mono text-xs">{member.user?.email}</td>
                  <td className="px-6 py-5">
                    <span className={getStatusBadgeClass(member.user?.status)}>
                      {member.user?.status?.charAt(0).toUpperCase() + member.user?.status?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wider hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all hover:shadow-md active:translate-y-0"
                      onClick={() => navigate(`/dashboard/project/${params.id}/team/${member.user._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No team members found</h3>
          <p className="text-slate-500">No team members are assigned to this project yet.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-800">Member Details</h2>
              <button className="text-2xl text-slate-500 hover:text-slate-700" onClick={closeModal}>×</button>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <img 
                  src={selectedMember.user.avatarUrl} 
                  alt={selectedMember.user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-200"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">Full Name:</label>
                  <span className="text-slate-800">{selectedMember.user.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">Email:</label>
                  <span className="text-slate-800">{selectedMember.user.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">Project Role:</label>
                  <span className={getRoleBadgeClass(selectedMember.role)}>
                    {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">Account Status:</label>
                  <span className={getStatusBadgeClass(selectedMember.user.status)}>
                    {selectedMember.user.status.charAt(0).toUpperCase() + selectedMember.user.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">User ID:</label>
                  <span className="text-slate-600 font-mono text-sm">{selectedMember.user._id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">Joined:</label>
                  <span className="text-slate-800">{new Date(selectedMember.user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <label className="font-medium text-slate-500">Last Updated:</label>
                  <span className="text-slate-800">{new Date(selectedMember.user.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}