// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react';
// import API from '../api';
// import { useNavigate } from 'react-router-dom';
// import type { AuthResponse } from '../types';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const { data } = await API.post<AuthResponse>('/auth/login', { email, password });
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       navigate('/');
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Login Failed');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-[80vh]">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <input 
//             type="email" placeholder="Email" value={email} 
//             onChange={(e) => setEmail(e.target.value)} required 
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <input 
//             type="password" placeholder="Password" value={password} 
//             onChange={(e) => setPassword(e.target.value)} required 
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//           <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;