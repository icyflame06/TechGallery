import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { EventItem, ProjectRecord, GalleryItem, FAQItem, FestivalSettings, RegistrationRecord } from './types';
import { useAuth } from './context/AuthContext';
import { TechBackground } from './components/home/TechBackground';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { AboutSection } from './components/about/AboutSection';
import { EventsTimeline } from './components/events/EventsTimeline';
import { TechShowcaseSection } from './components/showcase/TechShowcaseSection';
import { ScheduleSection } from './components/schedule/ScheduleSection';
import { ProjectSubmissionModal } from './components/showcase/ProjectSubmissionModal';
import { WorkshopsHackathonsSection } from './components/workshops/WorkshopsHackathonsSection';
import { RegistrationSection } from './components/registration/RegistrationSection';
import { GallerySection } from './components/gallery/GallerySection';
import { FAQSection } from './components/faq/FAQSection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationToast } from './components/layout/NotificationToast';
import { TechnicalSeparator } from './components/common/TechnicalSeparator';
import { ScrollReveal } from './components/common/ScrollReveal';
import { CustomCursor } from './components/common/CustomCursor';
import { TechLoaderOverlay } from './components/common/TechLoaderOverlay';

// Default static fallback data (strictly matching the prompt requirements) in case backend is initializing
const DEFAULT_EVENTS: EventItem[] = [
  {
    id: 'bhavesh-workshop',
    name: 'Bhavesh Workshop',
    date_display: '18 January 2027',
    date_iso: '2027-01-18',
    tagline: 'Hands-on Technical Immersion',
    description: 'An intensive technical workshop designed to deepen practical skills and explore cutting-edge methodologies. Final curriculum, hands-on labs, and prerequisites will be announced by the organizing faculty committee.',
    eligibility: 'Exclusive to our college students.',
    eligibility_type: 'internal_only',
    registration_status: 'open',
    rules: '• Strictly restricted to enrolled students of our college.\n• College ID verification is mandatory at entry.\n• Bring your own laptop with required development environment.\n• Certificates awarded upon 100% completion of hands-on sessions.',
    venue: 'Campus Auditorium / Main Lab A',
    timing: '09:30 AM - 04:30 PM',
    is_workshop: true,
    is_hackathon: false,
    is_showcase: false,
    display_order: 1,
  },
  {
    id: 'thakkar-workshop',
    name: 'Thakkar Workshop',
    date_display: '19 January 2027',
    date_iso: '2027-01-19',
    tagline: 'Advanced Systems & Architecture Workshop',
    description: 'A high-impact technical workshop focused on architectural principles and engineering best practices. Details and workshop scope to be finalized and editable by organizers via the admin portal.',
    eligibility: 'Exclusive to our college students.',
    eligibility_type: 'internal_only',
    registration_status: 'open',
    rules: '• Open exclusively to our college students.\n• Prior registration via this portal is mandatory.\n• Participants must carry their valid student identity card.\n• Interactive Q&A and practical challenges included.',
    venue: 'Seminar Hall 2 / Tech Wing',
    timing: '09:30 AM - 04:30 PM',
    is_workshop: true,
    is_hackathon: false,
    is_showcase: false,
    display_order: 2,
  },
  {
    id: 'bhavesh-hackathon',
    name: 'Bhavesh Hackathon',
    date_display: '20 January 2027',
    date_iso: '2027-01-20',
    tagline: 'Rapid Prototyping & Code Sprint',
    description: 'A 24-hour sprint of coding, design, and problem solving. Problem statements and evaluation criteria will be released on the day by the organizing leads. Keep checking the portal for updates.',
    eligibility: 'Exclusive to our college students.',
    eligibility_type: 'internal_only',
    registration_status: 'open',
    rules: '• Exclusively for our college students.\n• External college students are NOT eligible.\n• Teams may consist of 2 to 4 members.\n• All code and prototypes must be built during the hackathon hours.\n• Results announced on 24 January 2027.',
    venue: 'Central Computing Center',
    timing: '08:00 AM - Overnight',
    is_workshop: false,
    is_hackathon: true,
    is_showcase: false,
    display_order: 3,
  },
  {
    id: 'tech-showcase-day-1',
    name: 'Tech Showcase – Day 1',
    date_display: '21 January 2027',
    date_iso: '2027-01-21',
    tagline: 'Flagship Hardware & Software Exhibition',
    description: 'Grand public exhibition of innovative hardware and software prototypes. Innovators from our college and external colleges demonstrate working projects to visiting industry leaders, academics, and peer students.',
    eligibility: 'Open to our college and external colleges.',
    eligibility_type: 'open_all',
    registration_status: 'open',
    rules: '• Open to students from our college and all external colleges across the country.\n• Projects must fit into either Hardware (Robotics, IoT, Embedded, etc.) or Software (AI, ML, Web, Apps, etc.) categories.\n• Working prototype or live demonstration is required.\n• All project submissions must be pre-approved by the festival review committee.',
    venue: 'Innovation Exhibition Pavilion',
    timing: '10:00 AM - 05:00 PM',
    is_workshop: false,
    is_hackathon: false,
    is_showcase: true,
    display_order: 4,
  },
  {
    id: 'tech-showcase-day-2',
    name: 'Tech Showcase – Day 2',
    date_display: '22 January 2027',
    date_iso: '2027-01-22',
    tagline: 'Advanced Prototype Demos & Industry Review',
    description: 'Day two of the flagship Tech Showcase. Featuring live hardware testing, interactive software demos, and jury walkthroughs across both Hardware and Software categories.',
    eligibility: 'Open to our college and external colleges.',
    eligibility_type: 'open_all',
    registration_status: 'open',
    rules: '• Open to students from our college and all external colleges.\n• Continuous live demo booths with hardware power & high-speed network support.\n• Peer feedback and industry evaluation sessions throughout the day.',
    venue: 'Innovation Exhibition Pavilion',
    timing: '10:00 AM - 05:00 PM',
    is_workshop: false,
    is_hackathon: false,
    is_showcase: true,
    display_order: 5,
  },
  {
    id: 'thakkar-hackathon',
    name: 'Thakkar Hackathon',
    date_display: '23 January 2027',
    date_iso: '2027-01-23',
    tagline: 'Systems, Security & Engineering Challenge',
    description: 'An intense engineering hackathon tackling challenging technical problem statements. Themes and evaluation metrics will be updated by festival administrators prior to launch.',
    eligibility: 'Exclusive to our college students.',
    eligibility_type: 'internal_only',
    registration_status: 'open',
    rules: '• Strictly exclusive to enrolled students of our college.\n• External college students are not eligible.\n• Teams of 2 to 4 students allowed.\n• Results announced on 24 January 2027.',
    venue: 'Tech Innovation Lab & Server Hall',
    timing: '08:00 AM - 10:00 PM',
    is_workshop: false,
    is_hackathon: true,
    is_showcase: false,
    display_order: 6,
  },
  {
    id: 'ai-workshop-parents',
    name: 'AI Workshop for Parents',
    date_display: '24 January 2027',
    date_iso: '2027-01-24',
    tagline: 'Demystifying AI for Families & Guardians',
    description: 'A specially crafted, welcoming workshop designed for parents to understand modern Artificial Intelligence, online digital safety, and how emerging technologies shape career and educational pathways.',
    eligibility: 'The AI Workshop on 24 January is intended for parents.',
    eligibility_type: 'parents_only',
    registration_status: 'open',
    rules: '• Intended specifically for parents and guardians of students.\n• No prior technical background required.\n• Plain-English, conversational sessions with real-world examples and safety tips.\n• Interactive demonstration and family Q&A session.',
    venue: 'Main College Auditorium',
    timing: '10:00 AM - 01:00 PM',
    is_workshop: true,
    is_hackathon: false,
    is_showcase: false,
    display_order: 7,
  },
  {
    id: 'both-hackathon-results',
    name: 'Both Hackathon Results',
    date_display: '24 January 2027',
    date_iso: '2027-01-24',
    tagline: 'Grand Valedictory & Awards Ceremony',
    description: 'Official announcement and celebration of the winners of both the Bhavesh Hackathon and the Thakkar Hackathon, followed by the Tech Gallery 2027 valedictory ceremony.',
    eligibility: 'Open to all attendees, participants, faculty, and parents.',
    eligibility_type: 'results_only',
    registration_status: 'announced',
    rules: '• Both hackathon results will be officially unveiled at 03:00 PM.\n• All finalists and participants are requested to assemble in the auditorium.\n• Mementos and official participation certificates distributed.',
    venue: 'Grand Amphitheatre & Main Stage',
    timing: '03:00 PM - 06:00 PM',
    is_workshop: false,
    is_hackathon: false,
    is_showcase: false,
    display_order: 8,
  },
];

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'Who can attend?',
    answer: 'Anyone. Students from other colleges can register for any pass, and the showcase is open to the public on the last three days.',
    category: 'General',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    question: 'Do I need a team for the hackathon?',
    answer: 'No. Register on your own and we will match you with others on the first morning. Teams can have two to four members.',
    category: 'Hackathons',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    question: 'What should I bring to a workshop?',
    answer: 'A charged laptop and your college ID. Kits, boards and components are provided and collected at the end.',
    category: 'Workshops',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    question: 'How do I show a project in the showcase?',
    answer: 'Choose the Team pass and add your project details after you register. We confirm stall space within five days.',
    category: 'Showcase',
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    question: 'Can I get a refund?',
    answer: 'Yes, until 10 January. Write to the team and we will return the full amount.',
    category: 'Registration',
    display_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    question: 'Can external college students participate?',
    answer: 'Yes, but with specific rules: External college students can participate ONLY in the Tech Showcase (Day 1 & Day 2) by submitting their hardware or software projects. External college students are not eligible for the Bhavesh or Thakkar hackathons or workshops.',
    category: 'Eligibility',
    display_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    question: 'Who can participate in hackathons?',
    answer: 'Both the Bhavesh Hackathon (20 January) and the Thakkar Hackathon (23 January) are strictly exclusive to enrolled students of our college. External students cannot register for either hackathon.',
    category: 'Hackathons',
    display_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    question: 'Can students submit hardware projects?',
    answer: 'Yes! The Hardware Showcase is one of our flagship tracks. We welcome submissions in Robotics, IoT, ESP32/Arduino, Smart Home Automation, Embedded Systems, Electronic Prototypes, and Innovative Hardware Products from both our college and external colleges.',
    category: 'Showcase',
    display_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    question: 'Can students submit software projects?',
    answer: 'Yes! The Software Showcase welcomes projects in Artificial Intelligence, Machine Learning, Web Applications, Android Applications, AI Assistants, SaaS Products, Desktop Applications, and Automation Software from both our college and external institutions.',
    category: 'Showcase',
    display_order: 9,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    question: 'Will participation certificates be provided?',
    answer: 'Yes, official Tech Gallery 2027 participation certificates will be awarded to confirmed attendees and project presenters at the valedictory session on 24 January 2027.',
    category: 'Certificates',
    display_order: 10,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: '1',
    title: 'Autonomous Rover Prototype',
    category: 'hardware',
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description: 'ESP32 & LiDAR based terrain mapping vehicle designed by student innovators.',
    is_featured: true,
    is_placeholder: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Neural Edge Detection Suite',
    category: 'software',
    image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
    description: 'Real-time on-device machine vision pipeline running at 60 FPS.',
    is_featured: true,
    is_placeholder: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Smart IoT Microgrid',
    category: 'hardware',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Embedded sensor network monitoring solar distribution and efficiency.',
    is_featured: false,
    is_placeholder: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Hackathon Collaborative Zone',
    category: 'event',
    image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    description: 'Teams brainstorming and assembling technical prototypes during the sprint.',
    is_featured: true,
    is_placeholder: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'AI Parent Education Session',
    category: 'workshop',
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description: 'Interactive digital awareness and AI safety demonstration for families.',
    is_featured: false,
    is_placeholder: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Robotic Arm Manipulator',
    category: 'hardware',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: '6-DOF inverse kinematics mechanical assembly with custom servo controllers.',
    is_featured: false,
    is_placeholder: true,
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_SETTINGS: FestivalSettings = {
  festival_name: 'TECH GALLERY 2027',
  tagline: 'Where Ideas Meet Innovation.',
  start_date: '2027-01-18',
  end_date: '2027-01-24',
  our_college_name: 'LJCCA',
  official_email: 'contact@techgallery2027.edu',
  phone: '+91 98765 43210',
  address: 'LJCCA, NEAR NEW, IIM Rd, Vastrapur, Ahmedabad, Gujarat 380015',
  instagram_url: 'https://instagram.com/techgallery2027',
};

