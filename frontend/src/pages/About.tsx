import React from 'react';
import { Github, Globe, Linkedin, Mail } from 'lucide-react';

const technologies = [
  { name: 'React + TypeScript', description: 'Built with Vite for ultra-fast development' },
  { name: 'TailwindCSS', description: 'Modern, utility-first styling' },
  { name: 'Flask', description: 'Robust Python-based backend' },
  { name: 'SQLite', description: 'Efficient data persistence' },
  { name: 'Scapy', description: 'Low-level packet manipulation' },
  { name: 'Machine Learning', description: 'Intelligent threat detection' },
];

const developer = {
  name: 'Abhishek Khadse',
  role: 'Full Stack Developer',
  bio: 'Passionate about building secure, scalable, and user-friendly applications. Every line of code in this project has been crafted with purpose and attention to detail.',
  social: {
    github: 'https://github.com/abhishek-khadse',
    linkedin: 'https://www.linkedin.com/in/abhishek-khadse45',
    email: 'abhishekkhadse289@gmail.com',
  },
};

export function About() {
  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-bold">👋 Hi, I'm Abhishek Khadse</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to Sage Shield a DDoS detection and mitigation system built from the ground up
            with modern tech and a passion for cybersecurity.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">🔧 Tech Stack</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-4 grid-cols-2">
              {technologies.map((tech) => (
                <div key={tech.name} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Core Architecture</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Frontend: React + TypeScript (Vite)</li>
                <li>• State Management: React Hooks & Context API</li>
                <li>• Styling: TailwindCSS</li>
                <li>• Backend: Flask REST API</li>
                <li>• Database: SQLite</li>
                <li>• Deployment: Custom server setup</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">🚀 Project Goals</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Sage Shield was created to address the critical need for accessible, efficient DDoS protection. 
              As a solo developer, I aimed to build a solution that combines enterprise-level security with 
              an intuitive user interface.
            </p>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-xl font-semibold mb-4">Key Objectives</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Real-time threat detection and mitigation</li>
                <li>• Intuitive monitoring dashboard</li>
                <li>• Automated response system</li>
                <li>• Scalable architecture</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border bg-card overflow-hidden">
            <img
              src="/images/Project_Dashboard.png"
              alt="Project Dashboard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Challenges & Learning */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">🧩 Challenges & What I Learned</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-4">Technical Challenges</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Processing millions of packets in real-time</li>
              <li>• Implementing efficient threat detection algorithms</li>
              <li>• Building a responsive, real-time dashboard</li>
              <li>• Optimizing performance at scale</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold mb-4">Key Learnings</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>• Advanced network security principles</li>
              <li>• Full-stack application architecture</li>
              <li>• Performance optimization techniques</li>
              <li>• Real-time data processing strategies</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">👨‍💻 What's Next</h2>
        <div className="rounded-lg border bg-card p-6">
          <p className="text-lg text-muted-foreground mb-4">
            I believe in shipping fast, learning faster, and improving constantly. Here's what's on the horizon:
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Feature Expansion</h4>
              <p className="text-sm text-muted-foreground">Adding more advanced detection algorithms and customization options</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Performance Optimization</h4>
              <p className="text-sm text-muted-foreground">Further improving processing speed and efficiency</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Open Source</h4>
              <p className="text-sm text-muted-foreground">Planning to make components available to the community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Let's Connect</h2>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Thanks for stopping by! If you're curious about the code, features, or just want to connect,
            feel free to reach out through any of these channels:
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href={developer.social.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Github className="h-8 w-8" />
              <span className="sr-only">GitHub</span>
            </a>
            <a 
              href={developer.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Linkedin className="h-8 w-8" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a 
              href={`mailto:${developer.social.email}`} 
              className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Mail className="h-8 w-8" />
              <span className="sr-only">Email</span>
            </a>
          </div>
        </div>
      </section>

      {/* Medal Certificate */}
      <section className="space-y-8 border-t pt-16">
        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <span>🏆</span> Recognition
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg border p-6 space-y-6">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img
                src="/images/MEDAL CERTIFICATE.jpg"
                alt="Medal Certificate"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-semibold">Academic Excellence Recognition</h3>
              <p className="text-lg text-muted-foreground">
                Honored to receive recognition for outstanding academic achievement and innovative contribution 
                in the field of network security through the development of Sage Shield. This certificate 
                represents not just personal achievement, but the validation of the project's impact and 
                technical merit in addressing real-world cybersecurity challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <p className="text-sm text-center text-muted-foreground">
          © 2024 Sage Shield. Built with 💻 by Abhishek Khadse
        </p>
      </footer>
    </div>
  );
} 