import React, { useState, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, BarChart, BookOpen, PlayCircle, ChevronLeft, Video, 
  ChevronDown, CheckCircle2, Star, List, Award, Users, 
  FileText, Globe, Calendar, ShieldCheck, MonitorPlay, Lock
} from 'lucide-react';

// Verify this path matches exactly
import { courseData } from './utils/courseinfo'; 

// --- Sub-Component: Lesson Item ---
const LessonItem = ({ lesson, index, trackId, isLocked }) => {
  const linkClasses = lesson.completed 
    ? "text-slate-500 font-medium line-through" 
    : isLocked 
    ? "text-slate-400 font-medium cursor-not-allowed"
    : "text-slate-700 hover:text-indigo-600 font-medium transition-colors";

  const lessonPath = trackId 
    ? `/track/${trackId}/lesson/${lesson.id}` 
    : `/lesson/${lesson.id}`;

  const content = (
    <>
      <div className={`p-1.5 rounded-md ${
        lesson.completed 
          ? 'bg-slate-100 text-slate-400' 
          : isLocked
          ? 'bg-slate-100 text-slate-300'
          : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
      } transition-colors`}>
        {isLocked ? <Lock size={14} /> : <Video size={14} />}
      </div>
      <span className={linkClasses}>{index}. {lesson.title}</span>
    </>
  );

  return (
    <motion.div 
        initial={{ opacity: 0, x: 10 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.2 }}
        className={`flex items-center justify-between py-3 px-6 transition-colors border-b border-slate-100 last:border-b-0 group ${
          isLocked ? 'opacity-60' : 'hover:bg-slate-50'
        }`}
    >
      {isLocked ? (
        <div className="flex items-center gap-3 flex-1">
          {content}
        </div>
      ) : (
        <Link to={lessonPath} className="flex items-center gap-3 flex-1">
          {content}
        </Link>
      )}
      <span className="text-xs text-slate-400 font-medium flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
        <Clock size={10} /> {lesson.duration}
      </span>
    </motion.div>
  );
};

