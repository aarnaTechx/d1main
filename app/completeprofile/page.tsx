"use client";

import { useState, useRef } from "react";
import Header from "../components/Header";
import Brand from "../public/images/brand.jpg";
import Image from "next/image";
import DefaultPic from "../public/default.jpg";
import { useSession } from "next-auth/react";

interface FormValues {
  first_name: string;
  last_name: string;
  grade_level: string;
  location: string;
  birthday: string;
  gender: string;
  sport: string;
  team: string;
  position: string;
  number: string;
  image: File | null; // To handle image upload
}

export default function Register() {
  const [formValues, setFormValues] = useState<FormValues>({
    first_name: "",
    last_name: "",
    grade_level: "",
    location: "",
    birthday: "",
    gender: "",
    sport: "",
    team: "",
    position: "",
    number: "",
    image: null,
  });
  const { data: session } = useSession(); 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference to file input

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();

    // Append all form values to FormData
    for (const key in formValues) {
      const value = formValues[key as keyof FormValues];
      formData.append(key, value as string | Blob);
    }
    if (session && session.user.id) {
      formData.append('playerID', session.user.id); // Assuming user.id is the ID
    } else {
      setError("User is not authenticated");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong!");
      }

      const data = await response.json();
      // localStorage.setItem('token', data.token); // Store token in localStorage
      window.location.href = "/dashboard"; // Redirect after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
   
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="w-full lg:w-1/2 justify-center bg-white-500 p-4 ">
          <div className="bg-white rounded-lg p-12 max-w-md w-full m-auto shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-left">Add Your Personal Information</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
  <div className="mb-4">
    <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">
      Profile Image
    </label>
    <div className="items-center cursor-pointer" onClick={handleImageClick}>
      <Image
        src={formValues.image ? URL.createObjectURL(formValues.image) : DefaultPic}
        alt="Profile Image"
        width={100}
        height={100}
        className="rounded-full m-auto"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden" // Hide the file input
        ref={fileInputRef} // Reference to the hidden input
      />
    </div>
  </div>

  
  {[
    { label: "First Name", name: "first_name", type: "text" },
    { label: "Last Name", name: "last_name", type: "text" },
    { label: "Location", name: "location", type: "text" },
    { label: "Birthday", name: "birthday", type: "date" },
  ].map(({ label, name, type }) => (
    <div className="mb-4" key={name}>
      <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-2">
        {label}
      </label>
      <input
        type={type}
        className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        name={name}
        value={formValues[name as keyof Omit<FormValues, 'image'>] as string} // Handle non-file inputs
        onChange={handleChange}
        required
      />
    </div>
  ))}


{[
  { label: "Grade Level", name: "grade_level", options: ["Select Grade Level", "1", "2", "3"] },
  { label: "Gender", name: "gender", options: ["Select Gender", "Male", "Female", "Other"] },
  { label: "Sport", name: "sport", options: ["Select Sport", "Soccer", "Basketball", "Baseball"] },
  { label: "Position", name: "position", options: ["Select Position", "Forward", "Defender", "Goalkeeper"] },
  { label: "Number", name: "number", options: ["Select Number", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
].map(({ label, name, options }) => (
  <div className="mb-4" key={name}>
    <label htmlFor={name} className="block text-gray-700 text-sm font-semibold mb-2">
      {label}
    </label>
    <select
      name={name}
      className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formValues[name as keyof Omit<FormValues, 'image'>] || ""} // Exclude 'image' from the key lookup
      onChange={handleChange}
      required
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
))}

 

  <button
    type="submit"
    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
  >
    Submit Details
  </button>
</form>

          </div>
        </div>

        <div className="w-full lg:w-1/2 mt-6 lg:mt-0 bg-white-500">
          <Image src={Brand} alt="brand" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}
