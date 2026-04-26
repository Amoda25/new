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
        moduleName: "",
        moduleId: "",
        lecturerId: "",
        email: "",
        phoneNumber: "",
        currentResidentialAddress: "",
        permanentHomeAddress: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [userRole, setUserRole] = useState(localStorage.getItem("role") || "USER");

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

            // Add password only if provided and valid
            const updateData = { ...currentProfile };
            if (profile.newPassword) {
                if (profile.newPassword !== profile.confirmPassword) {
                    setMessage({ type: "error", text: "Passwords do not match!" });
                    setSaving(false);
                    return;
                }
                if (profile.newPassword.length < 6) {
                    setMessage({ type: "error", text: "Password must be at least 6 characters long!" });
                    setSaving(false);
                    return;
                }
                updateData.password = profile.newPassword;
            }

            const updatedData = await updateUserProfile(updateData);
            setProfile({
                ...updatedData,
                newPassword: "",
                confirmPassword: ""
            });
            setSelectedFile(null); // Clear selected file after success
            setMessage({ type: "success", text: "Profile updated successfully!" });
            setTimeout(() => setMessage({ type: "", text: "" }), 5000);
        } catch (err) {
            console.error("Profile update error caught:", err);
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

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http")) return path;
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
        return `${baseUrl}${path}`;
    };

    if (loading) return <div className="profile-page-container"><div className="loading-skeleton"></div></div>;

    return (
        <div className="profile-page-container">
            <div className="profile-glass-card">
                <div className="profile-header">
                    <div className="header-left">
                        <div className="avatar-wrapper">
                            <img 
                                src={previewUrl || getImageUrl(profile.profilePictureUrl) || "https://ui-avatars.com/api/?name=" + (profile.fullLegalName || "User") + "&background=00d4ff&color=fff"} 
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

                        {/* Academic Details - Conditional based on role */}
                        {(userRole === "USER" || userRole === "LECTURER") && (
                            <div className="section-group">
                                <h2>Academic Information</h2>
                                <div className="form-grid">
                                    {userRole === "LECTURER" ? (
                                        <>
                                            <div className="form-field">
                                                <label>Lecture Registration Number / ID</label>
                                                <input type="text" name="lecturerId" value={profile.lecturerId || ""} onChange={handleChange} placeholder="e.g. LIDxxxxxxxx" />
                                            </div>
                                            <div className="form-field">
                                                <label>Module Name</label>
                                                <input type="text" name="moduleName" value={profile.moduleName || ""} onChange={handleChange} placeholder="e.g. Software Engineering" />
                                            </div>
                                            <div className="form-field full-width">
                                                <label>Module ID</label>
                                                <input type="text" name="moduleId" value={profile.moduleId || ""} onChange={handleChange} placeholder="e.g. IT2020" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-field">
                                                <label>Student Registration Number / ID</label>
                                                <input type="text" name="studentId" value={profile.studentId || ""} onChange={handleChange} placeholder="e.g. ITxxxxxxx" />
                                            </div>
                                            <div className="form-field">
                                                <label>Degree Program / Major</label>
                                                <select name="degreeProgram" value={profile.degreeProgram || ""} onChange={handleChange}>
                                                    <option value="">Select Degree Program</option>
                                                    <option value="Information Technology">Information Technology</option>
                                                    <option value="Software Engineering">Software Engineering</option>
                                                    <option value="Cyber Security">Cyber Security</option>
                                                    <option value="Data Science">Data Science</option>
                                                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                                                    <option value="Interactive Media">Interactive Media</option>
                                                    <option value="Information Systems Engineering">Information Systems Engineering</option>
                                                    <option value="Computer Systems & Network Engineering">Computer Systems & Network Engineering</option>
                                                </select>
                                            </div>
                                            <div className="form-field">
                                                <label>Current Year and Semester</label>
                                                <select name="currentYearSemester" value={profile.currentYearSemester || ""} onChange={handleChange}>
                                                    <option value="">Select Year & Semester</option>
                                                    <option value="Year 1, Semester 1">Year 1, Semester 1</option>
                                                    <option value="Year 1, Semester 2">Year 1, Semester 2</option>
                                                    <option value="Year 2, Semester 1">Year 2, Semester 1</option>
                                                    <option value="Year 2, Semester 2">Year 2, Semester 2</option>
                                                    <option value="Year 3, Semester 1">Year 3, Semester 1</option>
                                                    <option value="Year 3, Semester 2">Year 3, Semester 2</option>
                                                    <option value="Year 4, Semester 1">Year 4, Semester 1</option>
                                                    <option value="Year 4, Semester 2">Year 4, Semester 2</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contact Details */}
                        <div className="section-group">
                            <h2>Contact Details</h2>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>Email Address</label>
                                    <input type="email" value={profile.email || ""} disabled className="disabled-input" />
                                    <small>Email cannot be changed</small>
                                </div>
                                <div className="form-field">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phoneNumber" value={profile.phoneNumber || ""} onChange={handleChange} placeholder="+94 ..." />
                                </div>
                                <div className="form-field">
                                    <label>Current Residential Address</label>
                                    <textarea name="currentResidentialAddress" value={profile.currentResidentialAddress || ""} onChange={handleChange} rows="2"></textarea>
                                </div>
                                <div className="form-field">
                                    <label>Permanent Home Address</label>
                                    <textarea name="permanentHomeAddress" value={profile.permanentHomeAddress || ""} onChange={handleChange} rows="2"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="section-group">
                            <h2>Security</h2>
                            <p className="section-subtitle">Leave blank if you don't want to change your password</p>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label>New Password</label>
                                    <input 
                                        type="password" 
                                        name="newPassword" 
                                        value={profile.newPassword || ""} 
                                        onChange={handleChange} 
                                        placeholder="Enter new password" 
                                    />
                                </div>
                                <div className="form-field">
                                    <label>Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        name="confirmPassword" 
                                        value={profile.confirmPassword || ""} 
                                        onChange={handleChange} 
                                        placeholder="Confirm new password" 
                                    />
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
