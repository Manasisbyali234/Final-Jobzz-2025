import { useEffect, useState } from "react";
import { MapPin } from 'lucide-react';
import { loadScript } from "../../../../globals/constants";
import SectionCandidateOverview from "../sections/dashboard/section-can-overview";
import CompleteProfileCard from "../sections/dashboard/section-can-profile";
import SectionNotifications from "../sections/dashboard/section-notifications";
import './can-dashboard.css';

function CanDashboardPage() {
  const [candidate, setCandidate] = useState({ name: 'Loading...', location: 'Bangalore' });

  useEffect(() => {
    loadScript("js/custom.js");
    fetchCandidateData();
  }, []);

  const fetchCandidateData = async () => {
    try {
      const token = localStorage.getItem('candidateToken');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/candidate/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          setCandidate({
            name: data.profile.name || 'Candidate',
            location: data.profile.location || 'Bangalore'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching candidate data:', error);
    }
  };

  return (
    <>
      <div className="twm-right-section-panel site-bg-gray can-dashboard">
        {/* Header */}
        <div className="wt-admin-right-page-header clearfix" style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: '0 0 0.25rem 0' }}>Welcome back, {candidate.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <MapPin size={16} style={{ color: '#f97316' }} />
                <span style={{ color: '#f97316', fontSize: '0.875rem', fontWeight: '500' }}>{candidate.location}</span>
              </div>
              <p style={{ color: '#6b7280', margin: 0 }}>Here's an overview of your job applications and profile</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ padding: '2rem' }}>
          <SectionCandidateOverview />

          {/* Profile Completion and Notifications */}
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-md-12 mb-4">
              <CompleteProfileCard />
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 mb-4">
              <SectionNotifications />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CanDashboardPage;