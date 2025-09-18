import React, { useState } from 'react';
import './HeroBody.css';
import { FaBriefcase, FaCalculator, FaCode, FaUsers } from 'react-icons/fa';

const HeroBody = () => {
  const [searchData, setSearchData] = useState({
    what: 'Job Title',
    type: 'All Category',
    location: 'Search...'
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
    console.log('Searching with:', searchData);
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
              <option value="Job Title">Job Title</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
            </select>
          </div>
          
          <div className="search-field">
            <label className="search-label">TYPE</label>
            <select 
              className="search-select"
              value={searchData.type}
              onChange={(e) => setSearchData({...searchData, type: e.target.value})}
            >
              <option value="All Category">All Category</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
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
                <option value="Search...">Search...</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
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