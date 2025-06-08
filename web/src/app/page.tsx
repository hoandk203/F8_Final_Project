import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LoopIcon from '@mui/icons-material/Loop';
import VerifiedIcon from '@mui/icons-material/Verified';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import Header from '@/components/Header';
import type { Metadata } from 'next';
import React from 'react';
import { getMaterialsData } from '@/lib/materials';

export const metadata: Metadata = {
  title: "Scraplan - Scrap Collection Platform",
  description: "Maximize your scrap profits with Scraplan. Get best market rates for waste collection, connect with reliable drivers, and streamline your scrap business with our smart technology platform.",
  openGraph: {
    title: "Scraplan - Maximize Your Scrap Profits with Smart Waste Management",
    description: "Join Scraplan to streamline scrap collection, get best market rates, and connect with reliable drivers. All-in-one platform for waste management.",
    url: "https://scraplan.com",
    images: [
      {
        url: '/og-home-image.png',
        width: 1200,
        height: 630,
        alt: 'Scraplan Home - Smart Waste Management Platform',
      }
    ],
  }
};

export default async function Home() {
  // Fetch materials data server-side
  const materials = await getMaterialsData();
  return (
    <div className="root-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="flex items-center justify-center w-full bg-white py-10 sm:py-16 lg:py-20 relative px-4 sm:px-8 lg:px-20">
          <img className="absolute top-0 left-0 -z-1 right-0 object-cover w-full h-full opacity-50" alt="Background pattern for Scraplan waste management hero section" src="/images/pattern_background.png" />
          <div className="flex flex-col w-full max-w-7xl gap-10 sm:gap-16 lg:gap-20 z-[10]">
            <div className="flex flex-col w-full gap-6 sm:gap-8 items-start">
              <div className="flex flex-col gap-4 sm:gap-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[76px] font-extrabold not-italic leading-tight lg:leading-[80px] tracking-[-1px] lg:tracking-[-2px] font-lato text-neutral-1">
                  Maximize your scrap profits
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-[13px] relative">
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[76px] font-extrabold not-italic leading-tight lg:leading-[80px] tracking-[-1px] lg:tracking-[-2px] font-lato text-neutral-1">
                    with
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[76px] font-extrabold not-italic leading-tight lg:leading-[80px] tracking-[-1px] lg:tracking-[-2px] font-lato bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    waste management.
                  </p>
                  <div className="absolute py-1 px-2 sm:py-[2px] sm:px-3 rounded-[8px] bg-orange-500 left-0 sm:left-[130px] rotate-[-7.169deg] -top-1 sm:-top-2">
                    <p className="text-sm sm:text-lg lg:text-[24px] not-italic font-semibold leading-6 sm:leading-8 font-lato text-white">Smart</p>
                  </div>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-medium not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1 max-w-2xl">
                Join Scraplan to streamline your scrap collection, get the best market rates, and connect with reliable drivers – all in one platform.
              </p>
              <a href="/store-register" className="cursor-pointer px-5 py-3 gap-2 justify-center items-center flex flex-row rounded-[8px] bg-[#f9762a] hover:bg-[#e6691f] transition-colors shadow-lg">
                <p className="text-base sm:text-lg font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-white">Register your store</p>
                <ChevronRightIcon className="text-white w-5 h-5" />
              </a>
            </div>
            <div className="w-full">
              <video className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[653px] object-cover rounded-[16px] shadow-2xl" autoPlay loop playsInline muted>
                <source src="/video_home.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-10 sm:py-16 lg:py-20 bg-gray-50 items-center justify-center flex px-4 sm:px-8 lg:px-20">
          <div className="flex flex-col gap-8 sm:gap-10 lg:gap-12 items-center w-full max-w-7xl justify-center">
            <div className="w-full max-w-2xl flex flex-col gap-4 sm:gap-6 items-center justify-center relative">
              <div className="absolute py-1 px-2 sm:py-[2px] sm:px-3 rounded-[8px] bg-orange-500 -top-2 sm:-top-[10px] right-4 sm:right-[62px] rotate-[10.29deg]">
                <p className="text-sm sm:text-lg lg:text-[24px] not-italic font-semibold leading-6 sm:leading-8 font-lato text-white">For all</p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-neutral-1 text-center">
                Our services
              </h2>
              <p className="text-lg sm:text-xl font-medium not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1 text-center">
                A powerful system built for Scrap collection stores
              </p>
            </div>
            
            {/* Service Tabs */}
            <div className="flex items-center p-1 sm:p-[6px] rounded-full bg-orange-100 max-w-md overflow-x-auto">
              <button className="py-2 px-4 sm:py-[6px] sm:px-6 gap-2 sm:gap-3 flex flex-row items-center rounded-full transition-colors whitespace-nowrap">
                <p className="text-neutral-1 not-italic leading-6 sm:leading-7 font-lato font-medium text-sm sm:text-base">For B2B</p>
              </button>
              <button className="py-2 px-4 sm:py-[6px] sm:px-6 gap-2 sm:gap-3 flex flex-row items-center rounded-full transition-colors whitespace-nowrap">
                <p className="text-neutral-1 not-italic leading-6 sm:leading-7 font-lato font-medium text-sm sm:text-base">For B2C</p>
              </button>
              <button className="py-2 px-4 sm:py-[6px] sm:px-6 gap-2 sm:gap-3 flex flex-row items-center rounded-full transition-colors whitespace-nowrap">
                <p className="text-neutral-1 not-italic leading-6 sm:leading-7 font-lato font-medium text-sm sm:text-base">Govt/NGO's</p>
              </button>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
              <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 items-center bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <img alt="Scrap collection service illustration showing waste management process" className="w-40 h-40 sm:w-48 sm:h-48 lg:w-[260px] lg:h-[260px] object-contain" src="/images/image_service_1.png" />
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">Scrap Collection</h3>
                  <p className="text-base sm:text-lg font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-2">
                    Seamlessly integrating effective alternative models of monitoring
                  </p>
                  {/* <button className="flex flex-row gap-1 items-center hover:gap-2 transition-all group">
                    <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-[#f9762a] group-hover:text-[#e6691f]">Learn more</p>
                    <ChevronRightIcon className="text-[#f9762a] group-hover:text-[#e6691f] w-4 h-4" />
                  </button> */}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 items-center bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <img alt="B2C waste management service for consumers and households" className="w-40 h-40 sm:w-48 sm:h-48 lg:w-[260px] lg:h-[260px] object-contain" src="/images/image_service_2.png" />
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">For B2C</h3>
                  <p className="text-base sm:text-lg font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-2">
                    Seamlessly integrating effective alternative models of monitoring
                  </p>
                  {/* <button className="flex flex-row gap-1 items-center hover:gap-2 transition-all group">
                    <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-[#f9762a] group-hover:text-[#e6691f]">Learn more</p>
                    <ChevronRightIcon className="text-[#f9762a] group-hover:text-[#e6691f] w-4 h-4" />
                  </button> */}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 items-center bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-1">
                <img alt="Government and NGO waste management solutions for institutional clients" className="w-40 h-40 sm:w-48 sm:h-48 lg:w-[260px] lg:h-[260px] object-contain" src="/images/image_service_3.png" />
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">For Govt/NGO's</h3>
                  <p className="text-base sm:text-lg font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-2">
                    Seamlessly integrating effective alternative models of monitoring
                  </p>
                  {/* <button className="flex flex-row gap-1 items-center hover:gap-2 transition-all group">
                    <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-[#f9762a] group-hover:text-[#e6691f]">Learn more</p>
                    <ChevronRightIcon className="text-[#f9762a] group-hover:text-[#e6691f] w-4 h-4" />
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="flex w-full bg-white py-10 sm:py-16 lg:py-20 items-center justify-center px-4 sm:px-8 lg:px-20">
          <div className="relative w-full max-w-7xl py-8 sm:py-10 lg:py-10 px-6 sm:px-12 lg:px-20 rounded-[12px] gap-8 sm:gap-10 lg:gap-10 flex flex-col lg:flex-row bg-orange-50">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 z-10 relative">
              <div className="flex-1 flex-col flex gap-3 sm:gap-4 items-start">
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-1 h-6 bg-orange-500 rounded-r-full"></div>
                  <p className="text-lg sm:text-xl font-bold not-italic !leading-8 tracking-[-0.5px] font-lato text-neutral-1">Carbon Footprint</p>
                </div>
                <p className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-orange-500">50</p>
                <p className="text-base sm:text-lg font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-1">tons of CO₂e have been recycled by Scrap Plan to date.</p>
              </div>
              <div className="flex-1 flex-col flex gap-3 sm:gap-4 items-start">
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-1 h-6 bg-orange-500 rounded-r-full"></div>
                  <p className="text-lg sm:text-xl font-bold not-italic !leading-8 tracking-[-0.5px] font-lato text-neutral-1">Charity</p>
                </div>
                <p className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-orange-500">100</p>
                <p className="text-base sm:text-lg font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-1">million INR has been donated to charities in India.</p>
              </div>
            </div>
            <img alt="Environmental impact visualization showing carbon footprint and charity statistics" className="absolute bottom-0 right-0 w-64 h-48 sm:w-80 sm:h-60 lg:w-[457px] lg:h-[337px] object-contain opacity-20 lg:opacity-100" src="/images/image_static_1.png" />
          </div>
        </section>

        {/* Pricing Section */}
        <section className="w-full py-10 sm:py-16 lg:py-20 bg-orange-50 flex items-center justify-center px-4 sm:px-8 lg:px-20">
          <div className="w-full max-w-7xl gap-8 sm:gap-10 lg:gap-12 flex flex-col items-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-neutral-1 text-center">
              Best prices, transparent
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6 w-full">
              {materials.map((item, index) => (
                <div key={index} className="p-4 sm:p-6 flex-col flex gap-4 sm:gap-6 rounded-[8px] bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-row gap-1 items-end">
                      <p className="text-lg sm:text-xl lg:text-[24px] font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-[#42b3b5]">${item.unitprice}</p>
                      <p className="text-sm sm:text-base lg:text-[18px] font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-1">/KG</p>
                    </div>
                    <p className="text-base sm:text-lg font-bold not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-1">{item.material_name}</p>  
                  </div>
                </div>
              ))}
            </div>
            {/* <button className="px-6 py-3 sm:px-8 sm:py-4 gap-2 justify-center items-center flex flex-row rounded-[8px] bg-[#f9762a] hover:bg-[#e6691f] transition-colors shadow-lg">
              <p className="text-base sm:text-lg font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-white">View all rates</p>
              <ChevronRightIcon className="text-white w-5 h-5" />
            </button> */}
          </div>
        </section>

        {/* Solutions Section */}
        <section className="bg-white flex items-center justify-center w-full py-10 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-20">
          <div className="flex flex-col w-full max-w-7xl gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className="flex flex-col gap-4 sm:gap-6 items-center text-center">
              <div className="py-1 px-2 sm:py-[2px] sm:px-3 rounded-[8px] bg-orange-500">
                <p className="text-sm sm:text-lg lg:text-[24px] not-italic font-semibold leading-6 sm:leading-8 font-lato text-white">Our solutions</p>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-neutral-1">
                What makes<br className="sm:hidden" /><span className="hidden sm:inline"> </span>Scrap Plan Different?
              </h2>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
                {[
                  { 
                    title: "Real-time", 
                    desc: "Real-time Scrap Collection Management – Easily schedule pickups and track drivers", 
                    bg: "rgb(225, 250, 216)", 
                    icon: <WatchLaterIcon />,
                    iconColor: "rgb(116, 199, 86)"
                  },
                  { 
                    title: "Best Prices", 
                    desc: "Best Market Prices – Get accurate, real-time scrap rates", 
                    bg: "rgb(230, 246, 254)", 
                    icon: <ReceiptLongIcon/>,
                    iconColor: "rgb(81, 169, 212)"
                  },
                  { 
                    title: "Seamless Operations", 
                    desc: "Focus on growing your store while Scrap Plan manages logistics", 
                    bg: "rgb(253, 231, 235)", 
                    icon: <LoopIcon/>,
                    iconColor: "rgb(224, 92, 116)"
                  },
                  { 
                    title: "Reliability", 
                    desc: "Reliable Driver Network – Vendors assign drivers efficiently to ensure timely pickups", 
                    bg: "rgb(253, 233, 215)", 
                    icon: <VerifiedIcon/>,
                    iconColor: "rgb(231, 156, 91)"
                  },
                  { 
                    title: "Transparency", 
                    desc: "Transparent Earnings Dashboard – Track revenue and profit-sharing with vendors", 
                    bg: "rgb(229, 253, 253)", 
                    icon: <ViewQuiltIcon/>,
                    iconColor: "rgb(86, 209, 209)"
                  }
                ].map((solution, index) => (
                  <div key={index} className={`flex flex-col border border-neutral-200 rounded-[8px] p-4 sm:p-6 gap-3 sm:gap-4 items-start hover:shadow-lg transition-shadow ${index === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                    <div className="p-2 rounded-[8px]" style={{ background: solution.bg }}>
                      <div className="w-6 h-6" style={{ color: solution.iconColor }}>
                        {solution.icon}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                      <h3 className="text-lg sm:text-xl lg:text-[24px] font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">{solution.title}</h3>
                      <p className="text-sm sm:text-base lg:text-[18px] font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-2">{solution.desc}</p>
                    </div>
                  </div>
                ))}
                <img alt="Scraplan waste management solution features overview" className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-[8px] sm:col-span-2 lg:col-span-1" src="/images/image_solution_1.png" />
              </div>
              <img alt="Scraplan technology platform interface showcasing smart waste management tools" className="w-full lg:w-80 xl:w-[373px] h-64 sm:h-80 lg:h-auto rounded-[8px] object-cover" src="/images/image_solution_2.png" />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-gray-50 py-10 sm:py-16 lg:py-20 items-center justify-center flex px-4 sm:px-8 lg:px-20 w-full">
          <div className="w-full max-w-7xl gap-8 sm:gap-10 lg:gap-12 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-4 sm:gap-6 items-center relative text-center">
              <div className="relative">
                <div className="absolute py-1 px-2 sm:py-[2px] sm:px-3 rounded-[8px] bg-orange-500 rotate-[-8.234deg] -left-8 sm:-left-16 -top-6 sm:-top-7">
                  <p className="text-sm sm:text-lg lg:text-[24px] not-italic font-semibold leading-6 sm:leading-8 font-lato text-white">Our team</p>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-neutral-1">
                  Director's Profiles
                </h2>
              </div>
              <p className="text-lg sm:text-xl font-medium not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1 max-w-4xl">
                Scraplan's team comprises experienced professionals from diverse backgrounds, including waste management, technology, and business. Our founders bring a wealth of experience and have a shared vision for creating a sustainable ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
              {[
                { name: "Mr. Nithin Karnati", role: "Co-Founder & CTO", avatar: "/images/image_avatar_1.png" },
                { name: "Mr. Chethan K C", role: "Co-Founder & CTO", avatar: "/images/image_avatar_2.png" },
                { name: "Mr. K.Venkatramana Reddy", role: "Director", avatar: "/images/image_avatar_3.png" }
              ].map((member, index) => (
                <div key={index} className="bg-white rounded-xl p-6 sm:p-8 items-center justify-center flex flex-col gap-4 sm:gap-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-3 sm:p-4 rounded-full bg-orange-50">
                    <img alt={`Professional headshot of ${member.name}, ${member.role} at Scraplan`} className="w-32 h-32 sm:w-40 sm:h-40 lg:w-[160px] lg:h-[160px] object-cover rounded-full" src={member.avatar} />
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3 items-center justify-center text-center">
                    <h3 className="text-xl sm:text-2xl font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">{member.name}</h3>
                    <p className="text-base sm:text-lg font-normal not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-2">{member.role}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-4 items-center justify-center text-center">
                    <p className="text-sm sm:text-base font-normal not-italic leading-5 sm:leading-6 tracking-[-0.5px] font-lato text-neutral-3 line-clamp-3">
                      With a passion for environmental sustainability, bringing a unique blend of technical and business expertise to drive innovative solutions for waste management challenges.
                    </p>
                    <button className="flex flex-row items-center justify-center gap-1 hover:gap-2 transition-all group">
                      <p className="text-base font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-[#f9762a] group-hover:text-[#e6691f]">See more</p>
                      <ChevronRightIcon className="text-[#f9762a] group-hover:text-[#e6691f] w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        {/* <section className="py-10 sm:py-16 lg:py-20 flex w-full bg-white items-center justify-center flex-col gap-8 sm:gap-10 lg:gap-12 px-4 sm:px-8 lg:px-20">
          <div className="flex flex-col gap-4 sm:gap-6 items-center justify-center text-center">
            <div className="py-1 px-2 sm:py-[2px] sm:px-3 rounded-[8px] bg-orange-500">
              <p className="text-sm sm:text-lg lg:text-[24px] not-italic font-semibold leading-6 sm:leading-8 font-lato text-white">Contact us</p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] font-extrabold not-italic leading-tight lg:leading-[68px] tracking-[-1px] font-lato text-neutral-1">
              We are here 24/7 to help you out
            </h2>
          </div>
          
          <form className="w-full max-w-4xl py-6 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-20 items-start rounded-[12px] overflow-hidden bg-orange-50 relative">
            <div className="flex flex-col gap-4 sm:gap-6 z-[10] relative">
              <h3 className="text-xl sm:text-2xl font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">Request demo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="border-b border-b-neutral-4">
                  <input 
                    placeholder="Name" 
                    className="focus:outline-none bg-transparent py-3 sm:py-4 w-full text-neutral-1 placeholder-neutral-3 text-base font-semibold font-lato leading-6 tracking-normal focus:border-orange-500 transition-colors" 
                  />
                </div>
                <div className="border-b border-b-neutral-4">
                  <input 
                    placeholder="Company" 
                    className="focus:outline-none bg-transparent py-3 sm:py-4 w-full text-neutral-1 placeholder-neutral-3 text-base font-semibold font-lato leading-6 tracking-normal focus:border-orange-500 transition-colors" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="border-b border-b-neutral-4">
                  <input 
                    placeholder="Email" 
                    type="email"
                    className="focus:outline-none bg-transparent py-3 sm:py-4 w-full text-neutral-1 placeholder-neutral-3 text-base font-semibold font-lato leading-6 tracking-normal focus:border-orange-500 transition-colors" 
                  />
                </div>
                <div className="border-b border-b-neutral-4">
                  <input 
                    placeholder="Phone" 
                    type="tel"
                    className="focus:outline-none bg-transparent py-3 sm:py-4 w-full text-neutral-1 placeholder-neutral-3 text-base font-semibold font-lato leading-6 tracking-normal focus:border-orange-500 transition-colors" 
                  />
                </div>
              </div>
              
              <div className="border-b border-b-neutral-4">
                <textarea 
                  placeholder="Content" 
                  className="focus:outline-none bg-transparent py-3 sm:py-4 w-full text-neutral-1 placeholder-neutral-3 text-base font-semibold font-lato leading-6 tracking-normal resize-none overflow-hidden focus:border-orange-500 transition-colors" 
                  rows={4}
                ></textarea>
              </div>
              
              <button className="px-6 py-3 sm:px-8 sm:py-4 gap-2 justify-center items-center flex flex-row rounded-[8px] bg-[#f9762a] hover:bg-[#e6691f] transition-colors shadow-lg w-full sm:w-auto">
                <p className="text-base sm:text-lg font-bold not-italic leading-6 tracking-[-0.08px] font-lato text-white">Submit request</p>
              </button>
              
              <p className="text-sm sm:text-base font-normal not-italic leading-5 sm:leading-6 tracking-[-0.5px] font-lato text-neutral-2 text-center sm:text-left">
                By continuing, you agree to our User Terms of Service and Customer Terms of Service.
              </p>
            </div>
          </form>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="bg-[#F4F4F5] py-8 sm:py-10 lg:py-12 w-full flex items-center justify-center px-4 sm:px-8 lg:px-20">
        <div className="w-full max-w-7xl gap-8 sm:gap-10 lg:gap-12 flex flex-col">
          <div className="w-full flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-[118px]">
            <div className="flex flex-col w-full lg:w-[275px] gap-4 sm:gap-6 items-start">
              <img alt="image_logo" src="/logo.png" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[98px] lg:h-[82px] object-cover" />
              <div className="flex flex-col gap-2 sm:gap-3 items-start">
                <h3 className="text-xl sm:text-2xl font-bold not-italic leading-7 sm:leading-8 tracking-[-0.5px] font-lato text-neutral-1">Scraplan</h3>
                <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-2">
                  Scraplan – Simplify scrap collection with top rates & trusted drivers.
                </p>
              </div>
              <button className="px-4 py-3 sm:px-6 sm:py-4 gap-2 justify-center items-center flex flex-row rounded-[8px] bg-neutral-1 hover:bg-neutral-800 transition-colors w-full sm:w-auto">
                <p className="text-sm sm:text-base font-bold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-white">Contact sales</p>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row flex-1 gap-6 sm:gap-8 lg:gap-5">
              <div className="flex flex-col gap-4 items-start flex-1">
                <h4 className="text-lg font-bold not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-1">Company</h4>
                <div className="flex flex-col gap-1">
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="/">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">Home</p>
                  </a>
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="/rates">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">Scrap Rates</p>
                  </a>
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="/blogs">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">Blogs</p>
                  </a>
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="/career">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">Career</p>
                  </a>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 items-start flex-1">
                <h4 className="text-lg font-bold not-italic leading-6 sm:leading-7 tracking-[-0.5px] font-lato text-neutral-1">Follow us</h4>
                <div className="flex flex-col gap-1">
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="#">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">Facebook</p>
                  </a>
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="#">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">LinkedIn</p>
                  </a>
                  <a className="py-2 sm:py-3 hover:text-orange-500 transition-colors" href="#">
                    <p className="text-sm sm:text-base font-semibold not-italic leading-5 sm:leading-6 tracking-[-0.08px] font-lato text-neutral-1">Discord</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full pt-4 sm:pt-6 border-t border-t-neutral-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 text-center sm:text-left">
              <p className="text-sm sm:text-base font-normal not-italic leading-5 sm:leading-6 tracking-[-0.5px] font-lato text-neutral-2 hover:text-orange-500 transition-colors cursor-pointer">Privacy Policy</p>
              <p className="text-sm sm:text-base font-normal not-italic leading-5 sm:leading-6 tracking-[-0.5px] font-lato text-neutral-2 hover:text-orange-500 transition-colors cursor-pointer">Term & Conditions</p>
            </div>
            <p className="text-sm sm:text-base font-normal not-italic leading-5 sm:leading-6 tracking-[-0.5px] font-lato text-neutral-3 text-center sm:text-right">
              © 2024 Scraplan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
