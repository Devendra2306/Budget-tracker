import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';

const presetAvatars = [
  'https://api.dicebear.com/7.x/notionists/svg?seed=Felix',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Luna',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Oliver'
];

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [photoURL, setPhotoURL] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setPhotoURL(currentUser.photoURL || presetAvatars[0]);
      setDisplayName(currentUser.displayName || '');
    }
  }, [isOpen, currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      setIsSaving(true);
      await updateProfile(currentUser, {
        displayName,
        photoURL
      });
      // Force a reload or update context if needed, but Firebase automatically updates currentUser object
      // We will reload the page just to ensure all components sync the new avatar immediately
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content glass-card"
            style={{ maxWidth: '400px' }}
          >
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="transaction-form">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                  <img 
                    src={photoURL} 
                    alt="Preview" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-color)' }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '50%', color: '#fff' }}>
                    <Camera size={16} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Choose Avatar</label>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {presetAvatars.map(url => (
                    <img 
                      key={url} 
                      src={url} 
                      onClick={() => setPhotoURL(url)}
                      style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer',
                        border: photoURL === url ? '2px solid var(--primary-color)' : '2px solid transparent'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Custom Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://example.com/my-photo.jpg"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <button type="submit" className="submit-btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : <><Save size={18} style={{marginRight:'0.5rem'}}/> Save Changes</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
