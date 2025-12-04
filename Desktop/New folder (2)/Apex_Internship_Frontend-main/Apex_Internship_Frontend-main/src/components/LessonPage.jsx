import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    Video, 
    BookOpen, 
    Clock, 
    PlayCircle,
    ChevronDown,
    CheckCircle2,
    FileText,
    Download,
    MessageSquare,
    Bookmark,
    BarChart3,
    Award,
    AlertCircle,
    ExternalLink
} from 'lucide-react';
import { courseData } from './utils/courseinfo'; 

// --- Sub-Component: Sidebar Lesson Item ---
const SidebarLessonItem = ({ lesson, index, currentLessonId }) => {
    const isActive = lesson.id === currentLessonId;
    const Icon = lesson.completed ? CheckCircle2 : Video;
    
    return (
        <Link 
            to={`/lesson/${lesson.id}`} 
            className={`group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive 
                    ? 'bg-indigo-50 text-indigo-900 shadow-sm'
                    : lesson.completed
                        ? 'bg-emerald-50/50 text-slate-600 hover:bg-emerald-50'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
        >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                isActive 
                    ? 'bg-indigo-600 text-white' 
                    : lesson.completed 
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
            }`}>
                <Icon size={14} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {index}. {lesson.title}
                </p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Clock size={10} strokeWidth={2} /> {lesson.duration}
                </div>
            </div>
        </Link>
    );
};

// --- Sub-Component: Progress Stats ---
const ProgressStats = ({ watchProgress }) => {
    const percentage = Math.round(watchProgress * 100);
    const isComplete = percentage >= 90;
    
    return (
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Watch Progress
                    </span>
                    <span className={`text-sm font-bold ${isComplete ? 'text-emerald-600' : 'text-indigo-600'}`}>
                        {percentage}%
                    </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                        className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>
            {isComplete && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                    <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
                </motion.div>
            )}
        </div>
    );
};

