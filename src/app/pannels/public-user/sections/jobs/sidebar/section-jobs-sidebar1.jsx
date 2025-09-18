
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../../globals/route-names";
import SectionSideAdvert from "./section-side-advert";
import { useState, useEffect } from "react";

function SectionJobsSidebar1 ({ onFilterChange }) {
    const [jobTypes, setJobTypes] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        jobType: [],
        employmentType: '',
        jobTitle: '',
        skills: []
    });

    const skillCategories = [
        'Developer',
        'Python',
        'React',
        'JavaScript',
        'Node.js',
        'Java',
        'Tester',
        'QA Engineer',
        'DevOps',
        'UI/UX Designer',
        'Data Analyst',
        'Machine Learning',
        'Angular',
        'Vue.js',
        'PHP',
        'C++',
        '.NET',
        'Mobile Developer',
        'Flutter',
        'React Native'
    ];

    useEffect(() => {
        fetchJobTypes();
        fetchJobTitles();
    }, []);

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange(filters);
        }
    }, [filters, onFilterChange]);

    const fetchJobTypes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/jobs');
            const data = await response.json();
            if (data.success) {
                // Count job types
                const typeCounts = {};
                data.jobs.forEach(job => {
                    const type = job.jobType;
                    typeCounts[type] = (typeCounts[type] || 0) + 1;
                });
                setJobTypes(Object.entries(typeCounts));
            }
        } catch (error) {
            console.error('Error fetching job types:', error);
        }
    };

    const fetchJobTitles = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/jobs');
            const data = await response.json();
            if (data.success) {
                // Get unique job titles
                const titles = [...new Set(data.jobs.map(job => job.title))];
                setJobTitles(titles);
            }
        } catch (error) {
            console.error('Error fetching job titles:', error);
        }
    };

    return (
        <>
            <div className="side-bar">
                <div className="sidebar-elements search-bx">
                    <form>
                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Job Title</h4>
                            <select 
                                className="wt-select-bar-large selectpicker" 
                                data-live-search="true" 
                                data-bv-field="size"
                                value={filters.jobTitle}
                                onChange={(e) => setFilters({...filters, jobTitle: e.target.value})}
                            >
                                <option value="">All Category</option>
                                {jobTitles.map((title, index) => (
                                    <option key={index} value={title}>{title}</option>
                                ))}
                            </select>
                        </div>


                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Keyword</h4>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Job title or Keyword" 
                                    value={filters.keyword}
                                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                                />
                                <button className="btn" type="button"><i className="feather-search" /></button>
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Location</h4>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search location" 
                                    value={filters.location}
                                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                                />
                                <button className="btn" type="button"><i className="feather-map-pin" /></button>
                            </div>
                        </div>

                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Job Type</h4>
                            <ul>
                                {jobTypes.map(([type, count], index) => (
                                    <li key={type}>
                                        <div className=" form-check">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input" 
                                                id={`jobType${index}`}
                                                checked={filters.jobType.includes(type)}
                                                onChange={(e) => {
                                                    const newJobTypes = e.target.checked 
                                                        ? [...filters.jobType, type]
                                                        : filters.jobType.filter(t => t !== type);
                                                    setFilters({...filters, jobType: newJobTypes});
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`jobType${index}`}>
                                                {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                                            </label>
                                        </div>
                                        <span className="twm-job-type-count">{count}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Skills & Technologies</h4>
                            <ul style={{maxHeight: '300px', overflowY: 'auto'}}>
                                {skillCategories.map((skill, index) => (
                                    <li key={skill}>
                                        <div className="form-check">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input" 
                                                id={`skill${index}`}
                                                checked={filters.skills.includes(skill)}
                                                onChange={(e) => {
                                                    const newSkills = e.target.checked 
                                                        ? [...filters.skills, skill]
                                                        : filters.skills.filter(s => s !== skill);
                                                    setFilters({...filters, skills: newSkills});
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor={`skill${index}`}>
                                                {skill}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Type of employment</h4>
                            <ul>
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="Freelance1" 
                                            name="employmentType"
                                            value="freelance"
                                            checked={filters.employmentType === 'freelance'}
                                            onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                                        />
                                        <label className="form-check-label" htmlFor="Freelance1">Freelance</label>
                                    </div>
                                </li>

                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="FullTime1" 
                                            name="employmentType"
                                            value="full-time"
                                            checked={filters.employmentType === 'full-time'}
                                            onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                                        />
                                        <label className="form-check-label" htmlFor="FullTime1">Full Time</label>
                                    </div>
                                </li>

                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="Intership1" 
                                            name="employmentType"
                                            value="internship"
                                            checked={filters.employmentType === 'internship'}
                                            onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                                        />
                                        <label className="form-check-label" htmlFor="Intership1">Internship</label>
                                    </div>
                                </li>

                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="Part-Time1" 
                                            name="employmentType"
                                            value="part-time"
                                            checked={filters.employmentType === 'part-time'}
                                            onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                                        />
                                        <label className="form-check-label" htmlFor="Part-Time1">Part Time</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="form-group mt-4">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm w-100"
                                onClick={() => setFilters({
                                    keyword: '',
                                    location: '',
                                    jobType: [],
                                    employmentType: '',
                                    jobTitle: '',
                                    skills: []
                                })}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="widget tw-sidebar-tags-wrap">
                    <h4 className="section-head-small mb-4">Tags</h4>
                    <div className="tagcloud">
                        <NavLink to={publicUser.jobs.LIST}>General</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Jobs </NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Payment</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Application </NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Work</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Recruiting</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Employer</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Income</NavLink>
                        <NavLink to={publicUser.jobs.LIST}>Tips</NavLink>
                    </div>
                </div>
            </div>
            {/* <SectionSideAdvert />    */}
        </>
    )
}

export default SectionJobsSidebar1;