// --- Sub-Component: Module Accordion ---
const ModuleAccordion = ({ module, index, trackId, isLocked, isFinalExam }) => {
    const moduleId = `module-${index}`; 
    const [isOpen, setIsOpen] = useState(index === 0); 
    const totalLessons = module.lessons.length;
    const completedLessons = module.lessons.filter(l => l.completed).length;
    const progressPercent = (completedLessons / totalLessons) * 100;

    return (
        <div id={moduleId} className={`border-b border-slate-200 last:border-b-0 bg-white first:rounded-t-xl last:rounded-b-xl overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
            <button
                className={`w-full text-left py-5 px-6 flex items-center justify-between transition-all ${
                  isLocked 
                    ? 'cursor-not-allowed bg-slate-50/50' 
                    : isOpen 
                    ? 'bg-slate-50/80' 
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => !isLocked && setIsOpen(!isOpen)}
                disabled={isLocked}
            >
                <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-lg font-extrabold flex items-center justify-center text-sm shrink-0 transition-colors ${
                      isLocked
                        ? 'bg-slate-200 text-slate-400'
                        : completedLessons === totalLessons 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : isFinalExam
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                        {isLocked ? <Lock size={18}/> : completedLessons === totalLessons ? <CheckCircle2 size={18}/> : isFinalExam ? <Award size={18}/> : index + 1}
                    </span>
                    <div>
                        <h3 className={`text-lg font-bold ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>
                          {module.title}
                          {isLocked && <span className="ml-2 text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Locked</span>}
                        </h3>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span>{module.lessons.length} {isFinalExam ? 'Exam' : 'Videos'}</span>
                            {!isLocked && (
                              <>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>{Math.round(progressPercent)}% Completed</span>
                              </>
                            )}
                        </div>
                    </div>
                </div>
                {!isLocked && (
                  <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : 'rotate-0'}`} />
                )}
            </button>

            <AnimatePresence>
                {isOpen && !isLocked && (
                    <motion.div
                        key={moduleId} 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-slate-100"
                    >
                        <div className="divide-y divide-slate-50 bg-white">
                            {module.lessons.map((lesson, i) => (
                                <LessonItem 
                                    key={i} 
                                    lesson={lesson} 
                                    index={`${index + 1}.${i + 1}`} 
                                    trackId={trackId}
                                    isLocked={isLocked}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Component ---
const CourseDetail = () => {
  const { id: courseId, trackId } = useParams();
  const course = courseData[courseId];
  const [activeTab, setActiveTab] = useState('description');

  // SAFETY CHECK
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // --- Dynamic Calculations ---
  const stats = useMemo(() => {
      const allLessons = course.modules.flatMap(m => m.lessons);
      const totalCount = allLessons.length;
      const completedCount = allLessons.filter(l => l.completed).length;
      const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
      
      // Mock calculation for total hours (parsing strings like "10:00")
      const totalMinutes = allLessons.reduce((acc, l) => {
          const [min] = l.duration.split(':').map(Number);
          return acc + (min || 0);
      }, 0);
      const totalHours = (totalMinutes / 60).toFixed(1);

      // Check if all regular modules are completed (for final exam unlock)
      const allModulesCompleted = completedCount === totalCount;

      return { totalCount, completedCount, percentage, totalHours, allModulesCompleted };
  }, [course]);

  // Create Final Exam Module
  const finalExamModule = {
    title: "Final Exam",
    lessons: [
      { id: 'final-exam', title: 'Complete Final Assessment', duration: '60:00', completed: false }
    ]
  };

  // Combine regular modules with final exam
  const allModules = [...course.modules, finalExamModule];
  
  // Navigation Logic
  const backLink = trackId ? `/track/${trackId}` : "/courses";
  const backText = trackId ? "Back to Track" : "All Courses";
  const startLessonId = course.modules[0]?.lessons[0]?.id || 'default';
  const baseLessonPath = trackId ? `/track/${trackId}/lesson` : `/lesson`;
  const linkTarget = `${baseLessonPath}/${startLessonId}`;

  // Tab Content Logic
  const renderTabContent = () => {
      const animation = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };

      switch(activeTab) {
        case 'description':
            return (
                <motion.div {...animation} className="space-y-6">
                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Module Overview</h3>
                        <p className="text-slate-600 leading-relaxed">{course.description}</p>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 size={18} className="text-emerald-600"/> Learning Objectives
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(course.learningObjectives || ['Master the core concepts', 'Build real-world projects', 'Debug effectively', 'Best practices & Architecture']).map((item, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {course.track && (
                      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Award size={18} className="text-indigo-600"/> Part of {course.track}
                        </h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          This module is part of the {course.track} in your internship program. Complete all modules to earn your certification.
                        </p>
                      </div>
                    )}
                </motion.div>
            );
        case 'prerequisites':
            return (
                <motion.div {...animation} className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Requirements</h3>
                    <ul className="space-y-3">
                        {['Basic understanding of programming', 'A computer with internet access', 'No paid software required'].map((req, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-700 bg-white p-3 border border-slate-100 rounded-lg shadow-sm">
                                <MonitorPlay size={20} className="text-indigo-500" />
                                {req}
                            </li>
                        ))}
                    </ul>
                </motion.div>
            );
        case 'instructor':
            return (
                <motion.div {...animation} className="flex items-start gap-6 p-4">
                    <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0 overflow-hidden border-2 border-white shadow-md">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Instructor" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">Dr. Angela Yu</h4>
                        <p className="text-indigo-600 text-sm font-medium mb-2">Senior Developer & Lead Instructor</p>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            I'm a developer with 10+ years of experience teaching millions of students how to code. I focus on making complex topics simple.
                        </p>
                        <div className="flex gap-4 mt-3 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500"/> 4.8 Rating</span>
                            <span className="flex items-center gap-1"><Users size={12} /> 50k+ Students</span>
                        </div>
                    </div>
                </motion.div>
            );
        default: return null;
      }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-8 pt-6 pb-20 px-4 sm:px-6">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 max-w-6xl mx-auto">
        <Link to={backLink} className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-semibold">
          <ChevronLeft size={14} /> {backText}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-bold text-slate-900 line-clamp-1">{course.title}</span>
      </div>

      {/* Hero Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 max-w-6xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <Award size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap gap-3 mb-4">
                {course.track && (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide border border-blue-200">
                    {course.track}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide border border-slate-200">
                  Module {course.moduleNumber || '1'} of {course.totalModules || '8'}
                </span>
                {course.isRequired && (
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wide border border-orange-200">
                    Required
                  </span>
                )}
              </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 max-w-3xl">{course.title}</h1>
            
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-600 border-t border-slate-100 pt-6">
                <span className="flex items-center gap-2"><BookOpen size={18} className="text-indigo-600"/> {course.modules.length} Modules</span>
                <span className="flex items-center gap-2"><Clock size={18} className="text-indigo-600"/> Approx. {stats.totalHours} Hours</span>
                <span className="flex items-center gap-2"><Video size={18} className="text-indigo-600"/> {stats.totalCount} Video Lessons</span>
                {course.difficulty && (
                  <span className="flex items-center gap-2"><BarChart size={18} className="text-indigo-600"/> {course.difficulty}</span>
                )}
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex overflow-x-auto scrollbar-hide border-b border-slate-200 bg-slate-50/50">
                    {['description', 'prerequisites', 'instructor'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)} 
                            className={`px-6 py-4 text-sm font-bold capitalize whitespace-nowrap transition-all relative ${
                                activeTab === tab 
                                ? 'text-indigo-600 bg-white' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                            )}
                        </button>
                    ))}
                </div>
                <div className="p-6 md:p-8">{renderTabContent()}</div>
            </div>

            {/* Syllabus Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <List className="text-indigo-600" /> Course Content
                    </h2>
                    <span className="text-sm font-semibold text-slate-500">{stats.totalCount} Video Lessons</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50">
                    {allModules.map((module, index) => {
                      const isFinalExam = index === allModules.length - 1;
                      const isLocked = isFinalExam && !stats.allModulesCompleted;
                      
                      return (
                        <ModuleAccordion 
                          key={index} 
                          module={module} 
                          index={index} 
                          trackId={trackId}
                          isLocked={isLocked}
                          isFinalExam={isFinalExam}
                        />
                      );
                    })}
                </div>

                {/* Unlock Message */}
                {!stats.allModulesCompleted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3"
                  >
                    <Lock size={20} className="text-purple-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-purple-900 mb-1">Final Exam Locked</h4>
                      <p className="text-sm text-purple-700">Complete all video lessons to unlock the final exam and earn your certificate.</p>
                    </div>
                  </motion.div>
                )}
            </div>

            {/* Module Insights Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                    <BarChart className="text-indigo-600" /> Module Insights
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 size={20} className="text-indigo-600" />
                                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Completion</span>
                            </div>
                            <p className="text-4xl font-extrabold text-slate-900 mb-1">850+</p>
                            <p className="text-sm text-slate-600 font-medium">learners completed</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <Award size={20} className="text-emerald-600" />
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Success</span>
                            </div>
                            <p className="text-4xl font-extrabold text-slate-900 mb-1">94%</p>
                            <p className="text-sm text-slate-600 font-medium">pass rate achieved</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={20} className="text-purple-600" />
                                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Avg. Time</span>
                            </div>
                            <p className="text-4xl font-extrabold text-slate-900 mb-1">{stats.totalHours}h</p>
                            <p className="text-sm text-slate-600 font-medium">to complete</p>
                        </div>
                    </div>
                </div>

                {/* Key Takeaways */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                        <Star className="text-amber-500" /> Key Takeaways
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: BookOpen, title: 'Comprehensive Content', desc: 'Structured learning path with progressive difficulty' },
                            { icon: Video, title: 'Hands-on Practice', desc: 'Real-world examples and practical demonstrations' },
                            { icon: Award, title: 'Skill Validation', desc: 'Earn certificates to showcase your expertise' },
                            { icon: Users, title: 'Mentor Support', desc: '24/7 access to expert guidance and resources' }
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors">
                                    <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                        <Icon size={18} className="text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {[
                        { q: 'How long do I have to complete this module?', a: 'You can progress through the module at your own pace during your internship period. However, we recommend completing it within the suggested timeframe.' },
                        { q: 'What happens if I fail the final exam?', a: 'Don\'t worry! You can retake the final exam after reviewing the material. We want you to succeed and learn.' },
                        { q: 'Will I receive a certificate for this module?', a: 'Yes! Upon completing all videos and passing the final exam, you\'ll earn a module completion certificate. Complete all modules to receive your internship certification.' },
                        { q: 'Can I ask questions during the module?', a: 'Absolutely! Use the discussion forum or reach out to your mentor. We\'re here to support your learning journey.' }
                    ].map((faq, i) => (
                        <div key={i} className="p-5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                            <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
                
                {/* Progress / CTA Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-indigo-100 hover:shadow-2xl hover:shadow-indigo-200 transition-shadow duration-300">
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</p>
                            <p className="text-2xl font-extrabold text-indigo-600">{stats.percentage}%</p>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" 
                                initial={{ width: 0 }} 
                                animate={{ width: `${stats.percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                            />
                        </div>
                    </div>
                    
                    <Link to={linkTarget} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group">
                        {stats.percentage > 0 ? 'Continue Module' : 'Start Module'} 
                        <PlayCircle size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="text-center text-xs text-slate-400 mt-4">Part of Your Internship Program</p>
                </div>

                {/* Course Includes Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4">This module includes:</h4>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm text-slate-600">
                            <Video size={18} className="text-slate-400"/> {stats.totalHours} hours video content
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600">
                            <Award size={18} className="text-slate-400"/> Final exam & certificate
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600">
                            <MonitorPlay size={18} className="text-slate-400"/> Mobile & desktop access
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-600">
                            <Users size={18} className="text-slate-400"/> Mentor support
                        </li>
                    </ul>
                </div>

             </div>
          </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;