// --- Main Component: LessonPage ---
const LessonPage = () => {
    const { lessonId, trackId } = useParams();
    const [videoUrl, setVideoUrl] = useState(null); 
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [isOpen, setIsOpen] = useState({});
    const [isLoading, setIsLoading] = useState(true); 
    const [watchProgress, setWatchProgress] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Logic to find the lesson and course
    useEffect(() => {
        let foundLesson = null;
        let foundCourse = null;
        let initialOpenState = {};
        
        setIsLoading(true);

        for (const courseKey in courseData) {
            const course = courseData[courseKey];
            let moduleIndex = 0;
            for (const module of course.modules) {
                const lesson = module.lessons.find(l => l.id === lessonId);
                
                if (lesson) {
                    foundLesson = lesson;
                    foundCourse = course;
                    initialOpenState[moduleIndex] = true; 
                    break;
                }
                moduleIndex++;
            }
            if (foundLesson) break;
        }

        setCurrentLesson(foundLesson);
        setCurrentCourse(foundCourse);
        setIsOpen(initialOpenState);
        
        if (foundLesson) {
            console.log(`[SECURE API CALL] Requesting secure URL for lesson ID: ${lessonId}`);
            setVideoUrl(`https://secure-cdn.yourlms.com/stream/${lessonId}?token=jwt12345`);
        } else {
            setVideoUrl(null);
        }
        
        setIsLoading(false); 

    }, [lessonId]);

    const handleVideoProgress = (e) => {
        const video = e.target;
        const currentProgress = video.currentTime / video.duration;
        setWatchProgress(currentProgress);
    };

    const handleVideoEnd = () => {
        const MINIMUM_WATCH_RATIO = 0.90; 

        if (watchProgress >= MINIMUM_WATCH_RATIO) {
            console.log(`LESSON COMPLETE: Lesson ID ${currentLesson.id} marked as finished (Watched ${Math.round(watchProgress * 100)}% > ${MINIMUM_WATCH_RATIO * 100}%).`);
        } else {
            console.warn(`LESSON INCOMPLETE: Video ended but only watched ${Math.round(watchProgress * 100)}%. Minimum ${MINIMUM_WATCH_RATIO * 100}% required.`);
        }
    };

    const handleReportIssue = () => {
        // Redirect to feedback form with lesson context
        const feedbackUrl = `/feedback?lessonId=${lessonId}&courseId=${currentCourse.id}&type=quality`;
        window.location.href = feedbackUrl;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-full bg-slate-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading lesson content...</p>
                </div>
            </div>
        );
    }
    
    if (!currentLesson || !currentCourse) {
        return <Navigate to="/courses" replace />;
    }
    
    const backLink = trackId 
        ? `/track/${trackId}/courses/${currentCourse.id}` 
        : `/courses/${currentCourse.id}`;

    const toggleModule = (index) => {
        setIsOpen(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const currentModule = currentCourse.modules.find(module => 
        module.lessons.some(lesson => lesson.id === currentLesson.id)
    );
    
    if (!currentModule) {
        return <Navigate to="/courses" replace />;
    }

    const currentModuleIndex = currentCourse.modules.findIndex(m => m === currentModule);

    return (
        <div className="flex h-screen bg-slate-50">
            
            {/* Left Sidebar: Course Navigation */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex flex-col"
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <Link 
                        to={backLink} 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors mb-4 group"
                    >
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} /> 
                        Back to Course
                    </Link>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-600" strokeWidth={2} />
                        {currentCourse.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Course Curriculum</p>
                </div>

                {/* Module List */}
                <div className="p-4 space-y-2 flex-1">
                    {currentCourse.modules.map((module, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            {/* Module Header */}
                            <button
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                                onClick={() => toggleModule(index)}
                            >
                                <span className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    {module.title}
                                </span>
                                <ChevronDown 
                                    size={18} 
                                    className={`text-slate-400 transition-transform ${isOpen[index] ? 'rotate-180' : 'rotate-0'}`} 
                                    strokeWidth={2}
                                />
                            </button>

                            {/* Lesson List */}
                            <AnimatePresence>
                                {isOpen[index] && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden bg-slate-50"
                                    >
                                        <div className="p-2 space-y-1">
                                            {module.lessons.map((lesson, i) => (
                                                <SidebarLessonItem 
                                                    key={i} 
                                                    lesson={lesson} 
                                                    index={`${index + 1}.${i + 1}`} 
                                                    currentLessonId={lessonId}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Right Main Content: Video Player and Details */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    
                    {/* Breadcrumb */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-sm text-slate-600 mb-6"
                    >
                        <span className="text-slate-400">Module {currentModuleIndex + 1}</span>
                        <ChevronLeft size={14} className="rotate-180 text-slate-300" />
                        <span className="font-medium text-slate-900">{currentLesson.title}</span>
                    </motion.div>

                    {/* Lesson Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentLesson.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <Clock size={14} strokeWidth={2} /> {currentLesson.duration}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="font-medium">{currentModule.title}</span>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    className={`p-2.5 rounded-lg border transition-colors ${
                                        isBookmarked 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                    title="Bookmark this lesson"
                                >
                                    <Bookmark size={18} strokeWidth={2} fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                                <button 
                                    onClick={handleReportIssue}
                                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium text-sm"
                                    title="Report session quality issue"
                                >
                                    <AlertCircle size={18} strokeWidth={2} />
                                    Report Issue
                                    <ExternalLink size={14} strokeWidth={2} className="text-slate-400" />
                                </button>
                            </div>
                        </div>
                        
                        <ProgressStats watchProgress={watchProgress} />
                    </motion.div>

                    {/* Video Player */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative aspect-video bg-slate-900 rounded-xl shadow-2xl mb-8 overflow-hidden border border-slate-200"
                    >
                        {videoUrl ? (
                            <video 
                                src={videoUrl} 
                                controls 
                                autoPlay 
                                controlsList="nodownload"
                                disablePictureInPicture
                                onContextMenu={(e) => e.preventDefault()}
                                className="w-full h-full object-cover"
                                onTimeUpdate={handleVideoProgress} 
                                onEnded={handleVideoEnd}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <div className="text-center">
                                    <PlayCircle size={64} className="text-indigo-400 animate-pulse mx-auto mb-4" strokeWidth={1.5} />
                                    <p className="text-lg font-medium">Loading secure video stream...</p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Tabs Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Overview Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <FileText size={16} className="text-indigo-600" strokeWidth={2} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Lesson Overview</h3>
                            </div>
                            <p className="text-slate-700 leading-relaxed mb-4">
                                This lesson delves into the practical application of {currentLesson.title.toLowerCase()}. We will cover key concepts such as data integrity, non-repudiation, and authentication methods. The hands-on section involves setting up a virtual lab environment to practice secure configuration techniques.
                            </p>
                            
                            {/* Key Takeaways */}
                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Key Takeaways</h4>
                                <ul className="space-y-2 text-sm text-slate-700">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" strokeWidth={2} />
                                        <span>Understand core security principles and best practices</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" strokeWidth={2} />
                                        <span>Apply techniques in real-world scenarios</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" strokeWidth={2} />
                                        <span>Hands-on practice with industry-standard tools</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Resources Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <Download size={16} className="text-emerald-600" strokeWidth={2} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Resources & Materials</h3>
                            </div>
                            <div className="space-y-2">
                                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left group">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-slate-600" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Lesson Slides (PDF)</p>
                                            <p className="text-xs text-slate-500">2.4 MB</p>
                                        </div>
                                    </div>
                                    <Download size={16} className="text-slate-400 group-hover:text-indigo-600" strokeWidth={2} />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left group">
                                    <div className="flex items-center gap-3">
                                        <FileText size={18} className="text-slate-600" strokeWidth={2} />
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">Lab Exercise Files</p>
                                            <p className="text-xs text-slate-500">1.8 MB</p>
                                        </div>
                                    </div>
                                    <Download size={16} className="text-slate-400 group-hover:text-indigo-600" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;