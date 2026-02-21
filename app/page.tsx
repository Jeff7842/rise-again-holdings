"use client";

import "../components/styles/Home.css";
import Image from "next/image";
import Link from "next/link";
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';
import {
  MapPin,
  House,
  Shield,
  Bed,
  Bath,
  Maximize,
  Megaphone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Strategic Location",
    description:
      "Our properties are located in prime areas that are easily accessible from various directions. Reach city centers, airports, and important places easily and quickly.",
  },
  {
    icon: <House className="w-8 h-8" />,
    title: "Modern Luxury Design",
    description:
      "Featuring contemporary and elegant architectural designs. Choose from various property types that suit your taste and needs, from luxury apartments to premium villas.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Guaranteed Security",
    description:
      "Integrated security systems with 24/7 surveillance. Each property features advanced security measures monitored by professional security teams.",
  },
];
const listings = [
  {
    id: "4br-flat-roof-ruiru-mugutha",
    title: "Modern 4-Bedroom Flat Roof Maisonette",
    description:
      "Brand new 4-bedroom all-ensuite flat-roof maisonette in a secure gated community of only 3 units. Features a sunken lounge, open-plan kitchen with pantry, solar hot water, biodigester, electric fence, and parking for 5 cars.",
    location: "Mugutha, Ruiru – Near St. Paul Catholic Church, off Thika Road",
    bedrooms: 4,
    bathrooms: 4,
    washrooms: 1,
    buildingArea: "Approx. 2800 sq ft",
    landSize: "Slightly larger than 40x80 ft",
    price: "KES 14.5M",
    imageUrl:"https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/4bedroom-mugutha.jpeg",
  },

  {
    id: "5br-luxury-home-kamakis",
    title: "Luxury 5-Bedroom All-Ensuite Home",
    description:
      "Newly built 5-bedroom all-ensuite residence with DSQ, family TV room, high-end finishes including gypsum ceilings and porcelain tiles. Located in a secure gated estate just off the Eastern Bypass.",
    location: "Kamakis, Ruiru – Near Eastern Bypass & Thika Superhighway",
    bedrooms: 5,
    bathrooms: 5,
    washrooms: 1,
    buildingArea: "Approx. 4200 sq ft",
    landSize: "50x100 ft",
    price: "KES 27M (Negotiable)",
    imageUrl:"https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Luxury-5-bedroom.jpeg",
  },

  {
    id: "4br-maisonette-kenyatta-road",
    title: "Contemporary 4-Bedroom Maisonette",
    description:
      "Modern 4-bedroom maisonette in a gated community featuring a spacious lounge, separate dining area, open-plan kitchen with granite tops, master bedroom with balcony, and a dedicated prayer room.",
    location: "Kenyatta Road, Juja – 5km off Thika Road",
    bedrooms: 4,
    bathrooms: 4,
    washrooms: 1,
    buildingArea: "Approx. 3000 sq ft",
    landSize: "40x80 ft",
    price: "KES 15M",
    imageUrl:"https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/kenyatta-road.jpeg",
  },

  {
    id: "thome-estate-mixed-development",
    title: "Prime Thome Estate Residential Compound",
    description:
      "High-value residential compound featuring a 5-bedroom all-ensuite maisonette plus an additional 4-bedroom maisonette. Sits on ¾ acre with cabro-paved compound, green area, council water, and premium interior finishes.",
    location: "Thome Estate – Less than 1km from Thika Road (Roasters)",
    bedrooms: 9,
    bathrooms: 9,
    washrooms: 2,
    buildingArea: "Multiple Units",
    landSize: "¾ Acre",
    price: "KES 100M",
    imageUrl:
      "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Hero3.png",
  },
  
];


const faqs = [
  {
    question: "What types of properties does Rise Again Holdings offer?",
    answer:
      "We specialize in luxury cluster housing, premium apartments, executive villas, and commercial properties with modern amenities and strategic locations.",
  },
  {
    question: "How does the investment process work?",
    answer:
      "Our investment process involves property selection, due diligence, acquisition, and management. We provide full transparency and regular updates to our investors.",
  },
  {
    question: "What are the price ranges for your properties?",
    answer:
      "Our properties range from $800,000 to $5M+, catering to various investment levels. Contact us for detailed pricing and available financing options.",
  },
  {
    question: "Where are your properties located?",
    answer:
      "We focus on prime locations in major cities and emerging markets with high growth potential and excellent infrastructure.",
  },
];

