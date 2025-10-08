// import React, { useState } from 'react';
// import { CheckCircle, Users, Star, AlertCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { CiSearch, CiFilter } from "react-icons/ci";
// import { AiOutlineExclamationCircle } from "react-icons/ai";
// import { FolderIcon } from '@heroicons/react/24/outline';
// import {  ExternalLink } from 'lucide-react';


// const Groups = () => {
//   const [activeTab, setActiveTab] = useState('paid');

//   const paidGroups = [
//     {

//       id: 1,
//       title: "Elite Options Trading Circle",
//       level: "Advanced",
//       levelColor: "bg-yellow-100 text-yellow-800",
//       members: "156/200 members",
//       rating: "4.9 rating",
//       description: "Exclusive group for advanced options traders with daily market insights and live trade discussions.",
//       price: "₹2,999",
//       period: "/month",
//       features: ["Daily trade alerts", "1-on-1 mentoring", "Live market analysis", "Exclusive strategies"],
//       kyc: "KYC verification required for trading discussions",
//       joined: true,
//       buttonText: "Open Group",
//       buttonStyle: "bg-gray-100 text-gray-700 border border-gray-300",
//       secondaryButton: "Leave Group",
//       secondaryStyle: "text-red-600 border border-red-300"
//     },
//     {
//       id: 2,
//       title: "Technical Analysis Pro Group",
//       level: "Intermediate",
//       levelColor: "bg-blue-100 text-blue-800",
//       members: "89/150 members",
//       rating: "4.7 rating",
//       description: "Master technical analysis with daily chart reviews, pattern recognition, and strategy discussions.",
//       price: "₹1,999",
//       period: "/month",
//       features: ["Chart analysis", "Educational content", "Pattern alerts", "Weekly webinars"],
//       kyc: "KYC verification required for trading discussions",
//       joined: false,
//       buttonText: "Join Group",
//       buttonStyle: "bg-yellow-400 text-black",
//       exclusive: true
//     },
//     {
//       id: 3,
//       title: "Fundamentals & Investment Club",
//       level: "Beginner",
//       levelColor: "bg-green-100 text-green-800",
//       members: "234/300 members",
//       rating: "4.8 rating",
//       description: "Long-term investment strategies, fundamental analysis, and portfolio building discussions.",
//       price: "₹1,499",
//       period: "/month",
//       features: ["Stock research", "Market reports", "Portfolio reviews", "Q&A sessions"],
//       kyc: "KYC verification required for trading discussions",
//       joined: false,
//       buttonText: "Join Group",
//       buttonStyle: "bg-yellow-400 text-black"
//     }
//   ];

//   return (
//     <div className='md:ml-64 px-5'>

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//         <div className="space-y-2 text-center md:text-left">
//           <h2 className="text-3xl md:text-2xl text-gray-900 font-sans">Groups</h2>
//           <p className="text-gray-700 text-sm">Connect with fellow traders and get exclusive insights</p>
//         </div>

//         <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
//           <div className="flex items-center w-full sm:w-64 border border-gray-300 rounded-lg shadow-sm px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-gray-400">
//             <CiSearch className="text-gray-500 mr-2" size={20} />
//             <input type="text" placeholder="Search courses..." className="w-full bg-transparent outline-none text-sm text-gray-800" />
//           </div>
//           <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg shadow transition w-full sm:w-auto">
//             <CiFilter size={20} />
//             <span className="text-sm font-medium">Filter</span>
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center border border-yellow-600 bg-amber-100 rounded-lg p-4 shadow-sm mt-6">
//         <div className="flex items-start gap-3">
//           <AiOutlineExclamationCircle className="text-yellow-600 text-2xl flex-shrink-0 mt-1" />
//           <div>
//             <h1 className="text-lg  text-gray-900">Complete KYC for Trading Groups</h1>
//             <p className="text-sm text-gray-700 mt-1">
//               KYC verification is required to join premium trading groups and participate in buy/sell discussions.
//             </p>
//           </div>
//         </div>
//         <div className="mt-3 md:mt-0">
//           <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-md shadow-sm transition">
//             Complete KYC
//           </button>
//         </div>
//       </div>


//       <div className="flex gap-4 mt-10 mb-6">
//         <button
//           onClick={() => setActiveTab('paid')}
//           className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'paid' ? 'bg-yellow-300 text-gray-600 shadow-md' : ' text-gray-600 border border-gray-300 hover:bg-gray-50'}`}
//         >
//           Paid Groups
//         </button>

//         <button
//           onClick={() => setActiveTab('external')}
//           className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'external' ? 'bg-yellow-300 text-gray-600 shadow-md' : ' text-gray-600 border border-gray-300 hover:bg-gray-50'}`}
//         >
//           External Groups
//         </button>
//       </div>


