import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash, X, ImagePlus } from 'lucide-react';
import supabase from '../../supabaseClient'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

function DashboardAdmin() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    category: '',
    location: '',
    status: '',
    images: []
  });
  const [newPhoto, setNewPhoto] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handleLogout();
      }, 3600000); // 1 hour timeout
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    handleActivity(); // Initialize timer

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      if (error) throw error;

      const projectsWithUrls = await Promise.all(
        data.map(async (project) => {
          if (project.images) {
            const paths = project.images.split(',');
            const imageUrls = await Promise.all(
              paths.map(async (path) => {
                const { data } = supabase.storage
                  .from('project-images')
                  .getPublicUrl(path);
                return data.publicUrl;
              })
            );
            return { ...project, imageUrls };
          }
          return { ...project, imageUrls: [] };
        })
      );

      setProjects(projectsWithUrls);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      category: project.category,
      location: project.location,
      status: project.status,
      images: []
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', projectId);
        if (error) throw error;
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleAddPhoto = (project) => {
    setEditingProject(project);
    setIsAddPhotoModalOpen(true);
  };

  const handleImageClick = (images) => {
    setCarouselImages(images);
    setIsCarouselModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User is not authenticated');
      }

      let imagePaths = [];

      if (newProject.images && newProject.images.length > 0) {
        const uploadPromises = Array.from(newProject.images).map(async (image) => {
          const imageName = `${Date.now()}_${image.name}`;
          const { data, error } = await supabase
            .storage
            .from('project-images')
            .upload(imageName, image);
          if (error) throw error;
          imagePaths.push(data.path);
        });

        await Promise.all(uploadPromises);
      }

      const projectData = {
        name: newProject.name,
        category: newProject.category,
        location: newProject.location,
        status: newProject.status,
        images: imagePaths.join(',')
      };

      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setNewProject({
        name: '',
        category: '',
        location: '',
        status: '',
        images: []
      });
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPhotoSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User is not authenticated');
      }

      if (newPhoto) {
        const imageName = `${Date.now()}_${newPhoto.name}`;
        const { data, error } = await supabase
          .storage
          .from('project-images')
          .upload(imageName, newPhoto);
        if (error) throw error;

        const imagePath = data.path;
        const updatedImages = editingProject.images
          ? `${editingProject.images},${imagePath}`
          : imagePath;

        const { error: updateError } = await supabase
          .from('projects')
          .update({ images: updatedImages })
          .eq('id', editingProject.id);
        if (updateError) throw updateError;

        setIsAddPhotoModalOpen(false);
        setNewPhoto(null);
        fetchProjects();
      }
    } catch (error) {
      console.error("Error adding photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#36454F]">Project Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleAddProject}
              className="flex items-center space-x-2 bg-[#FF0000] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              <Plus className="h-5 w-5" />
              <span>Add Project</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-[#FF0000] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {project.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      {project.imageUrls && project.imageUrls.slice(0, 5).map((url, idx) => (
                        <img
                          key={idx}
                          className="w-10 h-10 object-cover rounded-md cursor-pointer"
                          src={url}
                          alt={project.name}
                          onClick={() => handleImageClick(project.imageUrls)}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-900 mr-2"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleAddPhoto(project)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <ImagePlus className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#36454F]">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#36454F] mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#36454F] mb-1">
                  Category
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newProject.category}
                  onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                >
                  <option value="">Select category</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Ballroom">Ballroom</option>
                  <option value="Office">Office</option>
                  <option value="Mall">Mall</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#36454F] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newProject.location}
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#36454F] mb-1">
                  Status
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={newProject.status}
                  onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                >
                  <option value="">Select status</option>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#36454F] mb-1">
                  Project Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setNewProject({...newProject, images: e.target.files})}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF0000] text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {isAddPhotoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#36454F]">
                Add Photo to {editingProject.name}
              </h3>
              <button onClick={() => setIsAddPhotoModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#36454F] mb-1">
                  Select Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  onChange={(e) => setNewPhoto(e.target.files[0])}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF0000] text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Saving...' : 'Add Photo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Carousel Modal */}
      {isCarouselModalOpen && (
        <Modal
          isOpen={isCarouselModalOpen}
          onRequestClose={() => setIsCarouselModalOpen(false)}
          contentLabel="Image Carousel"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#36454F]">
                Image Carousel
              </h3>
              <button onClick={() => setIsCarouselModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-scroll">
              {carouselImages.map((url, idx) => (
                <img
                  key={idx}
                  className="w-60 h-60 object-cover rounded-md"
                  src={url}
                  alt={`Carousel Image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default DashboardAdmin;