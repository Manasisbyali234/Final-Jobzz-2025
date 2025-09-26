
import { NavLink } from "react-router-dom";
import { publicUser } from "../../../../../../globals/route-names";
import SectionSideAdvert from "./section-side-advert";
import { useState, useEffect } from "react";
import "../../../../../../custom-tags.css";

function SectionJobsSidebar1 ({ onFilterChange }) {
    const [jobTypes, setJobTypes] = useState([]);
    const [jobTitles, setJobTitles] = useState([]);
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        jobType: [],
        employmentType: '',
        jobTitle: '',
        skills: [],
        category: ''
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
        fetchLocations();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/jobs');
            const data = await response.json();
            if (data.success) {
                const categoryCounts = {};
                data.jobs.forEach(job => {
                    if (job.category) {
                        categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
                    }
                });
                setCategories(Object.entries(categoryCounts));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchLocations = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/public/jobs');
            const data = await response.json();
            if (data.success) {
                const dbLocations = [...new Set(data.jobs.map(job => job.location))].filter(location => location).sort();
                setLocations(dbLocations);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setFilters({...filters, location: value});
        setShowLocationSuggestions(value.length > 0);
    };

    const selectLocation = (location) => {
        setFilters({...filters, location});
        setShowLocationSuggestions(false);
    };

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
                const allKeywords = new Set();
                
                data.jobs.forEach(job => {
                    if (job.title) allKeywords.add(job.title);
                    if (job.requiredSkills && Array.isArray(job.requiredSkills)) {
                        job.requiredSkills.forEach(skill => allKeywords.add(skill));
                    }
                    if (job.description) {
                        const techWords = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'Laravel', 'Django', 'Spring', 'MongoDB', 'MySQL', 'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'Bootstrap', 'jQuery', 'Express', 'API', 'REST', 'GraphQL', 'Redux', 'DevOps', 'Linux', 'Windows', 'iOS', 'Android', 'Flutter', 'React Native', 'Swift', 'Kotlin', 'C++', 'C#', '.NET', 'Ruby', 'Rails', 'Golang', 'Rust', 'Scala', 'Jenkins', 'CI/CD', 'Agile', 'Scrum', 'Jira', 'Figma', 'Photoshop', 'Illustrator', 'Unity', 'Salesforce', 'Tableau', 'Power BI', 'Excel', 'Machine Learning', 'AI', 'Data Science', 'Big Data', 'Cloud', 'Cybersecurity', 'Blockchain', 'UI', 'UX', 'Frontend', 'Backend', 'Full Stack', 'Mobile', 'Web', 'Database', 'Testing', 'QA', 'Automation'];
                        techWords.forEach(word => {
                            if (job.description.toLowerCase().includes(word.toLowerCase())) {
                                allKeywords.add(word);
                            }
                        });
                    }
                });
                
                setJobTitles(Array.from(allKeywords).sort());
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

                        <div className="form-group mb-4 position-relative">
                            <h4 className="section-head-small mb-4">Location ({locations.length} available)</h4>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search location" 
                                    value={filters.location}
                                    onChange={handleLocationChange}
                                    onFocus={() => setShowLocationSuggestions(filters.location.length > 0)}
                                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                                />
                                <button className="btn" type="button"><i className="feather-map-pin" /></button>
                            </div>
                            {showLocationSuggestions && (
                                <div className="position-absolute w-100 bg-white border rounded shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                                    {locations
                                        .filter(location => location.toLowerCase().includes(filters.location.toLowerCase()))
                                        .slice(0, 10)
                                        .map((location, index) => (
                                            <div 
                                                key={index} 
                                                className="p-2 border-bottom cursor-pointer hover-bg-light"
                                                onClick={() => selectLocation(location)}
                                                style={{cursor: 'pointer'}}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                            >
                                                <i className="feather-map-pin me-2"></i>{location}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
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
                                            id="AllEmployment" 
                                            name="employmentType"
                                            value=""
                                            checked={filters.employmentType === ''}
                                            onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                                        />
                                        <label className="form-check-label" htmlFor="AllEmployment">All Types</label>
                                    </div>
                                </li>
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
                        
                        <div className="twm-sidebar-ele-filter">
                            <h4 className="section-head-small mb-4">Job Category</h4>
                            <ul>
                                {categories.map(([category, count], index) => (
                                    <li key={category}>
                                        <div className="form-check">
                                            <input 
                                                type="radio" 
                                                className="form-check-input" 
                                                id={`category${index}`}
                                                name="category"
                                                value={category}
                                                checked={filters.category === category}
                                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                                            />
                                            <label className="form-check-label" htmlFor={`category${index}`}>
                                                {category}
                                            </label>
                                        </div>
                                        <span className="twm-job-type-count">{count}</span>
                                    </li>
                                ))}
                                <li>
                                    <div className="form-check">
                                        <input 
                                            type="radio" 
                                            className="form-check-input" 
                                            id="categoryAll"
                                            name="category"
                                            value=""
                                            checked={filters.category === ''}
                                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                                        />
                                        <label className="form-check-label" htmlFor="categoryAll">
                                            All Categories
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="form-group mb-4">
                            <h4 className="section-head-small mb-4">Job Title ({jobTitles.length} available)</h4>
                            <select 
                                className="form-control" 
                                value={filters.jobTitle}
                                onChange={(e) => setFilters({...filters, jobTitle: e.target.value})}
                            >
                                <option value="">All Job Titles</option>
                                {jobTitles.map((title, index) => (
                                    <option key={index} value={title}>{title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group mt-4">
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm w-100"
                                onClick={() => {
                                    setFilters({
                                        keyword: '',
                                        location: '',
                                        jobType: [],
                                        employmentType: '',
                                        jobTitle: '',
                                        skills: [],
                                        category: ''
                                    });
                                    setShowLocationSuggestions(false);
                                }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </form>
                </div>
                
                <div className="widget tw-sidebar-tags-wrap">
                    <h4 className="section-head-small mb-4">Tags</h4>
                    <div className="tagcloud">
                        {['General', 'Jobs', 'Payment', 'Application', 'Work', 'Recruiting', 'Employer', 'Income', 'Tips'].map(tag => (
                            <a 
                                key={tag}
                                href="#" 
                                className={`tag-link ${filters.keyword === tag ? 'active' : ''}`}
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    if (filters.keyword === tag) {
                                        // If clicking the same tag, clear the filter
                                        setFilters({...filters, keyword: ''});
                                    } else {
                                        // Set the new tag filter
                                        setFilters({...filters, keyword: tag});
                                    }
                                }}
                                style={{
                                    backgroundColor: filters.keyword === tag ? '#1967d2' : '',
                                    color: filters.keyword === tag ? 'white' : '',
                                    fontWeight: filters.keyword === tag ? 'bold' : 'normal'
                                }}
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            {/* <SectionSideAdvert />    */}
        </>
    )
}

export default SectionJobsSidebar1;