export const App: React.FC = () => {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [settings, setSettings] = useState<FestivalSettings>(DEFAULT_SETTINGS);

  // Modal controls
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [initialRegForSubmission, setInitialRegForSubmission] = useState<RegistrationRecord | null>(null);
  const [preselectedEventId, setPreselectedEventId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [eventsData, projectsData, galleryData, faqsData, settingsData] = await Promise.all([
        api.getEvents().catch(() => DEFAULT_EVENTS),
        api.getPublicProjects().catch(() => []),
        api.getGallery().catch(() => DEFAULT_GALLERY),
        api.getFAQs().catch(() => DEFAULT_FAQS),
        api.getSettings().catch(() => DEFAULT_SETTINGS),
      ]);

      if (eventsData && eventsData.length > 0) setEvents(eventsData);
      if (projectsData) setProjects(projectsData);
      if (galleryData && galleryData.length > 0) setGalleryItems(galleryData);
      if (faqsData && faqsData.length > 0) setFaqs(faqsData);
      if (settingsData) setSettings(settingsData);
    } catch {
      // Keep defaults
    }
  };

  useEffect(() => {
    loadData();

    // Check URL parameters for project submission deep-link or approval
    const params = new URLSearchParams(window.location.search);
    const shouldSubmit = params.get('submit_project') === 'true';
    const regCode = params.get('reg_code');
    const email = params.get('email');

    if (shouldSubmit && regCode && email) {
      api.checkSubmissionAccess(regCode, email)
        .then((data) => {
          setInitialRegForSubmission({
            id: '',
            reg_code: data.reg_code,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            college_name: data.college_name,
            is_internal: false,
            department: data.department,
            year_semester: '',
            event_id: 'tech-showcase-day-1',
            event_name: 'Tech Showcase',
            team_name: data.team_name,
            team_members: '',
            status: 'approved',
            can_submit_project: true,
            created_at: '',
          });
          setIsSubmissionOpen(true);
        })
        .catch((err) => {
          console.warn('Submission access validation notice:', err);
        });
    }
  }, []);

  const handleOpenAdmin = () => {
    if (isAdmin) {
      setIsDashboardOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleSelectRegister = (eventId: string) => {
    setPreselectedEventId(eventId);
    const elem = document.getElementById('register');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectShowcase = () => {
    const elem = document.getElementById('showcase');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Cybernetic Boot Sequence Loader */}
      <TechLoaderOverlay />

      {/* Custom Interactive Desktop Cursor */}
      <CustomCursor />

      {/* Background Interactive Constellation Grid */}
      <TechBackground />

      {/* Header & Sticky Nav */}
      <Navbar onOpenAdmin={handleOpenAdmin} />

      {/* Main Content Sections */}
      <main id="top" style={{ position: 'relative', zIndex: 1 }}>
        {/* A. Hero */}
        <Hero />

        <TechnicalSeparator label="SYS // EXPO OVERVIEW" code="MODULE // 01.ABOUT" />

        {/* B. About */}
        <ScrollReveal>
          <AboutSection />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // TRACK MATRIX" code="MODULE // 02.PROGRAM" />

        {/* C. Events (Track Overview & 8 Events Program) */}
        <ScrollReveal>
          <EventsTimeline
            events={events}
            onSelectRegister={handleSelectRegister}
            onSelectShowcase={handleSelectShowcase}
          />
        </ScrollReveal>

        {/* C.2 Intensive Workshops & Hackathons */}
        <ScrollReveal>
          <WorkshopsHackathonsSection
            events={events}
            onRegister={handleSelectRegister}
          />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // INNOVATION SHOWCASE" code="MODULE // 03.EXHIBITS" />

        {/* D. Tech Showcase */}
        <ScrollReveal>
          <TechShowcaseSection projects={projects} />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // 7-DAY TIMELINE" code="MODULE // 04.SCHEDULE" />

        {/* E. 7-Day Schedule with Days Tabs & Session Rows */}
        <ScrollReveal>
          <ScheduleSection />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // ACCREDITATION PASSES" code="MODULE // 05.ACCESS" />

        {/* F. Registration Section */}
        <ScrollReveal>
          <RegistrationSection
            events={events}
            preselectedEventId={preselectedEventId}
            ourCollegeName={settings.our_college_name}
            onOpenSubmission={(reg) => {
              setInitialRegForSubmission(reg || null);
              setIsSubmissionOpen(true);
            }}
          />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // VISUAL ARCHIVE" code="MODULE // 06.GALLERY" />

        {/* G. Gallery */}
        <ScrollReveal>
          <GallerySection items={galleryItems} />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // INTELLIGENCE BASE" code="MODULE // 07.FAQS" />

        {/* H. FAQ */}
        <ScrollReveal>
          <FAQSection faqs={faqs} />
        </ScrollReveal>

        <TechnicalSeparator label="SYS // COMMUNICATIONS" code="MODULE // 08.DISPATCH" />

        {/* I. Contact */}
        <ScrollReveal>
          <ContactSection
            collegeName={settings.our_college_name}
            officialEmail={settings.official_email}
            phone={settings.phone}
            address={settings.address}
            instagramUrl={settings.instagram_url}
          />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        collegeName={settings.our_college_name}
        email={settings.official_email}
        phone={settings.phone}
        address={settings.address}
        instagramUrl={settings.instagram_url}
      />

      {/* Modals & Portals */}
      <ProjectSubmissionModal
        isOpen={isSubmissionOpen}
        initialRegistration={initialRegForSubmission}
        onClose={() => {
          setIsSubmissionOpen(false);
          setInitialRegForSubmission(null);
        }}
        onSuccess={() => {
          loadData();
        }}
      />

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {
          setIsLoginOpen(false);
          setIsDashboardOpen(true);
        }}
      />

      <AdminDashboard
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        events={events}
        faqs={faqs}
        galleryItems={galleryItems}
        settings={settings}
        onDataChanged={loadData}
      />

      {/* Notification Toast Stream */}
      <NotificationToast />
    </div>
  );
};

export default App;

