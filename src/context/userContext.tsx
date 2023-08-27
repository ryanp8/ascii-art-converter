import React from 'react';

interface User {
  userId: string;
  username: string;
}

interface UserContext {
  user: User | null;
  setUser: (user: User | null) => void
}

export const UserContext = React.createContext<UserContext>({
  user: null,
  setUser: (user: User | null) => {}
});
