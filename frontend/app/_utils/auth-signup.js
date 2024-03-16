'use client'
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from "react";
import { useRouter } from 'next/navigation';  
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      window.alert('User signed up successfully!'); 
      console.log(user);
    } catch (error) {
      window.alert(`Sign up failed: ${error.message}`); 
      console.error("Sign up failed:", error.message);
    }
  };

  const handleBackButtonClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96 bg-white p-8 rounded shadow-lg">
        <CardHeader
          variant="gradient"
          className="mb-4 grid h-16 place-items-center"
        >
          <Typography variant="h3">
            Sign Up
          </Typography>
        </CardHeader>
                <CardBody className="flex flex-col gap-4">
          <Typography variant="paragraph" className="text-gray-600">
            Email
          </Typography>
          <Input
            size="lg"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
          <Typography variant="paragraph" className="text-gray-600">
            Password
          </Typography>
          <Input
            size="lg"
            type="password"
            style={{ width: '100%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
          />

          <Button variant="gradient" color="white" fullWidth onClick={signUp}>
            Submit
          </Button>
        </CardBody>
      </Card>
      <button
        className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition duration-300 absolute bottom-4 right-4"
        onClick={handleBackButtonClick}
      >
        Back
      </button>
    </div>
  );
};

