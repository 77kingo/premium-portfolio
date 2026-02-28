"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FaGithub } from "react-icons/fa";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

type Project = {
  id: string;
  title: string;
  image: string;
  url: string;
  description: string;
  tags: string[];
};

type ProjectForm = {
  id: string | null;
  title: string;
  url: string;
  image: string;
  description: string;
  tags: string;
};

const STORAGE_KEY = "portfolioProjectsV2";
const ADMIN_SESSION_KEY = "portfolioAdminUnlockedV1";
const ADMIN_PASSCODE = "kingo2026";

const defaultProjects: Project[] = [
  {
    id: "travel-landing-page",
    title: "Travel Landing Page",
    image: "/projects/travel.png",
    url: "https://77kingo.github.io/travel_landing/",
    description:
      "A conversion-focused travel showcase with rich visuals and smooth interactions.",
    tags: ["Landing Page", "UI", "Responsive"],
  },
  {
    id: "quiz-app",
    title: "Quiz App",
    image: "/projects/quiz.png",
    url: "https://77kingo.github.io/quiz_app/",
    description: "Interactive quiz app with instant scoring and neat transitions.",
    tags: ["JavaScript", "Logic", "Frontend"],
  },
  {
    id: "foodie-app",
    title: "Foodie App",
    image: "/projects/foodie.png",
    url: "https://77kingo.github.io/foodie-app/",
    description: "Modern food browsing experience with clean card-based design.",
    tags: ["React", "UI", "App"],
  },
  {
    id: "music-player",
    title: "Music Player",
    image: "/projects/music.png",
    url: "https://77kingo.github.io/MusicPlayer/",
    description:
      "Lightweight music player with playlist controls and polished styling.",
    tags: ["Media", "JavaScript", "UX"],
  },
  {
    id: "hamrokhet",
    title: "HamroKhet - Agriculture Platform",
    image: "/projects/hamrokhet.png",
    url: "https://kingo-hamrokhet.lovestoblog.com/",
    description:
      "An agriculture-focused platform built to connect farming needs and digital tools.",
    tags: ["Full Stack", "Platform", "Production"],
  },
];

