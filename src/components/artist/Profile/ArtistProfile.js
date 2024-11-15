import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useStorage } from '../../../hooks/useStorage';
import Button from '../../common/Button/Button';
import Input from '../../common/Input/Input';
import Loading from '../../common/Loading/Loading';
import { artistService } from '../../../services/artist.service';
import './ArtistProfile.css';

const ArtistProfile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const { uploadFile, progress } = useStorage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    artistName: '',
    genre: '',
    bio: '',
    socialLinks: {
      spotify: '',
      instagram: '',
      twitter: '',
      website: ''
    },
    achievements: []
  });

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        ...currentUser,
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const photoURL = await uploadFile(
          file,
          `artist-photos/${currentUser.uid}`
        );
        await updateUserProfile({ photoURL });
      } catch (error) {
        setError('Failed to upload image');
        console.error(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await artistService.updateArtistProfile(currentUser.uid, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <Loading />;

  return (
    <div className="artist-profile">
      <div className="artist-profile__header">
        <div className="artist-profile__photo-container">
          <img
            src={currentUser.photoURL || '/default-artist.png'}
            alt={formData.artistName}
            className="artist-profile__photo"
          />
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            onChange={handleImageUpload}
            className="artist-profile__photo-input"
          />
          <label htmlFor="photo-upload" className="artist-profile__photo-label">
            Change Photo
          </label>
          {progress > 0 && progress < 100 && (
            <div className="artist-profile__upload-progress">
              Uploading: {progress}%
            </div>
          )}
        </div>

        <div className="artist-profile__header-info">
          <h1>{formData.artistName}</h1>
          <p>{formData.genre}</p>
        </div>
      </div>

      {error && (
        <div className="artist-profile__error">
          {error}
        </div>
      )}

      {success && (
        <div className="artist-profile__success">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="artist-profile__form">
        <div className="artist-profile__section">
          <h2>Basic Information</h2>
          
          <Input
            label="Artist Name"
            name="artistName"
            value={formData.artistName}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
        </div>

        <div className="artist-profile__section">
          <h2>Social Links</h2>
          
          <Input
            label="Spotify Profile"
            name="socialLinks.spotify"
            value={formData.socialLinks.spotify}
            onChange={handleInputChange}
          />

          <Input
            label="Instagram"
            name="socialLinks.instagram"
            value={formData.socialLinks.instagram}
            onChange={handleInputChange}
          />

          <Input
            label="Twitter"
            name="socialLinks.twitter"
            value={formData.socialLinks.twitter}
            onChange={handleInputChange}
          />

          <Input
            label="Website"
            name="socialLinks.website"
            value={formData.socialLinks.website}
            onChange={handleInputChange}
          />
        </div>

        <div className="artist-profile__actions">
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArtistProfile;