import React from "react";
import { NavLink } from "react-router";
import CountUp from "../components/CountUp";
import {
  Code2,
  Sparkles,
  Swords,
  GitBranch,
  Users,
  BarChart2,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "DevVerse replaced 4 tools for me. I prep here, learn here, and my team collaborates here. The AI hints are genuinely good.",
    name: "Priya Chandrasekaran",
    role: "SWE Intern @ Google",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    quote:
      "The gamification actually works. I have been on a 90-day streak and my LeetCode rating jumped 400 points in two months.",
    name: "Marcus Webb",
    role: "Backend Engineer @ Stripe",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    quote:
      "Finally a platform that feels like it was built for serious developers. Clean, fast, no bloat. The battle mode is addictive.",
    name: "Yuki Tanaka",
    role: "CS Student, Tokyo",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    quote:
      "The system design courses are top-notch. I felt fully prepared for my senior engineering interviews thanks to DevVerse.",
    name: "Sarah Jenkins",
    role: "Senior Engineer @ Netflix",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const isProPopular = true;

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-[90vw] max-w-7xl mx-auto flex flex-col items-center mt-6 md:mt-14 mb-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <span className="size-2 rounded-full bg-[#7c3aed]"></span>
            <span className="text-[#7c3aed]">
              The all-in-one platform for developers
            </span>
          </div>
          <div className="flex flex-col gap-2 text-5xl md:text-7xl font-extrabold mt-6 text-foreground">
            <h1>Build Skills.</h1>
            <h1 className="text-[#7c3aed]">Ship Greatness.</h1>
          </div>
          <p className="text-muted-foreground w-full max-w-2xl mx-auto text-lg md:text-xl pt-4 px-4">
            Practice algorithms, compete in real-time battles, follow expert
            learning paths, and get hired — all powered by AI.
          </p>
          <div className="flex justify-center items-center gap-4 pt-6 text-xl">
            <NavLink
              to="/signup"
              className="bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg px-4 py-2 font-medium text-white transition-colors"
            >
              Get Started
            </NavLink>
            <NavLink
              to="/signin"
              className="bg-accent hover:bg-accent/80 rounded-lg px-4 py-2 font-medium text-foreground transition-colors"
            >
              Sign In
            </NavLink>
          </div>

          <div className="grid grid-cols-2 md:flex justify-center items-center gap-8 md:gap-16 pt-16 w-full max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-foreground">
                <CountUp end={3200} suffix="+" />
              </span>
              <span className="text-muted-foreground font-medium">
                Problems
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-foreground">
                <CountUp end={1.4} decimals={1} suffix="M+" />
              </span>
              <span className="text-muted-foreground font-medium">
                Developers
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-foreground">
                <CountUp end={800} suffix="+" />
              </span>
              <span className="text-muted-foreground font-medium">
                Companies
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold text-foreground">Weekly</span>
              <span className="text-muted-foreground font-medium">
                Contests
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-[90vw] max-w-7xl mx-auto py-10">
        <div className="text-center mb-16">
          <div className="inline-flex bg-[#F2F1FE] text-[#7c3aed] px-3 py-1 rounded-full text-sm font-medium mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            One platform.{" "}
            <span className="text-[#7c3aed]">Infinite growth.</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From your first hello world to landing your dream role, DevVerse is
            the last platform you'll need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.0 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-[#F2F1FE] w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="text-[#7c3aed] size-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              3,200+ Problems
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Curated algorithm challenges from beginner to competitive
              programming, with company-specific tracks.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-blue-50 dark:bg-blue-900/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="text-blue-500 size-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              AI Code Review
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get instant feedback, hints, and complexity analysis from a
              specialized AI tutor trained on top solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-pink-50 dark:bg-pink-900/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Swords className="text-pink-500 size-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              Coding Battles
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              1v1 and tournament-style real-time contests. Climb the global
              leaderboard and earn exclusive rewards.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-emerald-50 dark:bg-emerald-900/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <GitBranch className="text-emerald-500 size-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              Learning Paths
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Structured roadmaps for frontend, backend, ML, and system design —
              curated by industry engineers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-orange-50 dark:bg-orange-900/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-orange-500 size-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              Community & Rooms
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Join topic rooms, share solutions, and collaborate on projects
              with developers worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
          >
            <div className="bg-rose-50 dark:bg-rose-900/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="text-rose-500 size-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              Deep Analytics
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Track your growth with heatmaps, skill radars, problem-solving
              velocity, and interview readiness scores.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-24 overflow-hidden flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Loved by developers worldwide
          </h2>
          <p className="text-muted-foreground text-lg">
            Join over 1.4 million developers already on DevVerse
          </p>
        </div>

        <div className="flex w-max animate-marquee gap-6 hover:paused px-3">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="w-[450px] bg-card border border-border p-8 rounded-3xl flex flex-col justify-between shrink-0 shadow-sm"
            >
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed font-medium">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-[90vw] max-w-7xl mx-auto py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.0 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-muted-foreground font-medium text-lg mb-2">
              Free
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl font-bold text-foreground">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8">
              Get started with the basics.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">150 problems</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">2 AI hints/day</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">
                  Community access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">Weekly contests</span>
              </div>
            </div>
            <button className="w-full bg-accent hover:bg-accent/80 text-foreground font-medium py-3 rounded-xl transition-colors">
              Get started
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={
              isProPopular
                ? "bg-[#111118] border-2 border-[#7c3aed] rounded-3xl p-8 shadow-lg relative transform md:-translate-y-4"
                : "bg-card border border-border rounded-3xl p-8 shadow-sm"
            }
          >
            {isProPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#7c3aed] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
            )}
            <h3
              className={`${isProPopular ? "text-gray-400" : "text-muted-foreground"} font-medium text-lg mb-2`}
            >
              Pro
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span
                className={`text-5xl font-bold ${isProPopular ? "text-white" : "text-foreground"}`}
              >
                $14
              </span>
              <span
                className={
                  isProPopular ? "text-gray-400" : "text-muted-foreground"
                }
              >
                /month
              </span>
            </div>
            <p
              className={`${isProPopular ? "text-gray-400" : "text-muted-foreground"} text-sm mb-8`}
            >
              For serious learners and job seekers.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "All 3,200+ problems",
                "Unlimited AI review",
                "Premium roadmaps",
                "Battle mode",
                "Interview prep kit",
                "Priority support",
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check
                    className={
                      isProPopular
                        ? "text-emerald-400 size-5"
                        : "text-emerald-500 size-5"
                    }
                  />
                  <span
                    className={`text-sm ${isProPopular ? "text-gray-200" : "text-foreground"}`}
                  >
                    {feat}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={`w-full font-medium py-3 rounded-xl transition-colors ${
                isProPopular
                  ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                  : "bg-accent hover:bg-accent/80 text-foreground"
              }`}
            >
              Start Pro trial
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-muted-foreground font-medium text-lg mb-2">
              Teams
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-5xl font-bold text-foreground">$49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-muted-foreground text-sm mb-8">
              For bootcamps and engineering teams.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">
                  Everything in Pro
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">
                  Team leaderboards
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">Admin analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">
                  Custom problem sets
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-emerald-500 size-5" />
                <span className="text-sm text-foreground">
                  Slack integration
                </span>
              </div>
            </div>
            <button className="w-full bg-accent hover:bg-accent/80 text-foreground font-medium py-3 rounded-xl transition-colors">
              Contact sales
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
