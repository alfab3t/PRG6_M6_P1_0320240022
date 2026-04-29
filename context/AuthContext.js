import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData] = useState({
    nama: 'Djohan Bagus Artya Wicaksana',
    nim_mhs: '0320240022',
    prodi: 'Informatika-2A',
  });

  return (
    <AuthContext.Provider value={{ userData }}>
      {children}
    </AuthContext.Provider>
  );
};
