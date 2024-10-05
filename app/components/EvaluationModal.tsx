"use client"; // Ensure this is a client component
import { useState } from 'react';
import Swal from 'sweetalert2';
interface EvaluationModalProps {
  onClose: () => void;
  isOpen: boolean;
  coachId: string | null;   // Added coachId prop
  playerId: string | null;  // Added playerId prop
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ isOpen,onClose, coachId, playerId }) => {
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [primaryVideoUrl, setPrimaryVideoUrl] = useState<string>('');
  const [videoUrl2, setVideoUrl2] = useState<string>('');
  const [videoUrl3, setVideoUrl3] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  if (!isOpen) return null;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation checks
    if (!reviewTitle || !primaryVideoUrl || !videoDescription) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Simulating an API call or form submission
    try {
      const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewTitle,
          primaryVideoUrl,
          videoUrl2,
          videoUrl3,
          videoDescription,
          coachId,    // Pass the coachId to the API
          playerId  // Pass the coachslug to the API if necessary
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Evaluation submitted successfully.',
        confirmButtonText: 'Go to Dashboard',
    });

    // Redirect to the dashboard after the alert is confirmed
    window.location.href = '/dashboard'; 
       
      //onClose(); // Close the modal after successful submission
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-3 text-center">Submit Evaluation</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Review Title */}
          <div className="mb-4">
            <label htmlFor="reviewTitle" className="block text-gray-700 mb-1">
              Review Title
            </label>{playerId}{coachId}
            <input
              placeholder='Game against XYZ on MM/DD'
              type="text"
              id="reviewTitle"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              required
            />
          </div>

          {/* Primary Video URL */}
          <div className="mb-4">
            <label htmlFor="primaryVideoUrl" className="block text-gray-700 mb-1">
              Primary Video Link/URL
            </label>
            <input
              placeholder='www.exampleurl.com'
              type="url"
              id="primaryVideoUrl"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={primaryVideoUrl}
              onChange={(e) => setPrimaryVideoUrl(e.target.value)}
              required
            />
            <span className='text-xs text-gray-400 leading-3' style={{ lineHeight: '0.75rem' }}>If you want feedback on a Trace video, download the file from Trace, upload to Google Drive, and share that link here for the coach. For Veo, ensure the match is set to public in order to share the link.</span>
          </div>

          {/* Video URL #2 (Optional) */}
          <div className="mb-4">
            <label htmlFor="videoUrl2" className="block text-gray-700 mb-1">
              Video Link/URL #2 (Optional)
            </label>
            <input
              placeholder='www.exampleurl.com'
              type="url"
              id="videoUrl2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={videoUrl2}
              onChange={(e) => setVideoUrl2(e.target.value)}
            />
          </div>

          {/* Video URL #3 (Optional) */}
          <div className="mb-4">
            <label htmlFor="videoUrl3" className="block text-gray-700 mb-1">
              Video Link/URL #3 (Optional)
            </label>
            <input
              placeholder='www.exampleurl.com'
              type="url"
              id="videoUrl3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={videoUrl3}
              onChange={(e) => setVideoUrl3(e.target.value)}
            />
          </div>

          {/* Video Description */}
          <div className="mb-4">
            <label htmlFor="videoDescription" className="block text-gray-700 mb-1">
              Video Description
            </label>
            <textarea
              rows={4}
              placeholder='Include a brief description of the video you are submitting, including any specific feedback you would like as well as specific timestamps to be aware of.'
              id="videoDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal;
