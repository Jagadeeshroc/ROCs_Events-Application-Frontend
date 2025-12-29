export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  mobile?: string;
  profileImage?: string;
}

// ... keep AuthResponse and EventData as they were
export interface EventData {
  images: any;
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  image?: string;
  organizer: User;
  attendees: User[]; 
}; // Array of User IDs


export interface AuthResponse {
  token: string;
  user: User;
}