export default function Home() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
    <div className="">
    <Navbar />
      <section
        id="home"
        className="relative min-h-[130vh] md:min-h-screen flex items-center px-6"
        style={{
          backgroundImage: `
      linear-gradient(135deg, rgba(135, 206, 235, 0.95) 10%, rgba(255, 255, 255, 0.05) 80%),
      url("https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Hero2.png")
    `,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
        }}
      >
        <div className="container mx-auto px-4 py-20 mt-25 ml-15">
          <div className="max-w-3xl">
            <div className="mb-8">
              <span className="text-[#D2242A] text-xs md:text-[16px] font-semibold uppercase tracking-wider">
                Premium Real Estate
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mt-4 leading-tight">
                More Comfortable.
                <br />
                More Classy.
              </h1>
              <p className="text-xl text-gray-700 mt-6">
                Make your living experience even more memorable.
              </p>
            </div>

            <div className="mt-12  flex flex-col md:flex-row gap-5 w-full text-center">
              <button className="bg-transparent  text-white border-gray-300 border-2 w-full md:w-auto px-4 py-2 md:px-8 md:py-4 text-[16px] md:text-lg font-medium hover:bg-red-700 hover:border-red-700 focus:bg-red-800 focus:border-red-800 focus:scale-[0.98] transition-colors mr-4">
                Find Your Dream Home
              </button>
              <button className="bg-white text-gray-900 w-full md:w-auto px-4 py-2 md:px-8 md:py-4 text-[16px] md:text-lg font-medium border border-gray-300 hover:text-gray-100 hover:border-red-700 hover:bg-red-700 focus:text-gray-100 focus:border-red-800 focus:bg-red-800 focus:scale-[0.98] transition-colors">
                View Listings
              </button>
            </div>

            {/* Stats */}
            <div className="mt-15 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-gray-900">100+</div>
                <div className="text-gray-100 mt-2">Units Ready</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">60K+</div>
                <div className="text-gray-100 mt-2">Satisfied Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">70K+</div>
                <div className="text-gray-100 mt-2">Positive Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              Enjoy Quality Life with Rise Again Holdings
            </h2>
            <p className="text-[16px] lg:text-lg text-gray-700 mb-8">
              Since 2021, Rise Again Holdings has been the right choice for
              those seeking comfortable, safe, and affordable premium
              properties. Through our exclusive cluster concept, residents enjoy
              enhanced privacy and the comfort of living in a beautiful,
              well-maintained, and pristine environment. In addition, we provide
              access to carefully curated, world-class facilities designed to
              elevate everyday living and deliver long-term value.
            </p>

            <div className="mt-12">
              <button className="bg-red-700 text-red-700 text-white px-8 py-3 font-medium hover:bg-red-700 transition-colors">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rise Again Holdings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide exceptional value through strategic investments and
              premium properties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="luxury-card p-8">
                <div className="text-red-700 mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-red-700text-red-700 text-white px-8 py-3 font-medium hover:bg-red-700 transition-colors">
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
      <section id="listings" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Available Premium Listings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our exclusive collection of luxury properties
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {listings.map((listing, index) => (
              <div key={index} className="luxury-card group">
                <div
                  className="h-100 relative bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${listing.imageUrl})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100/20 to-gray-200/20" />

                  <div className="absolute top-4 right-4 bg-red-700 text-white px-3 py-1 font-medium">
                    {listing.price}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{listing.description}</p>

                  <div className="flex items-center text-gray-700 mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-red-800" />
                    <span>{listing.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-2 text-red-700" />
                      <span className="text-gray-700">
                        {listing.bedrooms} Bedrooms
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 mr-2 text-red-700" />
                      <span className="text-gray-700">
                        {listing.bathrooms} Bathrooms
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Maximize className="w-4 h-4 mr-2 text-red-700" />
                      <span className="text-gray-700">
                        {listing.buildingArea}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-700">
                        Land: {listing.landSize}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4 items-center">
                    <button className="text-gray-900 border border-gray-900 text-[16px] sm:text-[16px] md:text-xl px-4 py-2 md:px-6 md:py-2 font-medium hover:text-white hover:border-red-600 hover:bg-red-600 focus:text-gray-200 focus:border-red-800 focus:bg-red-800 focus:scale-[0.99] transition-colors cursor-pointer">
                      <Link  href={`/listings/${listing.id}`} className="btn">
  View Details
</Link >
                    </button>
                    <button className="bg-red-700 text-white px-4 py-2 text-[16px] sm:text-[16px] md:text-xl md:px-6 md:py-2 font-medium hover:bg-red-600 focus:bg-red-800 focus:scale-[0.99] transition-colors cursor-pointer">
                      Schedule Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="bg-white text-gray-900 border border-gray-300 px-8 py-3 font-medium hover:border-red-700 hover:text-red-700 focus:border-red-800 focus:bg-red-800 focus:text-gray-50 focus:scale-[0.98] transition-colors cursor-pointer">
              View All Listings
            </button>
          </div>
        </div>
      </section>
      {/*<section className="py-20 bg-white none">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-700text-red-700/10 rounded-full mb-6">
              <Megaphone className="w-8 h-8 text-red-700" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Have a Property to Sell?
            </h2>

            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Let us help you showcase your property to our premium clientele.
              We specialize in marketing luxury properties to qualified buyers.
            </p>

            <div className="space-y-6 max-w-xl mx-auto">
              <div className="text-left p-6 border border-gray-100 luxury-card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Premium Property Advertisement Service
                </h3>
                <p className="text-gray-600">
                  We provide exclusive marketing solutions for high-end
                  properties, connecting you with serious investors and buyers.
                </p>
              </div>

              <button className="bg-gradient-to-r from-red-700 to-red-900 text-red-100 text-white px-10 py-4 text-l md:text-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl">
                Advertise Your Property With Us
              </button>
            </div>
          </div>
        </div>
      </section>*/}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Find answers to common questions about our services
              </p>
            </div>

            <div className="space-y-4 ">
              {faqs.map((faq, index) => (
                <div key={index} className="luxury-card ">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center"
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                  >
                    <span className="text-lg font-medium text-gray-900 ">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-red-700" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-red-700  text-white px-6 py-3 md:px-8 md:py-3 font-medium hover:bg-red-800 focus:bg-red-800 focus:text-gray-100 focus:scale-[0.98] transition-colors">
                Contact Us for More Information
              </button>
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer/>
    </>
  );
}