// {activeTab === 'paid' && (
//   <>
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {paidGroups.map((group) => (
//         <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           {/* --- Card Content --- */}
//           <div className="flex items-start justify-between mb-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <h2 className="text-xl text-gray-900">{group.title}</h2>
//                 {group.joined && (
//                   <div className="flex items-center text-green-600 text-sm">
//                     <CheckCircle className="w-4 h-4 mr-1 fill-current" />Joined
//                   </div>
//                 )}
//               </div>
//               <div className="flex items-center gap-4 mb-3">
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${group.levelColor}`}>
//                   {group.level}
//                 </span>
//                 <div className="flex items-center text-gray-600 text-sm">
//                   <Users className="w-4 h-4 mr-1" />
//                   {group.members}
//                 </div>
//                 <div className="flex items-center text-gray-600 text-sm">
//                   <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
//                   {group.rating}
//                 </div>
//               </div>
//             </div>
//             {group.exclusive && (
//               <div className="text-orange-600 text-xs font-medium">🔒 Exclusive Access</div>
//             )}
//           </div>

//           <p className="text-gray-600 text-sm mb-4 leading-relaxed">{group.description}</p>

//           <div className="mb-4">
//             <p className="text-sm font-medium text-gray-900 mb-2">What's included:</p>
//             <div className="grid grid-cols-2 gap-2">
//               {group.features.map((feature, index) => (
//                 <div key={index} className="flex items-center text-sm text-gray-600">
//                   <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
//                   {feature}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="flex items-start gap-2 mb-6 p-3 bg-orange-50 rounded-lg">
//             <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
//             <p className="text-orange-800 text-xs">{group.kyc}</p>
//           </div>

//           <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//             <div className="flex items-baseline">
//               <span className="text-2xl text-gray-900">{group.price}</span>
//               <span className="text-sm text-gray-500">{group.period}</span>
//             </div>

//             <div className="flex items-center gap-2">
//               {group.secondaryButton && (
//                 <button
//                   className={`px-4 py-2 rounded-lg text-sm ${group.secondaryStyle} hover:bg-red-50 transition-colors`}
//                 >
//                   {group.secondaryButton}
//                 </button>
//               )}
//               <button
//                 className={`px-6 py-2 rounded-lg text-sm ${group.buttonStyle} hover:opacity-90 transition-opacity`}
//               >
//                 {group.buttonText}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>


//     <div className="bg-white rounded-lg border border-gray-200 p-8 mt-10">
//       <h2 className="text-xl text-gray-900 mb-6">Group Guidelines</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//         {/* Do's */}
//         <div>
//           <h3 className="text-lg text-gray-900 mb-2">✅ Do's</h3>
//           <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm">
//             <li>Share valuable market insights</li>
//             <li>Ask relevant questions</li>
//             <li>Respect other members' opinions</li>
//             <li>Follow SEBI guidelines</li>
//             <li>Complete KYC for trading discussions</li>
//           </ul>
//         </div>


//         <div>
//           <h3 className="text-lg text-gray-900 mb-2">❌ Don'ts</h3>
//           <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm">
//             <li>Share unverified tips or rumors</li>
//             <li>Engage in pump and dump activities</li>
//             <li>Spam or post irrelevant content</li>
//             <li>Share personal financial information</li>
//             <li>Violate platform terms of service</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   </>
// )}



//       {activeTab === 'external' && (
//  <div className="min-h-screen bg-gray-50 p-6">

//       <div className="">

//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-2xl  text-gray-900">External Platform Groups</h1>
//           <div className="text-green-600 text-sm font-medium">
//             Free to Join
//           </div>
//         </div>


//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
//           {/* Card 1: CA Stock Market Community */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="text-2xl">📱</div>
//                 <div>
//                   <h3 className="text-lg  text-gray-900">CA Stock Market Community</h3>
//                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
//                     WhatsApp
//                   </span>
//                 </div>
//               </div>
//               <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
//                 Free
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mb-3">
//               <Users className="w-4 h-4 text-gray-500" />
//               <span className="text-sm text-gray-600">2.5K+ members</span>
//             </div>
//             <p className="text-gray-600 text-sm mb-6 leading-relaxed">
//               General discussions about market trends and news updates
//             </p>
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//               <span className="text-xs text-gray-500">External platform - WhatsApp</span>
//               <button className="flex items-center gap-2 px-4 py-2 text-b-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm">
//                 <ExternalLink className="w-4 h-4" />
//                 Join on WhatsApp
//               </button>
//             </div>
//           </div>

//           {/* Card 2: Options Strategy Hub */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="text-2xl">✈️</div>
//                 <div>
//                   <h3 className="text-lg  text-gray-900">Options Strategy Hub</h3>
//                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//                     Telegram
//                   </span>
//                 </div>
//               </div>
//               <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
//                 Free
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mb-3">
//               <Users className="w-4 h-4 text-gray-500" />
//               <span className="text-sm text-gray-600">1.8K+ members</span>
//             </div>
//             <p className="text-gray-600 text-sm mb-6 leading-relaxed">
//               Options trading strategies and market analysis
//             </p>
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//               <span className="text-xs text-gray-500">External platform - Telegram</span>
//               <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm">
//                 <ExternalLink className="w-4 h-4" />
//                 Join on Telegram
//               </button>
//             </div>
//           </div>

//           {/* Card 3: Technical Traders Discord */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="text-2xl">🎮</div>
//                 <div>
//                   <h3 className="text-lg  text-gray-900">Technical Traders Discord</h3>
//                   <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
//                     Discord
//                   </span>
//                 </div>
//               </div>
//               <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
//                 Free
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mb-3">
//               <Users className="w-4 h-4 text-gray-500" />
//               <span className="text-sm text-gray-600">950+ members</span>
//             </div>
//             <p className="text-gray-600 text-sm mb-6 leading-relaxed">
//               Real-time technical analysis and chart discussions
//             </p>
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//               <span className="text-xs text-gray-500">External platform - Discord</span>
//               <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm">
//                 <ExternalLink className="w-4 h-4" />
//                 Join on Discord
//               </button>
//             </div>
//           </div>

//           {/* Card 4: Investment Research Slack */}
//           <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="text-2xl">💼</div>
//                 <div>
//                   <h3 className="text-lg  text-gray-900">Investment Research Slack</h3>
//                   <span className="inline-flex items-center px-2 py-1 rounded text-xs  bg-orange-100 text-orange-800">
//                     Slack
//                   </span>
//                 </div>
//               </div>
//               <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
//                 Free
//               </span>
//             </div>
//             <div className="flex items-center gap-2 mb-3">
//               <Users className="w-4 h-4 text-gray-500" />
//               <span className="text-sm text-gray-600">650+ members</span>
//             </div>
//             <p className="text-gray-600 text-sm mb-6 leading-relaxed">
//               Fundamental analysis and long-term investment discussions
//             </p>
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//               <span className="text-xs text-gray-500">External platform - Slack</span>
//               <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm">
//                 <ExternalLink className="w-4 h-4" />
//                 Join on Slack
//               </button>
//             </div>
//           </div>

//         </div>


//         <div className="bg-white rounded-lg border border-gray-200 p-8">
//           <h2 className="text-xl  text-gray-900 mb-6">About External Groups</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">


//        <div>
//   <h3 className="text-lg text-gray-900 mb-2">What to Expect:</h3>
//   <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm">
//     <li>General market discussions</li>
//     <li>News and updates</li>
//     <li>Community networking</li>
//     <li>Educational content sharing</li>
//   </ul>
// </div>


//             <div>
//               <h3 className="text-lg  text-gray-900 mb-4">Important Note:</h3>
//               <p className="text-sm text-gray-700 leading-relaxed">
//                 External groups are hosted on third-party platforms. Please follow platform guidelines and use discretion when sharing personal information.
//               </p>
//             </div>




            
//           </div>
//         </div>










//         <div className="bg-white rounded-lg border border-gray-200 p-8 mt-10 ">
//           <h2 className="text-xl  text-gray-900 mb-6">Group Guidelines</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">



//        <div>
//   <h3 className="text-lg text-gray-900 mb-2">What to Expect:</h3>
//   <h2 className="pb-1">✅ Do's</h2>
//   <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm">
//     <li> Share valuable market insights</li>
//     <li> Ask relevant questions</li>
//     <li> Respect other members' opinions</li>
//     <li> Follow SEBI guidelines</li>
//     <li> Complete KYC for trading discussions</li>
//   </ul>
// </div>


//             <div>
//            <h3 className="text-lg text-gray-900 mb-2">What to Expect:</h3>
//             <h2 className="pb-1">❌ Don'ts</h2>
//   <ul className="space-y-1 list-disc list-inside text-gray-700 text-sm">
//     <li>Share unverified tips or rumors</li>
//     <li>Engage in pump and dump activities</li>
//     <li>Spam or post irrelevant content</li>
//     <li>Share personal financial information</li>
//     <li>Violate platform terms of service</li>
//   </ul>
//             </div>




            
//           </div>
//         </div>



        
//       </div>
//     </div>



//       )}
//     </div>
//   );
// };

// export default Groups;
