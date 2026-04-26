import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile, deleteUserAccount, uploadProfilePicture } from "../../services/userService";
import "./ProfilePage.css";

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        fullLegalName: "",
        dateOfBirth: "",
        profilePictureUrl: "",
        studentId: "",
        degreeProgram: "",
        currentYearSemester: "",
        email: "",
        phoneNumber: "",
        currentResidentialAddress: "",
        permanentHomeAddress: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setProfile(data);
            } catch (err) {
                console.error("Profile fetch error:", err);
                setMessage({ type: "error", text: "Unable to load profile data." });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            let currentProfile = { ...profile };

            // Upload image if selected
            if (selectedFile) {
                const uploadedUrl = await uploadProfilePicture(selectedFile);
                currentProfile.profilePictureUrl = uploadedUrl;
            }

            const updatedData = await updateUserProfile(currentProfile);
            setProfile(updatedData);
            setSelectedFile(null); // Clear selected file after success
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (err) {
            console.error("Profile update error:", err);
            setMessage({ type: "error", text: "Failed to save profile changes." });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("ARE YOU SURE? This will permanently delete your account.")) {
            try {
                await deleteUserAccount();
                localStorage.clear();
                window.location.href = "/login";
            } catch (err) {
                setMessage({ type: "error", text: "Failed to delete account." });
            }
        }
    };

    if (loading) return <div className="profile-container"><div className="loading-skeleton"></div></div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="header-left">
                        <div className="avatar-wrapper">
                            <img 
                                src={previewUrl || profile.profilePictureUrl || "https://ui-avatars.com/api/?name=" + (profile.fullLegalName || "User") + "&background=00d4ff&color=fff"} 
                                alt="Profile" 
                                className="profile-avatar"
                            />
                            <label className="upload-overlay">
                                <span>📷</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                        <div className="user-meta">
                            <h1>{profile.fullLegalName || "My Profile"}</h1>
                            <p className="user-email-header">{profile.email}</p>
                        </div>
                    </div>
                    <button className="delete-account-btn" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </div>

                <div className="profile-body">
                    {message.text && (
                        <div className={`alert alert-${message.type}`}>
                            {message.type === "error" ? "⚠️" : "✨"} {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Personal Info */}
                        <div className="section-group">
                            <h2>Personal Details</h2>
                            <div className="form-grid">

                                <div className="form-field">
                                    <label>Full Name</label>
                                    <input type="text" name="fullLegalName" value={profile.fullLegalName || ""} onChange={handleChange} placeholder="Enter your full name" />
                                </div>
                                <div className="form-field">
                                    <label>Date of Birth</label>
                                    <input type="date" name="dateOfBirth" value={profile.dateOfBirth || ""} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Academic Details */}
                        <div className="section-group">
                            <h2>Academic Information</h2>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Student Registration Number / ID</label>
                                    <input type="text" name="studentId" value={profile.studentId || ""} onChange={handleChange} placeholder="e.g. IT23605152" />
                                </div>
                                <div className="form-field">
                                    <label>Degree Program / Major</label>
                                    <input type="text" name="degreeProgram" value={profile.degreeProgram || ""} onChange={handleChange} placeholder="Your Major" />
                                </div>
                                <div className="form-field">
                                    <label>Current Year and Semester</label>
                                    <input type="text" name="currentYearSemester" value={profile.currentYearSemester || ""} onChange={handleChange} placeholder="e.g. Year 2 Sem 1" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="section-group">
                            <h2>Contact Details</h2>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Email Address</label>
                                    <input type="email" value={profile.email || ""} disabled className="disabled-input" />
                                </div>
                                <div className="form-field">
                                    <label>Phone Number</label>
                                    <input type="text" name="phoneNumber" value={profile.phoneNumber || ""} onChange={handleChange} placeholder="+94 ..." />
                                </div>
                                <div className="form-field">
                                    <label>Current Residential Address</label>
                                    <input type="text" name="currentResidentialAddress" value={profile.currentResidentialAddress || ""} onChange={handleChange} placeholder="Hostel, dorm, or local apartment" />
                                </div>
                                <div className="form-field">
                                    <label>Permanent Home Address</label>
                                    <input type="text" name="permanentHomeAddress" value={profile.permanentHomeAddress || ""} onChange={handleChange} placeholder="Permanent address" />
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="save-profile-btn" disabled={saving}>
                                {saving ? "Saving..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
