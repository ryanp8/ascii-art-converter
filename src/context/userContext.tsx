import React from 'react';

interface User {
  userId: string;
  accessToken: string;
}

export const UserContext = React.createContext({
  user: null,
  setUser: (user: User) => {}
});
