
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    CheckCircleIcon, 
    CloudIcon, 
    CodeBracketIcon, 
    CpuChipIcon, 
    LifebuoyIcon, 
    AcademicCapIcon,
    MegaphoneIcon,
    ChatBubbleIcon,
    SparklesIcon
} from '../components/Icon';
import { getCareerAdvice } from '../services/geminiService';
import Spinner from '../components/Spinner';


const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
        window.scrollTo(0,0);
    }
  }, [location.hash]);

  const Section: React.FC<{id: string, children: React.ReactNode, className?: string}> = ({id, children, className=""}) => (
    <section id={id} className={`container mx-auto px-4 py-16 md:py-24 ${className}`}>
        {children}
    </section>
  );

  const SectionTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
    <h2 className="text-3xl md:text-4xl font-bold text-dark text-center mb-4">{children}</h2>
  );
  
  const SectionSubtitle: React.FC<{children: React.ReactNode}> = ({children}) => (
    <p className="text-lg text-dark-700 text-center max-w-3xl mx-auto mb-12">{children}</p>
  );

  const AICareerCounselor: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAsk = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError('');
        setResponse('');
        try {
            const advice = await getCareerAdvice(query);
            setResponse(advice);
        } catch (err) {
            setError('Sorry, I couldn\'t fetch advice right now. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
      <Section id="ai-counselor" className="bg-primary/5">
        <div className="flex items-center justify-center gap-2">
           <SparklesIcon className="h-8 w-8 text-primary"/>
           <SectionTitle>AI Career Counselor</SectionTitle>
        </div>
        <SectionSubtitle>Unsure where to start? Have questions about SAP careers? Ask our AI assistant for instant guidance.</SectionSubtitle>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <div className="flex flex-col sm:flex-row gap-2">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., Which course is best for a finance professional?" 
                    className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    disabled={isLoading}
                />
                <button 
                    onClick={handleAsk}
                    disabled={isLoading}
                    className="w-full sm:w-auto flex justify-center items-center bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Ask'}
                </button>
            </div>
            { (isLoading || error || response) && (
              <div className="mt-6 p-6 bg-light-100 rounded-md border border-neutral-200 min-h-[100px] flex items-center justify-center">
                {isLoading && <Spinner />}
                {error && <p className="text-red-600 text-center">{error}</p>}
                {response && <div className="prose prose-sm max-w-none text-dark" dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br />') }}></div>}
              </div>
            )}
        </div>
      </Section>
    );
  };


  return (
    <div className="bg-light text-dark">
      {/* Hero Section */}
      <div className="bg-light-100">
        <div className="container mx-auto px-4 py-24 md:py-32 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-dark mb-4 leading-tight">
            Transform Your Business with <span className="text-primary">SAP & AI</span> Expertise.
            </h1>
            <p className="text-lg md:text-xl text-dark-700 max-w-3xl mx-auto mb-8">
            We help organisations move to the cloud, automate processes, and upskill their teams—all with certified SAP consultants and smart AI tools.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/#services" className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-primary-dark transition-all transform hover:scale-105">
                View Our Services
            </Link>
            <Link to="/#contact" className="w-full sm:w-auto bg-neutral-200 text-dark font-bold py-3 px-8 rounded-md text-lg hover:bg-neutral-300 transition-all transform hover:scale-105">
                Get a Free Consultation
            </Link>
            </div>
             {/* Announcement Banner */}
            <div className="mt-16 bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg max-w-4xl mx-auto text-left shadow-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <MegaphoneIcon className="h-8 w-8 text-primary mr-3" />
                    </div>
                    <div>
                        <h3 className="font-bold text-primary text-lg">
                            Limited Time Offer: Get up to 75% OFF on Courses!
                        </h3>
                        <p className="text-dark-700 mt-1">
                            Prove your skills by taking our assessment test. Don't miss this opportunity to advance your career at a fraction of the cost.
                        </p>
                        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm font-medium">
                            <div className="flex items-center">
                                <span className="font-semibold text-dark mr-2">Enrollment Deadline:</span>
                                <span className="text-primary-dark font-bold">August 14, 2025</span>
                            </div>
                            <div className="flex items-center">
                                <span className="font-semibold text-dark mr-2">Test Date:</span>
                                <span className="text-primary-dark font-bold">August 15, 2025</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link to="/register" className="inline-block bg-secondary text-dark font-bold py-2 px-6 rounded-md hover:opacity-90 transition-all transform hover:scale-105 shadow-md">
                                Enroll Now & Take the Test
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-light">
          <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="p-4">
                      <h3 className="text-xl font-bold text-primary mb-2">100% SAP Focus</h3>
                      <p className="text-dark-700">From S/4HANA Public Cloud to Integration Suite.</p>
                  </div>
                  <div className="p-4">
                      <h3 className="text-xl font-bold text-primary mb-2">AI-Driven Solutions</h3>
                      <p className="text-dark-700">Chatbots, OCR, predictive analytics.</p>
                  </div>
                  <div className="p-4">
                      <h3 className="text-xl font-bold text-primary mb-2">Proven Healthcare Know-how</h3>
                      <p className="text-dark-700">Hospital Information System (HIS) integrations.</p>
                  </div>
              </div>
          </div>
      </div>

      <AICareerCounselor />

      {/* About Us Section */}
      <Section id="about" className="bg-light-100">
        <SectionTitle>About Us</SectionTitle>
        <SectionSubtitle>
            AI4S Solutions Private Limited is a boutique technology firm based in Kolkata, India. Founded in 2024, our goal is simple: make advanced SAP and AI technology practical and affordable for growing businesses.
        </SectionSubtitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-bold text-lg text-dark mb-2">Mission</h4>
                <p className="text-dark-700">Empower clients to work smarter and faster.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-bold text-lg text-dark mb-2">Vision</h4>
                <p className="text-dark-700">Be India’s most trusted partner for cloud ERP and intelligent automation.</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-bold text-lg text-dark mb-2">Values</h4>
                <p className="text-dark-700">Client success, continuous learning, transparency, and rapid innovation.</p>
            </div>
        </div>
      </Section>

      {/* Services Section */}
      <Section id="services">
        <SectionTitle>Our Services</SectionTitle>
        <SectionSubtitle>We offer a focused range of services designed to deliver maximum impact for your business.</SectionSubtitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { icon: <CloudIcon className="h-10 w-10 text-primary mb-4"/>, title: "SAP S/4HANA Public Cloud", desc: "Fit-to-standard workshops, data migration, user training." },
                { icon: <CodeBracketIcon className="h-10 w-10 text-primary mb-4"/>, title: "BTP Extensions", desc: "Custom apps, Fiori interfaces, event-driven integrations." },
                { icon: <CpuChipIcon className="h-10 w-10 text-primary mb-4"/>, title: "AI & Automation", desc: "Chatbots, document capture, predictive maintenance." },
                { icon: <CheckCircleIcon className="h-10 w-10 text-primary mb-4"/>, title: "Cloud ALM & DevOps", desc: "Project tracking, automated testing, system monitoring." },
                { icon: <AcademicCapIcon className="h-10 w-10 text-primary mb-4"/>, title: "Training & Certification", desc: "Functional (FI, MM, SD) and Technical (ABAP, BTP, CPI) courses." },
                { icon: <LifebuoyIcon className="h-10 w-10 text-primary mb-4"/>, title: "Managed Services", desc: "24×7 support and ongoing improvements." },
            ].map(s => (
                <div key={s.title} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    {s.icon}
                    <h3 className="text-xl font-bold mb-2 text-dark">{s.title}</h3>
                    <p className="text-dark-700">{s.desc}</p>
                </div>
            ))}
        </div>
      </Section>
      
      {/* Why Choose Us Section */}
      <Section id="why-us" className="bg-light-100">
          <SectionTitle>Why Choose Us?</SectionTitle>
          <SectionSubtitle>Our approach combines deep expertise with a commitment to your success.</SectionSubtitle>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                  "Boutique Attention, Big-Project Rigor", "Certified Experts",
                  "Healthcare & SME Specialists", "AI-First Approach",
                  "Transparent Pricing", "Learning Partnership"
              ].map(reason => (
                  <div key={reason} className="flex items-start space-x-3">
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                          <h4 className="font-semibold text-lg text-dark">{reason.split('–')[0]}</h4>
                          {reason.includes('–') && <p className="text-dark-700">{reason.split('–')[1].trim()}</p>}
                      </div>
                  </div>
              ))}
          </div>
      </Section>

      {/* Clients Section */}
      <Section id="clients">
        <SectionTitle>Our Impact</SectionTitle>
        <SectionSubtitle>We respect client confidentiality, so we list industries instead of company names to showcase our experience.</SectionSubtitle>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-neutral-100">
                        <tr>
                            <th className="p-4 font-semibold text-dark">Industry</th>
                            <th className="p-4 font-semibold text-dark">What We Delivered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { industry: "Multi-Speciality Hospital", delivered: "Cloud ERP rollout, HIS ↔ SAP integration, e-Invoicing automation" },
                            { industry: "Pharmaceutical Distributor", delivered: "Batch-tracking app on BTP, analytics dashboards" },
                            { industry: "Auto-Parts Manufacturer", delivered: "SAP FI/CO, MM, PP implementation; AI quality-check tool" },
                            { industry: "IT Services Start-Up", delivered: "Multi-tenant SaaS built on BTP, subscription billing" },
                        ].map((c, i) => (
                             <tr key={c.industry} className={`border-t border-neutral-200 ${i%2 === 1 ? 'bg-light-100/50' : ''}`}>
                                <td className="p-4 font-medium text-dark">{c.industry}</td>
                                <td className="p-4 text-dark-700">{c.delivered}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </Section>
      
      {/* Contact Us Section */}
      <Section id="contact" className="bg-primary/5">
          <SectionTitle>Contact Us</SectionTitle>
          <SectionSubtitle>We’d love to hear from you. Click Submit and we’ll reply within one business day.</SectionSubtitle>
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
              <form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <input type="text" placeholder="Your Name" className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"/>
                      <input type="email" placeholder="Your Email" className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"/>
                      <input type="tel" placeholder="Your Phone" className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"/>
                      <select className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none">
                          <option>Consultation</option>
                          <option>Partnership</option>
                          <option>Training Inquiry</option>
                          <option>Other</option>
                      </select>
                  </div>
                  <textarea placeholder="Tell us what you need in your own words..." rows={5} className="w-full p-3 bg-neutral-100 border border-neutral-300 rounded-md mb-6 focus:ring-2 focus:ring-primary focus:outline-none"></textarea>
                  <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-primary-dark transition-colors">Submit Inquiry</button>
              </form>
          </div>
      </Section>
    </div>
  );
};

export default HomePage;
