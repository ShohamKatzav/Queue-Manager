import { createContext } from 'react';
import { User } from '../types/User';

type UserContextType = {
  user: User | null;
  updateUser: (user: User | null) => void;
  updateUserType: (user: string) => void;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);
export default UserContext;