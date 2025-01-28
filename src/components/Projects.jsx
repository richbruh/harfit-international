import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import supabase from '../../supabaseClient';
import Modal from 'react-modal';
import { useInView } from 'react-intersection-observer';

const Projects = React.memo(() => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;

      const projectsWithImages = await Promise.all(
        data.map(async (project) => {
          const imagePaths = project.images?.split(',') || [];
          const imageUrls = await Promise.all(
            imagePaths.map(async (path) => {
              const { data } = supabase.storage.from('project-images').getPublicUrl(path);
              return data.publicUrl;
            })
          );
          return {
            title: project.name,
            images: imageUrls,
            category: project.category,
            location: project.location,
            description: project.description || ''
          };
        })
      );

      setProjects(projectsWithImages);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  const handleImageClick = (images, index) => {
    setCarouselImages(images);
    setCurrentImageIndex(index);
    setIsCarouselModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        <div>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-md ${activeCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('Apartment')}
            className={`ml-2 px-4 py-2 rounded-md ${activeCategory === 'Apartment' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Apartment
          </button>
          <button
            onClick={() => setActiveCategory('Hotel')}
            className={`ml-2 px-4 py-2 rounded-md ${activeCategory === 'Hotel' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Hotel
          </button>
          <button
            onClick={() => setActiveCategory('Office')}
            className={`ml-2 px-4 py-2 rounded-md ${activeCategory === 'Office' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Office
          </button>
          <button
            onClick={() => setActiveCategory('Mall')}
            className={`ml-2 px-4 py-2 rounded-md ${activeCategory === 'Mall' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Mall
          </button>
          <button
            onClick={() => setActiveCategory('Ballroom')}
            className={`ml-2 px-4 py-2 rounded-md ${activeCategory === 'Ballroom' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Ballroom
          </button>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects
          .filter(project => activeCategory === 'all' || project.category === activeCategory)
          .map((proj, index) => (
            <ProjectCard
              key={index}
              project={proj}
              onImageClick={handleImageClick}
            />
          ))}
      </div>

      {isCarouselModalOpen && (
        <Modal
          isOpen={isCarouselModalOpen}
          onRequestClose={() => setIsCarouselModalOpen(false)}
          contentLabel="Image Carousel"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-lg max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#36454F]">
                Images
              </h3>
              <button onClick={() => setIsCarouselModalOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex justify-center items-center">
              <button
                onClick={previousImage}
                className="absolute left-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                ←
              </button>
              <img
                src={carouselImages[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={nextImage}
                className="absolute right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
              >
                →
              </button>
            </div>
            <div className="text-center mt-4 text-gray-600">
              Image {currentImageIndex + 1} of {carouselImages.length}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});

const ProjectCard = React.memo(({ project, onImageClick }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div
      ref={ref}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-opacity duration-500 ${inView ? 'opacity-100' : 'opacity-0'}`}
    >
      <img
        src={project.images[0]}
        alt={project.title}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={() => onImageClick(project.images, 0)}
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-1">Location: {project.location}</p>
        <p className="text-gray-600 mb-1">Category: {project.category}</p>
        <p className="text-gray-700">{project.description}</p>
      </div>
    </div>
  );
});

export default Projects;