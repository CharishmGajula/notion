import React from 'react';
import { useUser } from '../Context/useContext';

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
