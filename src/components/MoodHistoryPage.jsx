import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Clock, MessageSquare, ArrowLeft, Smile, Frown, Meh, AlertCircle, Sparkles, ShieldAlert, Award, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const StatCard = ({ title, value, icon: Icon, color, glow, trend }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white/[0.03] backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${glow} blur-[60px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

    <div className="relative z-10 flex flex-col items-start gap-4">
      <div className={`p-4 rounded-2xl bg-white/5 ${color} border border-white/10 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black text-white">{value}</h3>
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 ${trend.includes('+') ? 'text-emerald-400' : 'text-slate-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const MoodHistoryPage = () => {
  const navigate = useNavigate();
  const { emotionHistory, therapySessions, user } = useApp();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const emotionIcons = {
    happy: Smile,
    sad: Frown,
    neutral: Meh,
    surprised: Sparkles,
    angry: AlertCircle,
    fear: ShieldAlert,
  };

  const emotionColors = {
    happy: 'text-emerald-400',
    sad: 'text-blue-400',
    neutral: 'text-slate-400',
    surprised: 'text-amber-400',
    angry: 'text-rose-400',
    fear: 'text-purple-400',
  };

  const emotionBgGlows = {
    happy: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]',
    sad: 'shadow-[0_0_20px_rgba(96,165,250,0.2)]',
    neutral: 'shadow-[0_0_20px_rgba(148,163,184,0.2)]',
    surprised: 'shadow-[0_0_20px_rgba(251,191,36,0.2)]',
    angry: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
    fear: 'shadow-[0_0_20px_rgba(192,132,252,0.2)]',
  };

  const getEmotionStats = () => {
    const emotionCounts = emotionHistory.reduce((acc, emotion) => {
      acc[emotion.emotion] = (acc[emotion.emotion] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  const recentEmotions = emotionHistory.slice(0, 10);
  const topEmotions = getEmotionStats();

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-200 p-6 lg:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12 relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <motion.button
              onClick={() => navigate('/emotion-detection')}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-1">
                Mood <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 text-glow-blue">Insights</span>
              </h1>
              <p className="text-slate-500 font-medium">Tracking your mental wellness journey</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-sm font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Detections"
            value={emotionHistory.length}
            icon={TrendingUp}
            color="text-emerald-400"
            glow="bg-emerald-400/20"
            trend="+12%"
          />
          <StatCard
            title="Therapy Sessions"
            value={therapySessions.length}
            icon={MessageSquare}
            color="text-blue-400"
            glow="bg-blue-400/20"
            trend="+5"
          />
          <StatCard
            title="Days Active"
            value={emotionHistory.length > 0 ? Math.ceil((Date.now() - new Date(emotionHistory[emotionHistory.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)) || 1 : 0}
            icon={Calendar}
            color="text-purple-400"
            glow="bg-purple-400/20"
          />
          <StatCard
            title="Avg. Confidence"
            value={`${Math.round((emotionHistory.reduce((sum, e) => sum + e.confidence, 0) / (emotionHistory.length || 1)) * 100)}%`}
            icon={TrendingUp}
            color="text-teal-400"
            glow="bg-teal-400/20"
            trend="Active"
          />
        </div>
      </motion.div>


      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8 relative z-10 px-4 md:px-0">
        {/* Emotion Timeline - Spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10"
        >
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-white">Recent Experience</h2>
            <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">
              View All History
            </button>
          </div>

          {recentEmotions.length > 0 ? (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-4 px-6 pb-4 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5">
                <div className="col-span-2">Emotion / Date</div>
                <div>Confidence</div>
                <div className="text-right">Action</div>
              </div>

              {recentEmotions.map((emotion, index) => {
                const Icon = emotionIcons[emotion.emotion];
                return (
                  <motion.div
                    key={emotion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-4 items-center gap-4 p-6 bg-white/[0.02] hover:bg-white/[0.05] rounded-[1.5rem] border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="col-span-2 flex items-center space-x-6">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${emotionColors[emotion.emotion]} ${emotionBgGlows[emotion.emotion]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-black text-white text-lg capitalize mb-0.5">{emotion.emotion}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {new Date(emotion.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold text-slate-300">{Math.round(emotion.confidence * 100)}%</span>
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden text-slate-400">
                        <div
                          className="h-full bg-current"
                          style={{ width: `${emotion.confidence * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-blue-500/20 transition-all opacity-0 group-hover:opacity-100">
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
              <Clock className="w-16 h-16 text-slate-700 mx-auto mb-6" />
              <p className="text-slate-400 font-bold mb-2">No emotion data yet</p>
              <p className="text-slate-600 text-sm">Start detection to see your history!</p>
            </div>
          )}
        </motion.div>

        {/* Right Column: Insights & Sessions */}
        <div className="space-y-8">
          {/* Emotion Insights Pie-style list */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10"
          >
            <h2 className="text-2xl font-black text-white mb-10">Mood Balance</h2>

            {topEmotions.length > 0 ? (
              <div className="relative">
                {/* Central "Total" display like the donut chart in reference */}
                <div className="flex items-center justify-center mb-10 relative">
                  <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black text-white">{emotionHistory.length}</span>
                  </div>
                  <svg className="absolute w-40 h-40 -rotate-90 pointer-events-none">
                    <circle
                      cx="80" cy="80" r="74"
                      fill="none" strokeWidth="12"
                      strokeDasharray={`${(emotionHistory.length / (emotionHistory.length || 1)) * 465} 465`}
                      className="stroke-blue-500 opacity-20"
                    />
                  </svg>
                </div>

                <div className="space-y-6">
                  {topEmotions.map(([emotion, count], index) => {
                    const percentage = Math.round((count / (emotionHistory.length || 1)) * 100);
                    return (
                      <div key={emotion} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full bg-current ${emotionColors[emotion]}`} />
                          <span className="text-sm font-bold text-slate-400 capitalize group-hover:text-white transition-colors">{emotion}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-black text-white">{percentage}%</span>
                          <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              className={`h-full bg-current ${emotionColors[emotion]}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-40 italic text-slate-500">
                Insights appear as you build data.
              </div>
            )}
          </motion.div>

          {/* Recent Therapy Sessions Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-blue-600/10 to-teal-500/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-blue-500/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white">Sessions</h2>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {therapySessions.length > 0 ? (
              <div className="space-y-4">
                {therapySessions.slice(0, 3).map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group cursor-default"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black text-white text-sm">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {session.category || 'General'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
                        {session.duration}m
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <MessageSquare className="w-4 h-4" />
                      {session.messages.length} messages
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-600 text-sm font-bold mb-1 uppercase tracking-tighter">No Active Sessions</p>
                <p className="text-slate-700 text-[10px] font-medium uppercase tracking-[0.2em]">Start a chat to track progress</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MoodHistoryPage;