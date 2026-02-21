// app/about/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Target, Heart, Users, Award, TrendingUp } from "lucide-react";


// Achievement item with progress bar
type Achievement = {
  label: string;
  value: number;       // target percentage (0-100)
  suffix?: string;
  icon: React.ReactNode;
};

const achievements: Achievement[] = [
  { label: "Projects Completed", value: 85, suffix: "+", icon: <Award className="w-6 h-6" /> },
  { label: "Happy Clients", value: 92, suffix: "+", icon: <Users className="w-6 h-6" /> },
  { label: "Properties Sold", value: 78, suffix: "+", icon: <TrendingUp className="w-6 h-6" /> },
  { label: "Years of Excellence", value: 100, suffix: "", icon: <Award className="w-6 h-6" /> }, // 4 out of 4 years
];

// Team members (placeholder)
const team = [
  { name: "John Doe", role: "CEO & Founder", image: "/team/team1.jpg" },
  { name: "Jane Smith", role: "Head of Sales", image: "/team/team2.jpg" },
  { name: "Mike Johnson", role: "Lead Architect", image: "/team/team3.jpg" },
  { name: "Sarah Lee", role: "Marketing Director", image: "/team/team4.jpg" },
];

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [progressValues, setProgressValues] = useState<number[]>(achievements.map(() => 0));
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer to trigger animation when achievements section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animate progress bars when section becomes visible
  useEffect(() => {
    if (!isVisible) return;

    const timers: NodeJS.Timeout[] = [];
    achievements.forEach((ach, index) => {
      const timer = setTimeout(() => {
        setProgressValues((prev) => {
          const newVals = [...prev];
          newVals[index] = ach.value;
          return newVals;
        });
      }, index * 200); // staggered start
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  const patternStyle = {
    width: "100%",
    height: "100%",
    "--s": "200px",
    "--c1": "#d4af37",
    "--c2": "#121212",

    background: `
      radial-gradient(
        100% 100% at 100% 0,
        var(--c1) 4%,
        var(--c2) 4% 14%,
        var(--c1) 14% 24%,
        var(--c2) 22% 34%,
        var(--c1) 34% 44%,
        var(--c2) 44% 56%,
        var(--c1) 56% 66%,
        var(--c2) 66% 76%,
        var(--c1) 76% 86%,
        var(--c2) 86% 96%,
        #0008 96%,
        #0000
      ),
      radial-gradient(
        100% 100% at 0 100%,
        #0000,
        #0008 4%,
        var(--c2) 4% 14%,
        var(--c1) 14% 24%,
        var(--c2) 22% 34%,
        var(--c1) 34% 44%,
        var(--c2) 44% 56%,
        var(--c1) 56% 66%,
        var(--c2) 66% 76%,
        var(--c1) 76% 86%,
        var(--c2) 86% 96%,
        var(--c1) 96%
      )
      var(--c1)
    `,
    backgroundSize: "var(--s) var(--s)",
    backgroundRepeat: "repeat",
    backgroundAttachment: "fixed", // remove if mobile support needed     // bg-fixed
  } as React.CSSProperties;

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-repeat bg-fixed" style={patternStyle} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4 text-center text-white py-30">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Who are  <span className="text-red-600">we?</span></h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto px-4">
            Building dreams, creating communities since 2021
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <p className="text-lg text-gray-700 mb-6">
              Rise Again Holdings Ltd was founded in 2021 with a vision to redefine premium living in Kenya. 
              What started as a small real estate consultancy has grown into a trusted name in luxury property 
              development and investment. Our journey is marked by a relentless commitment to quality, 
              innovation, and customer satisfaction.
            </p>
            <p className="text-lg text-gray-700">
              Over the past four years, we have delivered over 100 residential units, partnered with top architects, 
              and built a community of homeowners who value comfort, security, and elegance. Every project we 
              undertake reflects our core belief: real estate is not just about buildings, but about the lives 
              and memories they hold.
            </p>

            {/* Simple years-of-experience bar */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">Years of experience</span>
                <span className="text-red-700 font-bold">4+ years</span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-red-700 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: isVisible ? "100%" : "0%" }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Since 2021</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-10 rounded-2xl shadow-lg">
              <Target className="w-12 h-12 text-red-700 mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 text-lg">
                To provide exceptional real estate solutions that combine modern design, strategic locations, 
                and uncompromised quality – creating lasting value for our clients and communities.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-lg">
              <Shield className="w-12 h-12 text-red-700 mb-6" />
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-700 text-lg">
                To be East Africa’s most trusted developer of premium properties, recognized for innovation, 
                integrity, and excellence in every project we deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="luxury-card p-8 text-center">
              <div className="flex justify-center text-red-700 mb-4">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">We uphold the highest ethical standards in every transaction.</p>
            </div>
            <div className="luxury-card p-8 text-center">
              <div className="flex justify-center text-red-700 mb-4">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">We never compromise on quality, from design to delivery.</p>
            </div>
            <div className="luxury-card p-8 text-center">
              <div className="flex justify-center text-red-700 mb-4">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">We build not just homes, but vibrant, secure neighborhoods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS (with scroll-triggered progress bars) */}
      <section ref={sectionRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Our Achievements Since 2021</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Milestones that reflect our dedication and growth
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {achievements.map((ach, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-red-700">{ach.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{ach.label}</h3>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">Progress</span>
                  <span className="text-red-700 font-bold">{progressValues[idx]}{ach.suffix}</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-700 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressValues[idx]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM (placeholder) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Meet Our Leadership</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Passionate experts dedicated to your dream home
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  {/* Placeholder image – replace with actual team photos */}
                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-gray-200 flex items-center justify-center text-gray-400">
                    <Users size={48} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-red-700">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Whether you&apos;re looking for your dream home or a lucrative investment, we&apos;re here to guide you.
          </p>
          <button className="bg-white text-red-700 px-8 py-4 font-semibold text-lg hover:bg-gray-100 transition-colors">
            Contact Us Today
          </button>
        </div>
      </section>
      <Footer/>
    </>
  );
}