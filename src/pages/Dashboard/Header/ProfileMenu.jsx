import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { UserService } from '../../../service/UserService';
import { AuthService } from '../../../service/AuthService';
import { FiEdit, FiLogOut, FiCheck, FiX } from 'react-icons/fi';
import { User } from '../../../models/User';
import {useClickOutside} from '../../../Hooks/useClickOutside'

const ProfileMenu = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const fileInputRef = useRef(null);
  const menuRef = useRef();
  useClickOutside(menuRef, () => setIsMenuOpen(false));

  // Cargar datos del usuario
  useEffect(() => {
    const loadUser = async () => {
      if (currentUser?.uid) {
        try {
          const data = await UserService.getUserById(currentUser.uid);
          setUserData(data);
        } catch (error) {
          console.error('Error cargando usuario:', error);
        }
      }
    };
    loadUser();
  }, [currentUser]);

  // Editar displayName
  const handleNameEdit = async () => {
    if (newDisplayName.trim().length < 3) return;
    
    try {
      await UserService.updateUser(currentUser.uid, {
        displayName: newDisplayName
      });
      const updatedUser = new User({
        ...userData,
        displayName: newDisplayName
      });
      setUserData(updatedUser);
      setIsEditingName(false);
    } catch (error) {
      console.error('Error actualizando nombre:', error);
    }
  };

  // Editar foto
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      //Eliminar imagen de blob si hay una url ya.
      if (userData?.photoURL) {
        const url = new URL(userData.photoURL);
        const blobId = url.searchParams.get("blobId");
        
        if (blobId) {
          await fetch(
            `/.netlify/functions/delete?userId=${currentUser.uid}&type=profile&blobId=${blobId}`,
            { method: "DELETE" }
          );
        }
      }

      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch(
        `/.netlify/functions/upload?userId=${currentUser.uid}&type=profile`, // Usar ruta absoluta
        {
          method: "POST",
          body: formData,
        }
      );
  
      const { publicUrl } = await response.json();
  
      await UserService.updateUser(currentUser.uid, { photoURL: publicUrl });
      setUserData(prev => ({ ...prev, photoURL: publicUrl }));
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen');
    }
  };

  // Desloguearme
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = '/login'; // Redirige al login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="relative z-40" ref={menuRef}>
      {/* Botón del avatar */}
      <div className="relative group">
        <button
          className="relative rounded-full overflow-hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {userData?.photoURL ? (
            <img 
              src={userData.photoURL}
              className="h-16 w-16 rounded-full object-cover cursor-pointer"
              alt="Avatar"
            />
          ) : (
            <div className="h-12 w-12 bg-blue-500 flex items-center justify-center text-white text-xl">
              {userData?.getInitials()}
            </div>
          )}
        </button>
      </div>

      {/* Menú desplegable */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100">
          <div className="p-4 border-b">
            <div className="mb-4">
              {/* Sección de foto con input oculto */}
              <div className="relative flex justify-center pb-4">
                <div className="group relative">
                  {userData?.photoURL ? (
                    <img 
                      src={userData.photoURL} 
                      className="h-16 w-16 rounded-full object-cover cursor-pointer"
                      alt="Avatar"
                      onClick={() => fileInputRef.current.click()}
                    />
                  ) : (
                    <div 
                      className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl cursor-pointer"
                      onClick={() => fileInputRef.current.click()}
                    >
                      {userData?.getInitials()}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <button 
                    className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md border hover:bg-gray-50"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiEdit className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Edición de nombre */}
              <div className="flex flex-col items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="border rounded-lg px-2 py-1 text-sm"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <button 
                        onClick={handleNameEdit}
                        className="text-green-600 hover:text-green-700"
                      >
                        <FiCheck className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => setIsEditingName(false)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Hola {userData?.displayName}</h3>
                    <button 
                      onClick={() => {
                        setNewDisplayName(userData?.displayName || '');
                        setIsEditingName(true);
                      }}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <p className="text-sm text-gray-500">{userData?.email}</p>
              </div>
            </div>
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FiLogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;