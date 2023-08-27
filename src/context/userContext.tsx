import React from 'react';

interface User {
  userId: string;
  accessToken: string;
}

export const UserContext = React.createContext<User | null>(null);
