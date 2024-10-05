"use client"; // Important for using hooks in Next.js 13+

import { useState, useRef } from 'react';
import DefaultPic from "../../public/default.jpg";
import Brand from '../../public/images/brand.jpg';
import Image from 'next/image';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  location: string;
  sport: string;
  clubName: string;
  qualifications: string;
  expectedCharge: string;
  password: string;
  image: File | null; 
}

export default function Register() {
  const [formValues, setFormValues] = useState<FormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    location: '',
    sport: '',
    clubName: '',
    qualifications: '',
    expectedCharge: '',
    password: '',
    image: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // New loading state
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true); // Set loading state to true
    const formData = new FormData();
    for (const key in formValues) {
      const value = formValues[key as keyof FormValues];
      formData.append(key, value as string | Blob);
    }
    try {
      const response = await fetch('/api/coach/signup', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token in localStorage
      // Redirect to protected route or homepage
      window.location.href = '/coach/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong!');
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFormValues({ ...formValues, image: event.target.files[0] });
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="flex-1 bg-white p-4 md:p-8">
          <div className="bg-white rounded-lg p-12 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-left">Coach Sign Up</h2>
            {error && <p className="text-red-600">{error}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            
            {/* Loader Display */}
            {loading && <p className="text-blue-600">Submitting your information... Please wait.</p>}
            
            <form onSubmit={handleSubmit}>
              {/* Profile Image */}
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">
                  Profile Image
                </label>
                <div className="relative items-center cursor-pointer" onClick={handleImageClick}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 m-auto"> {/* Fixed size for the container */}
                    <Image
                      src={formValues.image ? URL.createObjectURL(formValues.image) : DefaultPic}
                      alt="Profile Image"
                      layout="responsive" // Maintain aspect ratio
                      width={100}
                      height={100}
                      className="object-cover w-full h-full" // Ensures the image covers the entire container
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" // Hide the file input
                    ref={fileInputRef} // Reference to the hidden input
                  />
                </div>
              </div>

              {/* First Name */}
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-700 text-sm font-semibold mb-2">Gender</label>
                <select
                  name="gender"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="Select Gender" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label htmlFor="location" className="block text-gray-700 text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.location}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Sport */}
              <div className="mb-4">
                <label htmlFor="sport" className="block text-gray-700 text-sm font-semibold mb-2">What Sport Do you Coach?</label>
                <select
                  name="sport"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.sport}
                  onChange={handleChange}
                  required
                >
                  <option value="Select Sport" disabled>Select Sport</option>
                  <option value="Soccer">Soccer</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  {/* Add more sports as needed */}
                </select>
              </div>

              {/* Club/Company Name */}
              <div className="mb-4">
                <label htmlFor="clubName" className="block text-gray-700 text-sm font-semibold mb-2">Name of the Club or Company</label>
                <input
                  type="text"
                  name="clubName"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.clubName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Qualifications */}
              <div className="mb-4">
                <label htmlFor="qualifications" className="block text-gray-700 text-sm font-semibold mb-2">Qualifications</label>
                <textarea
                  name="qualifications"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.qualifications}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              {/* Expected Charge */}
              <div className="mb-4">
                <label htmlFor="expectedCharge" className="block text-gray-700 text-sm font-semibold mb-2">Expected Charge (per session)</label>
                <input
                  type="text"
                  name="expectedCharge"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.expectedCharge}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} // Disable button when loading
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Submitting...' : 'Sign Up'}
              </button>
            </form>
            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>

        {/* Brand Section */}
        <div className="flex-1 bg-white">
          <Image
            src={Brand}
            alt="brand"
            layout="responsive"
            width={500}
            height={500}
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
