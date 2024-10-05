"use client";
import { useEffect, useState } from 'react';
import { signIn, useSession  } from 'next-auth/react';
import Brand from '../public/images/brand.jpg';
import Image from 'next/image';

interface FormValues {
  email: string;
  password: string;
  loginAs: "player"; // Make sure this is the only value it can take
}

export default function Register() {
  // Initialize formValues with loginAs included
  const [formValues, setFormValues] = useState<FormValues>({ email: '', password: '', loginAs: "player" });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { data: session } = useSession();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
     
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formValues),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }
      
      console.log(formValues.email);
      const res = await signIn('credentials', {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        loginAs: formValues.loginAs, // Use loginAs from formValues
      });

      //window.location.href = '/completeprofile';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong!');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    // Check session data after login
    if (session) {
      if (!session.user.name) {
        window.location.href = '/completeprofile';
      }
    }
  }, [session]);

  return (
    <>
      <div className="flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="flex-1 bg-white p-4 md:p-8">
          <div className="bg-white rounded-lg p-12 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-left">Sign Up</h2>
            {error && <p className="text-red-600">{error}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formValues.password}
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Sign Up
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