const emptyForm: ProjectForm = {
  id: null,
  title: "",
  url: "",
  image: "",
  description: "",
  tags: "",
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [adminInput, setAdminInput] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Project[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setProjects(parsed);
      }
    } catch {
      setProjects(defaultProjects);
    }
  }, []);

  useEffect(() => {
    const unlocked = window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
    setAdminUnlocked(unlocked);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    window.localStorage.setItem(ADMIN_SESSION_KEY, adminUnlocked ? "true" : "false");
  }, [adminUnlocked]);

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

  const totalProjects = useMemo(() => projects.length, [projects]);

  const onFileUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const onEditProject = (project: Project) => {
    setForm({
      id: project.id,
      title: project.title,
      url: project.url,
      image: project.image,
      description: project.description,
      tags: project.tags.join(", "),
    });

    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const onDeleteProject = (id: string) => {
    if (!adminUnlocked) return;
    setProjects((prev) => prev.filter((project) => project.id !== id));
    if (form.id === id) {
      setForm(emptyForm);
    }
  };

  const onSaveProject = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adminUnlocked) return;

    const title = form.title.trim();
    const url = form.url.trim();
    const image = form.image.trim();
    if (!title || !url) return;

    const nextProject: Project = {
      id:
        form.id ??
        `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      title,
      url,
      image: image || "/projects/travel.png",
      description: form.description.trim() || "Freshly added portfolio project.",
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setProjects((prev) => {
      if (form.id) {
        return prev.map((project) =>
          project.id === form.id ? nextProject : project
        );
      }
      return [nextProject, ...prev];
    });

    setForm(emptyForm);
  };

  const onRestoreDefaults = () => {
    if (!adminUnlocked) return;
    setProjects(defaultProjects);
    setForm(emptyForm);
  };

  const onUnlockAdmin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminInput.trim() === ADMIN_PASSCODE) {
      setAdminUnlocked(true);
      setAdminError("");
      setAdminInput("");
      return;
    }
    setAdminError("Wrong passcode");
  };

  const onLockAdmin = () => {
    setAdminUnlocked(false);
    setForm(emptyForm);
    setAdminInput("");
    setAdminError("");
  };

  return (
    <main className="text-white min-h-screen relative bg-[#0f0f0f]">
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 origin-left z-50"
      />

      <div
        className="fixed pointer-events-none -z-10 w-40 h-40 bg-purple-500 opacity-20 blur-3xl rounded-full"
        style={{ left: position.x - 80, top: position.y - 80 }}
      />

      <nav className="fixed top-0 w-full backdrop-blur-md bg-black/40 border-b border-white/10 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="font-bold text-lg">Saurav Singh</h1>
          <div className="space-x-6 hidden md:block">
            <a href="#skills">Skills</a>
            <a href="#studio">Project Studio</a>
            <a href="#projects">Projects</a>
            <a href="#github">GitHub</a>
            <a href="#experience">Experience</a>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center h-screen text-center px-6 relative">
        <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-20 blur-[150px] rounded-full animate-pulse" />

        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text z-10">
          Saurav Singh
        </h1>

        <p className="mt-6 text-xl text-gray-400 z-10">
          Full Stack Developer building scalable and modern web apps.
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

      <section id="studio" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10 p-8 shadow-2xl shadow-blue-900/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-cyan-300 uppercase text-xs tracking-[0.2em]">
                  Project Studio
                </p>
                <h2 className="text-4xl font-bold mt-2">
                  Add or Update Projects Instantly
                </h2>
                <p className="text-gray-300 mt-2">Total projects: {totalProjects}</p>
              </div>
              <button
                onClick={onRestoreDefaults}
                disabled={!adminUnlocked}
                className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
              >
                Restore Defaults
              </button>
            </div>

            {!adminUnlocked ? (
              <form onSubmit={onUnlockAdmin} className="grid md:grid-cols-[1fr_auto] gap-4">
                <input
                  type="password"
                  value={adminInput}
                  onChange={(e) => setAdminInput(e.target.value)}
                  placeholder="Enter admin passcode to edit projects"
                  className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-300"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
                >
                  Unlock Studio
                </button>
                {adminError ? (
                  <p className="md:col-span-2 text-red-300 text-sm">{adminError}</p>
                ) : (
                  <p className="md:col-span-2 text-gray-300 text-sm">
                    Studio editing is locked for visitors. Unlock to add, update, or delete
                    projects.
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={onSaveProject} className="grid md:grid-cols-2 gap-6">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Project Title"
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-300"
                required
              />

              <input
                value={form.url}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="Project URL (https://...)"
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-300"
                required
              />

              <input
                value={form.image}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, image: e.target.value }))
                }
                placeholder="Image URL (optional)"
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-300"
              />

              <label className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-gray-300 cursor-pointer hover:border-cyan-300 transition">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileUpload(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>

              <input
                value={form.tags}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Tags (comma separated)"
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-300 md:col-span-2"
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Short project description"
                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-cyan-300 md:col-span-2 min-h-[110px]"
              />

              <div className="md:col-span-2 flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
                >
                  {form.id ? "Update Project" : "Add Project"}
                </button>

                {form.id ? (
                  <button
                    type="button"
                    onClick={() => setForm(emptyForm)}
                    className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
                  >
                    Cancel Editing
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={onLockAdmin}
                  className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
                >
                  Lock Studio
                </button>
              </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {projects.map((project, i) => (
            <Tilt key={project.id} glareEnable={true} glareMaxOpacity={0.3} scale={1.05}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="rounded-xl mb-4 w-full object-cover"
                />

                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                  <button
                    onClick={() => onEditProject(project)}
                    disabled={!adminUnlocked}
                    className="text-xs px-3 py-1 rounded-full border border-cyan-300/40 text-cyan-300 hover:bg-cyan-300/10 transition"
                  >
                    Edit
                  </button>
                </div>

                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={`${project.id}-${tag}`}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400"
                  >
                    View Project -&gt;
                  </a>

                  <button
                    onClick={() => onDeleteProject(project.id)}
                    disabled={!adminUnlocked}
                    className="text-red-300 text-sm hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </Tilt>
          ))}
        </div>
      </section>

      <section id="github" className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-8">GitHub</h2>

        <div className="flex flex-col items-center gap-6">
          <a
            href="https://github.com/77kingo"
            target="_blank"
            rel="noopener noreferrer"
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

      <section id="experience" className="py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Experience Timeline</h2>

        <VerticalTimeline>
          <VerticalTimelineElement
            date="2023"
            contentStyle={{ background: "#111", color: "#fff" }}
          >
            Built multiple frontend and full stack projects.
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
            Deployed premium portfolio and production-ready apps.
          </VerticalTimelineElement>
        </VerticalTimeline>
      </section>

      <section className="py-24 text-center">
        <h2 className="text-3xl mb-6 font-semibold">Let us Work Together</h2>

        <a
          href="mailto:singhsaurav8899@gmail.com"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:scale-105 transition"
        >
          singhsaurav8899@gmail.com
        </a>
      </section>

      <footer className="text-center py-8 text-gray-500 text-sm">
        Copyright {new Date().getFullYear()} Saurav Singh. All rights reserved.
      </footer>
    </main>
  );
}
