import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroBody.css';
import { FaBriefcase, FaCalculator, FaCode, FaUsers } from 'react-icons/fa';

const HeroBody = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    what: '',
    type: '',
    location: ''
  });

  const jobCategories = [
    { icon: FaBriefcase, name: 'Management', jobs: 70 },
    { icon: FaCalculator, name: 'Accountant', jobs: 65 },
    { icon: FaCode, name: 'Software', jobs: 55 },
    { icon: FaCode, name: 'Software', jobs: 65 },
    { icon: FaUsers, name: 'Human Resource', jobs: 45 },
    { icon: FaBriefcase, name: 'Management', jobs: 70 },
    { icon: FaCalculator, name: 'Accountant', jobs: 65 }
  ];

  const handleSearch = () => {
    const filters = {};
    if (searchData.what && searchData.what !== '') filters.search = searchData.what;
    if (searchData.type && searchData.type !== '') filters.jobType = searchData.type;
    if (searchData.location && searchData.location !== '') filters.location = searchData.location;
    
    console.log('Search filters:', filters);
    
    // Navigate to job grid page with filters
    const queryString = Object.keys(filters)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
      .join('&');
    
    navigate(`/job-grid${queryString ? '?' + queryString : ''}`);
  };

  return (
    <div className="hero-body">
      {/* Hero Section */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Find the <span className="highlight">job</span> that fits<br />
            your life
          </h1>
          <p className="hero-subtitle">
            Type your keyword, then click search to find your perfect job.
          </p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-field">
            <label className="search-label">WHAT</label>
            <select 
              className="search-select"
              value={searchData.what}
              onChange={(e) => setSearchData({...searchData, what: e.target.value})}
            >
              <option value="">Job Title</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Web Developer">Web Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Business Analyst">Business Analyst</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Sales Executive">Sales Executive</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Accountant">Accountant</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>
          
          <div className="search-field">
            <label className="search-label">TYPE</label>
            <select 
              className="search-select"
              value={searchData.type}
              onChange={(e) => setSearchData({...searchData, type: e.target.value})}
            >
              <option value="">All Category</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
              <option value="Remote">Remote</option>
              <option value="Work From Home">Work From Home</option>
            </select>
          </div>
          
          <div className="search-field location-field">
            <label className="search-label">LOCATION</label>
            <div className="location-input">
              <svg className="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 10C21 17L12 23L3 10C3 6.13401 7.13401 2 12 2C16.866 2 21 6.13401 21 10Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <select 
                className="search-select location-select"
                value={searchData.location}
                onChange={(e) => setSearchData({...searchData, location: e.target.value})}
              >
                <option value="">Search...</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
          
          <button className="search-btn" onClick={handleSearch}>
            Find Job
          </button>
        </div>

        {/* Job Categories */}
        <div className="categories-container">
          <div className="categories-scroll">
            {jobCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon small">
                  {category.icon ? <category.icon size={16} /> : null}
                </div>
                <div className="category-info">
                  <span className="category-jobs">{category.jobs} Jobs</span>
                  <h3 className="category-name">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBody;