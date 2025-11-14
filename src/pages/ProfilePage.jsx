import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth here

function ProfilePage() {
  const { user } = useAuth(); // Get user data
  
  if (!user) {
    return <div>Loading profile...</div>; // Handle case where user is briefly null
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {user.name}! You are logged in.</p>
      <p>Your email is: {user.email}</p>
      <p>Your roles are: {user.roles.join(', ')}</p>
    </div>
  );
}

export default ProfilePage;