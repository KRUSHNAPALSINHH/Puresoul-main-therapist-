import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, Calendar, Clock, MessageSquare, Heart, Brain,
  Activity, Target, Award, ArrowLeft, Smile, Frown, Meh,
  AlertCircle, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Sparkles, ShieldAlert, Ticket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useCredits } from '../context/CreditContext.jsx';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, emotionHistory, therapySessions } = useApp();
  const { credits } = useCredits();

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

  const DefaultIcon = Brain;

  const emotionColors = {
    happy: '#34d399', // emerald-400
    sad: '#60a5fa',   // blue-400
    neutral: '#94a3b8', // slate-400
    surprised: '#fbbf24', // amber-400
    angry: '#f43f5e',   // rose-400
    fear: '#c084fc',    // purple-400
  };

  const defaultColor = '#94a3b8';

  const emotionColorsTailwind = {
    happy: 'text-emerald-400',
    sad: 'text-blue-400',
    neutral: 'text-slate-400',
    surprised: 'text-amber-400',
    angry: 'text-rose-400',
    fear: 'text-purple-400',
  };

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!emotionHistory) return {
      emotionDistribution: [], dailyTrends: [], weeklyAverages: [], sessionDurations: [],
      wellnessScore: 0, totalEmotions: 0, totalSessions: 0, averageSessionDuration: 0,
      mostFrequentEmotion: 'N/A', totalCreditsUsed: 0, totalCreditsPurchased: 0
    };

    const now = new Date();
    const last7Days = subDays(now, 7);

    // Emotion distribution
    const emotionCounts = emotionHistory.reduce((acc, emotion) => {
      const type = emotion.emotion || 'neutral';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const emotionDistribution = Object.entries(emotionCounts).map(([emotion, count]) => ({
      name: emotion,
      value: count,
      color: emotionColors[emotion] || defaultColor,
    }));

    // Daily emotion trends (last 7 days)
    const dailyTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayEmotions = emotionHistory.filter(emotion => {
        try {
          const timestamp = new Date(emotion.timestamp);
          return isWithinInterval(timestamp, { start: dayStart, end: dayEnd });
        } catch (e) {
          return false;
        }
      });

      const dayData = {
        date: format(date, 'MMM dd'),
        total: dayEmotions.length,
      };

      // Count each emotion for this day
      Object.keys(emotionColors).forEach(emotion => {
        dayData[emotion] = dayEmotions.filter(e => e.emotion === emotion).length;
      });

      dailyTrends.push(dayData);
    }

    // Weekly emotion averages
    const weeklyEmotions = emotionHistory.filter(emotion => {
      try {
        const timestamp = new Date(emotion.timestamp);
        return isWithinInterval(timestamp, { start: last7Days, end: now });
      } catch (e) {
        return false;
      }
    });

    const weeklyAverages = Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: Math.round((count / (emotionHistory.length || 1)) * 100),
      weeklyCount: weeklyEmotions.filter(e => e.emotion === emotion).length,
    })).sort((a, b) => b.count - a.count);

    // Therapy session analytics
    const sessionDurations = (therapySessions || []).map(session => {
      try {
        return {
          date: format(new Date(session.date), 'MMM dd'),
          duration: session.duration || 0,
          messages: (session.messages || []).length,
        };
      } catch (e) {
        return { date: 'N/A', duration: 0, messages: 0 };
      }
    });

    // Wellness score calculation
    const positiveEmotions = ['happy'];
    const neutralEmotions = ['neutral', 'surprised'];

    const positiveCount = emotionHistory.filter(e => positiveEmotions.includes(e.emotion)).length;
    const neutralCount = emotionHistory.filter(e => neutralEmotions.includes(e.emotion)).length;

    const wellnessScore = emotionHistory.length > 0
      ? Math.round(((positiveCount * 2 + neutralCount * 1) / (emotionHistory.length * 2)) * 100)
      : 0;

    return {
      emotionDistribution,
      dailyTrends,
      weeklyAverages,
      sessionDurations,
      wellnessScore,
      totalEmotions: emotionHistory.length,
      totalSessions: (therapySessions || []).length,
      averageSessionDuration: (therapySessions || []).length > 0
        ? Math.round(therapySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / therapySessions.length)
        : 0,
      mostFrequentEmotion: weeklyAverages[0]?.emotion || 'neutral',
      totalCreditsUsed: (user?.total_credits_purchased || 0) + 12 - (credits || 0),
      totalCreditsPurchased: user?.total_credits_purchased || 0
    };
  }, [emotionHistory, therapySessions, user, credits]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, glow }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${glow || 'bg-white/5'} blur-[60px] rounded-full translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

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
          {subtitle && <p className="text-[10px] text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group ${className}`}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-white/5 text-blue-400 border border-white/10">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
        </div>
      </div>
      {children}
    </motion.div>
  );

  if (!user) return null;

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
                Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 text-glow-blue">Dashboard</span>
              </h1>
              <p className="text-slate-500 font-medium">Track your emotional wellness journey</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Wellness Score</p>
                <p className="text-xl font-black">{analytics.wellnessScore}%</p>
              </div>
            </div>
          </div>
        </div>


        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Ticket}
            title="Available Energy"
            value={`${credits} Credits`}
            subtitle="Valid for all sessions"
            color="text-amber-400"
            glow="bg-amber-400/20"
          />
          <StatCard
            icon={Activity}
            title="Conversations"
            value={analytics.totalEmotions}
            subtitle="All time interactions"
            color="text-blue-400"
            glow="bg-blue-400/20"
            trend="+12%"
          />
          <StatCard
            icon={Target}
            title="Wellness Index"
            value={`${analytics.wellnessScore}%`}
            subtitle="Emotional balance score"
            color="text-emerald-400"
            glow="bg-emerald-400/20"
            trend="+5%"
          />
          <StatCard
            icon={MessageSquare}
            title="Therapy Sessions"
            value={analytics.totalSessions}
            subtitle={`Avg ${analytics.averageSessionDuration} min each`}
            color="text-purple-400"
            glow="bg-purple-400/20"
            trend="+8%"
          />
          <StatCard
            icon={Brain}
            title="Dominant Mood"
            value={analytics.mostFrequentEmotion}
            subtitle="Recent emotional pattern"
            color="text-rose-400"
            glow="bg-rose-400/20"
          />
          <StatCard
            icon={Award}
            title="Credits Used"
            value={analytics.totalCreditsUsed}
            subtitle={`Total Purchased: ${analytics.totalCreditsPurchased}`}
            color="text-teal-400"
            glow="bg-teal-400/20"
          />
        </div>
      </motion.div>


      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Emotion Distribution Pie Chart */}
        <ChartCard title="Emotion Distribution" icon={PieChartIcon}>
          <div className="h-80 relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total</span>
              <span className="text-3xl font-black text-white">{analytics.totalEmotions}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.emotionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {analytics.emotionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [value, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {analytics.emotionDistribution.map((emotion, index) => {
              const Icon = emotionIcons[emotion.name];
              const percentage = Math.round((emotion.value / (analytics.totalEmotions || 1)) * 100);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/20 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emotion.color }} />
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    <span className="text-xs capitalize font-bold text-slate-400 group-hover:text-white">{emotion.name}</span>
                  </div>
                  <span className="text-xs font-black text-white">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Daily Emotion Trends */}
        <ChartCard title="Experience Trends" icon={LineChartIcon}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.dailyTrends}>
                <defs>
                  {Object.entries(emotionColors).map(([name, color]) => (
                    <linearGradient key={name} id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                {Object.entries(emotionColors).map(([name, color]) => (
                  <Area
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stackId="1"
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#grad-${name})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Therapy Session Analytics */}
        <ChartCard title="Session Activity" icon={BarChart3}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.sessionDurations}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#475569"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value, name) => [
                    name === 'duration' ? `${value} min` : value,
                    name === 'duration' ? 'Duration' : 'Messages'
                  ]}
                />
                <Bar dataKey="duration" fill="#60a5fa" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Weekly Emotion Summary */}
        <ChartCard title="Intensity Analysis" icon={BarChart3}>
          <div className="space-y-4">
            {analytics.weeklyAverages.slice(0, 5).map((emotion, index) => {
              const Icon = emotionIcons[emotion.emotion] || DefaultIcon;
              const color = emotionColors[emotion.emotion] || defaultColor;
              const percentage = emotion.percentage;

              return (
                <motion.div
                  key={emotion.emotion}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all"
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${emotionColorsTailwind[emotion.emotion]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-white text-lg capitalize mb-0.5">{emotion.emotion}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                        {emotion.weeklyCount} detected this week
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-white mb-2">{percentage}%</p>
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-current"
                        style={{ color: color }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ChartCard>
      </div>


      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="max-w-7xl mx-auto mt-12 mb-20 relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

          <div className="flex items-center mb-10 relative z-10">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mr-6">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Wellness Insights</h2>
              <p className="text-slate-500 font-medium">Deep dive into your psychological patterns</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-purple-500/30 transition-all group/insight">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                Emotional Balance
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Your wellness score of <span className="text-purple-400 font-bold">{analytics.wellnessScore}%</span> shows {
                  analytics.wellnessScore >= 70 ? 'excellent' :
                    analytics.wellnessScore >= 50 ? 'good' : 'developing'
                } emotional balance. Your consistent {analytics.mostFrequentEmotion} mood provides a stable foundation for growth.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-blue-500/30 transition-all group/insight">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                Therapy Progress
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                You've completed <span className="text-blue-400 font-bold">{analytics.totalSessions} sessions</span> with an average duration of {analytics.averageSessionDuration} minutes. This level of engagement significantly improves long-term outcome.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 transition-all group/insight">
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                Tracking Consistency
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                With <span className="text-emerald-400 font-bold">{analytics.totalEmotions} detections</span> recorded, your data density is improving. Regular tracking helps identify triggers and manage emotional health effectively.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;