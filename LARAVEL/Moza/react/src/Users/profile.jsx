import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const DEFAULT_AVATAR = '/profile.png';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    usertype: '',
    gender: '',
    date_of_birth: '',
    nric: '',
    phone_number: '',
    address: '',
    profile_image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Format ISO date (YYYY-MM-DD) to DD-MM-YYYY for display
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
  };

  // Parse DOB from NRIC (Malaysian NRIC format)
  const parseDobFromNric = (nric) => {
    const clean = nric.replace(/\D/g, '');
    if (clean.length < 6) return '';

    const yy = clean.slice(0, 2);
    const mm = clean.slice(2, 4);
    const dd = clean.slice(4, 6);

    const currentYear = new Date().getFullYear() % 100;
    const fullYear = parseInt(yy, 10) > currentYear ? `19${yy}` : `20${yy}`;

    if (parseInt(mm, 10) < 1 || parseInt(mm, 10) > 12) return '';
    if (parseInt(dd, 10) < 1 || parseInt(dd, 10) > 31) return '';

    return `${fullYear}-${mm}-${dd}`;
  };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setProfile({
          name: res.data.name,
          email: res.data.email,
          usertype: res.data.usertype || '',
          gender: res.data.profile?.gender || '',
          date_of_birth: res.data.profile?.date_of_birth || '',
          nric: res.data.profile?.nric || '',
          phone_number: res.data.phone_number || '',
          address: res.data.profile?.address || '',
          profile_image: null,
        });

        if (res.data.profile?.profile_image) {
          setImagePreview(`${process.env.REACT_APP_API_URL}/storage/${res.data.profile.profile_image}`);
        } else {
          setImagePreview(DEFAULT_AVATAR);
        }
      })
      .catch(err => {
        console.error(err);
        setImagePreview(DEFAULT_AVATAR);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      setProfile(prev => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
      return;
    }

    if (name === 'nric') {
      let digits = value.replace(/\D/g, '');
      if (digits.length > 12) digits = digits.slice(0, 12);

      let formatted = digits;
      if (digits.length > 6 && digits.length <= 8) {
        formatted = `${digits.slice(0, 6)}-${digits.slice(6)}`;
      } else if (digits.length > 8) {
        formatted = `${digits.slice(0, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
      }

      const dobFromNric = parseDobFromNric(formatted);

      setProfile(prev => ({
        ...prev,
        nric: formatted,
        date_of_birth: dobFromNric || prev.date_of_birth,
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const formData = new FormData();
    formData.append('email', profile.email);
    formData.append('nric', profile.nric);
    formData.append('gender', profile.gender);
    formData.append('date_of_birth', profile.date_of_birth);
    formData.append('address', profile.address);
    formData.append('phone_number', profile.phone_number);
    if (profile.profile_image) {
      formData.append('profile_image', profile.profile_image);
    }

    axios.post('http://127.0.0.1:8000/api/user/profile', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
        setEditMode(false);
      })
      .catch(err => {
        let msg = 'Update failed';
        if (err.response) msg += ': ' + JSON.stringify(err.response.data);
        else msg += ': ' + err.message;
        setStatusMessage({ type: 'error', text: msg });
      });
  };

  return (
    <div className="profile-page">
      <div className="profile-left">
        <div className="profile-avatar">
          <img src={imagePreview || DEFAULT_AVATAR} alt="Profile" />
        </div>

        <h2>{profile.name}</h2>

        {!editMode && (
          <button onClick={() => { setEditMode(true); setStatusMessage(null); }} className="edit-btn">
            Edit Profile
          </button>
        )}
      </div>

      <div className="profile-right">
        <h2 className="section-title">Personal Details</h2>

        {statusMessage && (
          <div
            className={`status-message ${statusMessage.type === 'success' ? 'success' : 'error'}`}
            style={{ marginBottom: '10px' }}
          >
            {statusMessage.text}
          </div>
        )}

        {!editMode ? (
          <div className="profile-view">
            <p><strong>Full Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Type:</strong> {profile.usertype}</p>
            <p><strong>Date of Birth:</strong> {formatDate(profile.date_of_birth)}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>NRIC:</strong> {profile.nric}</p>
            <p><strong>Phone Number:</strong> {profile.phone_number}</p>
            <p><strong>Address:</strong> {profile.address}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-grid">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>NRIC</label>
                <input
                  type="text"
                  name="nric"
                  value={profile.nric}
                  onChange={handleChange}
                  maxLength={14}
                  placeholder="xxxxxx-xx-xxxx"
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={profile.date_of_birth}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  value={profile.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                 
                ></textarea>
              </div>
              <div className="full-width">
                <label>Profile Image</label>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="update-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => { setEditMode(false); setStatusMessage(null); }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
