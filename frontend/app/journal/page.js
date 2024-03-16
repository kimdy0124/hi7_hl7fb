"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Avatar, Progress } from "@material-tailwind/react"; 

const HomePage = () => {
  const { user, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [startConvert, setStartConvert] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileError('');
      console.log('File uploaded:', file.name);
    } else {
      setSelectedFile(null);
      setFileError('Please upload a PDF file.');
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      setFileError('Please select a file first.');
      return;
    }
    setStartConvert(true);
    setConversionProgress(0);
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Simulating conversion progress
    const conversionInterval = setInterval(() => {
      setConversionProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(conversionInterval);
        }
        return newProgress;
      });
    }, 50); // Adjust the interval for slower progression

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'converted.hl7');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setDownloadModalOpen(false);
      setFileError('');
    })
    .catch(error => {
      console.error('Conversion failed:', error);
      setFileError('Conversion failed. Please try again.');
    })
    .finally(() => {
      setStartConvert(false);
    });
  };

  const handleDownloadConfirmation = () => {
    setDownloadModalOpen(true);
  };

  const handleDownloadConfirm = () => {
    setDownloadModalOpen(false);
    handleConvert();
  };

  const handleDownloadCancel = () => {
    setDownloadModalOpen(false);
  };

  if (!user || loading) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-300 to-purple-300 min-h-screen flex flex-col justify-center items-center">
      <div className="text-right text-white absolute top-0 right-0 p-4">
        <Avatar src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" className="h-8 w-8" variant='rounded' size="xs" />
        <div className="text-lg">
          Logged in as: {user.email}
        </div>
        <div className="py-4">
          <button
            onClick={handleSignOut}
            className="bg-transparent border border-white text-white font-bold py-2 px-4 rounded hover:bg-white hover:text-blue-500 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="text-center text-white mb-8">
        <h1 className="text-4xl font-bold mb-2">Convert to HL7</h1>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        <div>
          <label htmlFor="fileUpload" className="text-lg border-2 border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-500 transition duration-300 cursor-pointer">
            Upload PDF File
            <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} accept="application/pdf" />
          </label>
          {fileError && <p className="text-red-500">{fileError}</p>}
        </div>
      </div>
      {selectedFile && (
        <div>
          <p className="text-white">Selected file: {selectedFile.name}</p>
          {!startConvert && (
            <div className="mt-4">
              <button
                onClick={handleDownloadConfirmation}
                className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition duration-300 block mx-auto"
              >
                Start Convert
              </button>
            </div>
          )}
          {startConvert && (
            <div className="mt-4">
              <p className="text-white">Converting... {conversionProgress}%</p>
              <Progress color="blue" value={conversionProgress} style={{ width: '200px', height: '10px' }} />
            </div>
          )}
        </div>
      )}
      {downloadModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">Would you like to download the converted file?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDownloadConfirm}
                className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={handleDownloadCancel}
                className="bg-gray-500 text-white rounded py-2 px-4 hover:bg-gray-600 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
