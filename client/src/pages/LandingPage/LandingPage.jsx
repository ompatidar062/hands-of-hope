import React, { useState } from "react";
import "./LandingPage.css";
import LandingPageAboutUs from "../../assets/LandingPageAboutUs.jpg"
import { FaHandHoldingMedical, FaGraduationCap, FaUsers, FaDonate } from "react-icons/fa";


const LandingPage = () => {
    const modules = [
        {
          id: 1,
          title: "Healthcare Assistance",
          description:
            "Find & manage immunization programs, blood donations, and medical supplies.",
          icon: <FaHandHoldingMedical />,
          colorClass: "healthcare",
          features: [
            "Vaccination Programs → Find & manage immunization campaigns.",
            "Blood Management → Register as a donor or request emergency blood.",
            "Medical Supplies → Track and distribute medicines & equipment.",
          ],
          bestFor: "Patients, NGOs, healthcare volunteers.",
        },
        {
          id: 2,
          title: "Education & Skill Development",
          description:
            "Get access to free education, skill-building programs, and mentoring.",
          icon: <FaGraduationCap />,
          colorClass: "education",
          features: [
            "Tutoring & Mentoring → Get academic guidance from experts.",
            "Content Creation → Access or contribute online learning materials.",
            "Progress Tracking → Monitor learning progress with feedback.",
            "Providing Access → Enroll in free or subsidized courses.",
          ],
          bestFor: "Students, teachers, NGOs in education, skill trainers.",
        },
        {
          id: 3,
          title: "Volunteer Management",
          description: "Join as a healthcare or education volunteer to make an impact.",
          icon: <FaUsers />,
          colorClass: "volunteers",
          features: [
            "Healthcare Volunteers → Conduct surveys, screenings & assist camps.",
            "Education Volunteers → Conduct surveys, record data & gather feedback.",
          ],
          bestFor: "Anyone wanting to volunteer in healthcare or education.",
        },
        {
          id: 4,
          title: "Donor Management",
          description: "Register as a donor & track contributions securely.",
          icon: <FaDonate />,
          colorClass: "donors",
          features: [
            "Donor Registration → Sign up as a donor & track contributions.",
            "Donor Database → NGOs can maintain donation history & preferences.",
            "Monetary Contributions → Secure payment integration for donations.",
          ],
          bestFor: "Individuals & organizations willing to donate.",
        },
      ];


      const faqs = [
        {
          category: "General Questions",
          questions: [
            { q: "What is Hands of Hope, and how does it work?", a: "Hands of Hope is an initiative providing healthcare, education, and skill development to underserved communities." },
            { q: "Who can use this platform?", a: "Anyone in need of healthcare, education, or skill-building resources can access it." },
            { q: "Is Hands of Hope free to use?", a: "Yes, our services are completely free for those in need." },
            { q: "How do I sign up and get started?", a: "You can sign up on our website by filling in the required details on the registration page." }
          ],
        },
        {
          category: "Healthcare Assistance",
          questions: [
            { q: "What healthcare services does Hands of Hope provide?", a: "We offer vaccination programs, blood management, and medical supply distribution." },
            { q: "How can I request medical assistance?", a: "You can apply through the healthcare section on our platform." },
            { q: "How do I request blood in case of an emergency?", a: "Go to the blood management section and submit a request." },
            { q: "Can I volunteer for healthcare activities?", a: "Yes, sign up as a volunteer and choose healthcare-related tasks." }
          ],
        },
        {
          category: "Education & Skill Development",
          questions: [
            { q: "What kind of educational resources are available?", a: "We provide online courses, mentoring, and progress tracking tools." },
            { q: "Are the courses free to access?", a: "Yes, all our courses are free for eligible users." },
            { q: "Can I track my learning progress?", a: "Yes, our platform allows you to monitor your progress and achievements." },
            { q: "How can I become a tutor or mentor?", a: "You can apply through the volunteer section to become a tutor or mentor." }
          ],
        },
        {
          category: "Volunteering",
          questions: [
            { q: "How can I become a volunteer?", a: "Sign up through the volunteer section and choose a role." },
            { q: "What roles can volunteers take up?", a: "We have roles in healthcare surveys, education support, and outreach programs." },
            { q: "Will I receive a certificate for volunteering?", a: "Yes, active volunteers receive a certificate for their contributions." }
          ],
        },
        {
          category: "Donations & Fundraising",
          questions: [
            { q: "How can I donate to support the cause?", a: "You can donate via our platform using secure payment methods." },
            { q: "What payment methods are supported?", a: "We support credit/debit cards, bank transfers, and digital wallets." },
            { q: "How is my donation used?", a: "Donations help fund healthcare, education, and skill development initiatives." }
          ],
        }
      ];

      
      const [openIndex, setOpenIndex] = useState(null);

      const toggleFAQ = (index) => {
        setOpenIndex((prev) => (prev === index ? null : index));
      };


      const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // Here, you can add form submission logic (API integration)
      };
      
  return (
    <>
      {/* Hero Section */}
        <section className="hero">
            <div className="hero-content">
            <h1>Empowering Communities Through Healthcare, Education, and Skills</h1>
            <p>
                Join us in making a difference by providing essential services to those in need.
            </p>
            <div className="hero-buttons">
                <button className="btn primary-btn">Get Started</button>
                <button className="btn secondary-btn">Learn More</button>
            </div>
            </div>
        </section>

        <section className="about-us">
    <div className="about-container">
        {/* Left Side - Text Content */}
        <div className="about-content">
            <h2>About Hands of Hope</h2>
            <p>
            Hands of Hope is committed to transforming lives by providing essential 
            healthcare, education, and skill development opportunities to underserved 
            communities. Our platform enables NGOs to efficiently manage medical 
            initiatives, organize educational programs, and streamline donation 
            processes—ensuring resources reach those who need them the most.
            </p>
        </div>
        
        {/* Right Side - Image */}
        <div className="about-image">
            <img src={LandingPageAboutUs} alt="Hands of Hope NGO" />
        </div>
    </div>

    {/* Vision & Mission - Wrapped in a Container */}
    <div className="vision-mission-container">
        <div className="vision-mission">
            <h3>Our Vision</h3>
            <p>
                To create a world where <strong>everyone has access to quality healthcare, 
                education, and skill development opportunities</strong>.
            </p>

            <hr className="separator" /> {/* Subtle Line Separator */}

            <h3>Our Mission</h3>
            <p>
                <strong>Providing free healthcare services</strong> through medical camps and blood donation drives.<br />
                <strong>Empowering individuals</strong> with education and skill development resources.<br />
                <strong>Connecting volunteers and donors</strong> to maximize community impact.
            </p>
        </div>
    </div>
</section>

<section className="core-modules">
  <h2>Core Modules Overview</h2>
  <p>Explore the key modules that make Hands of Hope a powerful solution.</p>

  <div className="modules-grid">
    {modules.map((module) => (
      <div key={module.id} className={`module-card ${module.colorClass}`}>
        <div className="module-icon" aria-label={`${module.title} Icon`}>
          {module.icon}
        </div>
        <h3>{module.title}</h3>
        <p className="module-description">{module.description}</p>

        {/* Features List */}
        <ul className="module-features">
          {module.features.map((feature, index) => (
            <li key={index}>
              <span className="feature-icon">✔️</span> {feature}
            </li>
          ))}
        </ul>

        {/* Best For */}
        <p className="best-for">
          <strong>Best for:</strong> {module.bestFor}
        </p>

        {/* CTA Button (Aligned & Accessible) */}
        <button className="cta-button" aria-label={`Explore ${module.title}`}>
          Explore {module.title}
        </button>
      </div>
    ))}
  </div>
</section>


<section className="faq-section">
  <h2>Frequently Asked Questions</h2>
  <p>Find answers to common questions about Hands of Hope.</p>
  <div className="faq-grid">
    {faqs.map((category, catIndex) => (
      <div key={catIndex} className="faq-category" role="region" aria-labelledby={`faq-category-${catIndex}`}>
        <h3 id={`faq-category-${catIndex}`}>{category.category}</h3>
        {category.questions.map((item, qIndex) => {
          const isOpen = openIndex === `${catIndex}-${qIndex}`;
          return (
            <div key={qIndex} className="faq-item">
              <button
                className="faq-question"
                onClick={() => toggleFAQ(`${catIndex}-${qIndex}`)}
                aria-expanded={isOpen}
              >
                {item.q} <span>{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && <p className="faq-answer">{item.a}</p>}
            </div>
          );
        })}
      </div>
    ))}
  </div>
</section>


<section className="contact-section">
      <h2>Contact Us</h2>
      <div className="contact-container">
        {/* Left: Contact Form */}
        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter you name"
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              required
            ></textarea>

            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Right: Contact Information */}
        <div className="contact-info">
          <p><span>📞</span> Phone: +91 96624 28603</p>
          <p><span>✉</span> Email: handofhope@gmail.com</p>
          <p><span>📍</span> Address: Ganpat University</p>
        </div>
      </div>
    </section>

    </>
  );
};

export default LandingPage;
