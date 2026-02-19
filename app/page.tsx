"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "Tailwind CSS",
    "TypeScript",
  ];

  const projects = [
    {
      title: "Travel Landing Page",
      image: "/projects/travel.png",
      url: "https://77kingo.github.io/travel_landing/",
    },
    {
      title: "Quiz App",
      image: "/projects/quiz.png",
      url: "https://77kingo.github.io/quiz_app/",
    },
    {
      title: "Foodie App",
      image: "/projects/foodie.png",
      url: "https://77kingo.github.io/foodie-app/",
    },
    {
      title: "Music Player",
      image: "/projects/music.png",
      url: "https://77kingo.github.io/MusicPlayer/",
    },
    {
      title: "HamroKhet – Agriculture Platform",
      image: "/projects/hamrokhet.png",
      url: "https://kingo-hamrokhet.lovestoblog.com/",
    },
  ];

  return (
    <main className="text-white min-h-screen relative bg-[#0f0f0f]">

      {/* Scroll Progress */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
      />

      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none -z-10 w-40 h-40 bg-purple-500 opacity-20 blur-3xl rounded-full"
        style={{ left: position.x - 80, top: position.y - 80 }}
      />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full backdrop-blur-md bg-black/40 border-b border-white/10 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="font-bold text-lg">Saurav Singh</h1>
          <div className="space-x-6 hidden md:block">
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#github">GitHub</a>
            <a href="#experience">Experience</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center h-screen text-center px-6 relative">
        <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[150px] rounded-full animate-pulse"></div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text z-10">
          Saurav Singh
        </h1>

        <p className="mt-6 text-xl text-gray-400 z-10">
          Full Stack Developer building scalable & modern web apps.
        </p>

        <div className="mt-8 flex gap-6 z-10">
          <a
            href="#projects"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:scale-105 transition"
          >
            View Projects
          </a>

          <a
            href="/resume.pdf"
            download
            className="px-6 py-3 border border-purple-500 rounded-full hover:bg-purple-600/20 transition"
          >
            Download Resume
          </a>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-16">Skills</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Featured Projects
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {projects.map((project, i) => (
            <Tilt key={i} glareEnable={true} glareMaxOpacity={0.3} scale={1.05}>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">

                <img
                  src={project.image}
                  alt={project.title}
                  className="rounded-xl mb-4 w-full object-cover"
                />

                <h3 className="text-2xl font-semibold mb-3">
                  {project.title}
                </h3>

                <a
                  href={project.url}
                  target="_blank"
                  className="text-purple-400"
                >
                  View Project →
                </a>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* GITHUB */}
      <section id="github" className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-8">GitHub</h2>

        <div className="flex flex-col items-center gap-6">
          <a
            href="https://github.com/77kingo"
            target="_blank"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:scale-105 transition"
          >
            <FaGithub size={24} />
            Visit My GitHub
          </a>

          <img
            src="https://github-readme-stats.vercel.app/api?username=77kingo&show_icons=true&theme=dark"
            alt="GitHub Stats"
          />

          <img
            src="https://github-readme-streak-stats.herokuapp.com/?user=77kingo&theme=dark"
            alt="GitHub Streak"
          />
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Experience Timeline
        </h2>

        <VerticalTimeline>
          <VerticalTimelineElement
            date="2023"
            contentStyle={{ background: "#111", color: "#fff" }}
          >
            Built multiple frontend & full stack projects.
          </VerticalTimelineElement>

          <VerticalTimelineElement
            date="2024"
            contentStyle={{ background: "#111", color: "#fff" }}
          >
            Developed HamroKhet Agriculture Platform.
          </VerticalTimelineElement>

          <VerticalTimelineElement
            date="2025"
            contentStyle={{ background: "#111", color: "#fff" }}
          >
            Deployed premium portfolio & production-ready apps.
          </VerticalTimelineElement>
        </VerticalTimeline>
      </section>

      {/* CONTACT */}
      <section className="py-24 text-center">
        <h2 className="text-3xl mb-6 font-semibold">Let’s Work Together</h2>

        <a
          href="mailto:singhsaurav8899@gmail.com"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:scale-105 transition"
        >
          singhsaurav8899@gmail.com
        </a>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} Saurav Singh. All rights reserved.
      </footer>
    </main>
  );
}
