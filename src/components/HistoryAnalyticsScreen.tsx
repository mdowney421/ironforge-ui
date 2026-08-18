import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_ANALYTICS_DATA } from '../data/mockData';
import { ScreenType } from '../types';

interface HistoryAnalyticsScreenProps {
  onNavigate?: (screen: ScreenType) => void;
}

export const HistoryAnalyticsScreen: React.FC<HistoryAnalyticsScreenProps> = () => {
  const [selectedRange, setSelectedRange] = useState<'1M' | '3M' | '6M' | 'ALL'>('6M');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExerciseKey, setSelectedExerciseKey] = useState<string>('barbell-back-squat');

  const analytics = MOCK_ANALYTICS_DATA[selectedExerciseKey] || MOCK_ANALYTICS_DATA['barbell-back-squat'];

  // Handle exercise switching based on search
  const allExerciseKeys = Object.keys(MOCK_ANALYTICS_DATA);
  const matchingExercises = allExerciseKeys.filter((key) =>
    MOCK_ANALYTICS_DATA[key].exerciseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen flex flex-col antialiased selection:bg-[#c3f400] selection:text-[#161e00]">
      <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full pb-28 md:pb-12">
        {/* Search and Filters */}
        <section className="px-5 py-5 flex flex-col gap-3 sticky top-16 bg-[#131313]/95 backdrop-blur-md z-30 border-b border-[#201f1f]">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#c4c9ac]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full bg-[#1c1b1b] border border-[#353534] rounded-lg py-3 pl-12 pr-4 text-white font-body-md focus:outline-none focus:border-[#c3f400] focus:ring-1 focus:ring-[#c3f400] transition-colors placeholder:text-[#8e9379]"
            />
          </div>

          {/* Quick exercise search dropdown preview if searching */}
          {searchQuery.trim().length > 0 && matchingExercises.length > 0 && (
            <div className="bg-[#201f1f] border border-[#444933] rounded-lg overflow-hidden shadow-xl">
              {matchingExercises.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedExerciseKey(key);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#2a2a2a] text-white flex justify-between items-center text-sm font-headline font-bold"
                >
                  <span>{MOCK_ANALYTICS_DATA[key].exerciseName}</span>
                  <span className="font-mono text-xs text-[#c3f400]">
                    1RM: {MOCK_ANALYTICS_DATA[key].estimated1RM} lbs
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Range Selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(['1M', '3M', '6M', 'ALL'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-4 py-1.5 rounded-full font-mono text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRange === range
                    ? 'border border-[#c3f400] bg-[#201f1f] text-[#c3f400]'
                    : 'border border-[#353534] bg-[#1c1b1b] text-white hover:border-[#c3f400]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </section>

        <div className="flex-grow flex flex-col px-5 gap-8 py-6">
          {/* Header */}
          <header>
            <div className="flex items-center gap-2 mb-2">
              {analytics.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-0.5 border text-xs font-mono rounded uppercase font-semibold ${
                    idx === 0 ? 'border-[#7df4ff] text-[#7df4ff]' : 'border-[#444933] text-[#c4c9ac]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="font-headline text-3xl md:text-4xl text-white uppercase font-extrabold tracking-tight">
              {analytics.exerciseName}
            </h2>
          </header>

          {/* Chart Section */}
          <section className="bg-[#131313] rounded-xl border border-[#2a2a2a] p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden group shadow-lg">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="font-mono text-xs text-[#c4c9ac] uppercase tracking-widest mb-1 font-semibold">
                  Estimated 1RM
                </p>
                <p className="font-mono text-4xl md:text-5xl font-extrabold text-[#c3f400] tracking-tight">
                  {analytics.estimated1RM}
                  <span className="text-base text-[#c4c9ac] ml-1.5 font-sans font-normal">lbs</span>
                </p>
              </div>

              <div className="flex items-center gap-1 text-[#c3f400] bg-[#c3f400]/10 px-2.5 py-1.5 rounded-lg border border-[#c3f400]/20">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span className="font-mono text-sm font-bold">+{analytics.changeLbs} lbs</span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="w-full h-48 md:h-60 relative mt-3">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-15 pointer-events-none">
                <div className="w-full h-px bg-white"></div>
                <div className="w-full h-px bg-white"></div>
                <div className="w-full h-px bg-white"></div>
                <div className="w-full h-px bg-white"></div>
              </div>

              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Area Fill */}
                <defs>
                  <linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c3f400" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#c3f400" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 L20,70 L40,65 L60,40 L80,45 L100,20 L100,100 L0,100 Z"
                  fill="url(#chart-gradient)"
                />
                {/* Animated Line */}
                <path
                  className="animate-line"
                  d="M0,80 L20,70 L40,65 L60,40 L80,45 L100,20"
                  fill="none"
                  stroke="#c3f400"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Data Points */}
                <circle cx="20" cy="70" fill="#131313" r="2" stroke="#c3f400" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle cx="40" cy="65" fill="#131313" r="2" stroke="#c3f400" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle cx="60" cy="40" fill="#131313" r="2" stroke="#c3f400" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle cx="80" cy="45" fill="#131313" r="2" stroke="#c3f400" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <circle className="pulse-point" cx="100" cy="20" fill="#c3f400" r="3" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-[#c4c9ac] font-mono text-[11px] uppercase font-semibold pt-1">
              {analytics.historyPoints.map((pt) => (
                <span key={pt.month}>{pt.month}</span>
              ))}
            </div>
          </section>

          {/* Summary Bento Grid */}
          <section className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {/* PR Card */}
            <div className="bg-[#131313] rounded-xl border-l-4 border-l-[#c3f400] border-y border-r border-[#2a2a2a] p-4 flex flex-col justify-between h-34 relative overflow-hidden shadow-sm">
              <div className="absolute -right-3 -top-3 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[90px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  emoji_events
                </span>
              </div>
              <p className="font-mono text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                All-Time PR
              </p>
              <div>
                <p className="font-mono text-3xl leading-tight text-white font-bold">
                  {analytics.allTimePR.weight}
                  <span className="text-xs text-[#c4c9ac] ml-1 font-normal font-sans">lbs</span>
                </p>
                <p className="font-mono text-[11px] text-[#c4c9ac] mt-1">{analytics.allTimePR.date}</p>
              </div>
            </div>

            {/* Total Volume Card */}
            <div className="bg-[#131313] rounded-xl border border-[#2a2a2a] p-4 flex flex-col justify-between h-34 shadow-sm">
              <p className="font-mono text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                Total Volume
              </p>
              <div>
                <p className="font-mono text-3xl leading-tight text-white font-bold">
                  {analytics.totalVolume}
                  <span className="text-xs text-[#c4c9ac] ml-1 font-normal font-sans">lbs</span>
                </p>
                <p className="font-mono text-[11px] text-[#c3f400] mt-1 flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[12px]">arrow_upward</span> {analytics.percentileRank}
                </p>
              </div>
            </div>

            {/* Frequency Sessions Card */}
            <div className="bg-[#131313] rounded-xl border border-[#2a2a2a] p-4 flex flex-col justify-between h-34 col-span-2 md:col-span-1 shadow-sm">
              <p className="font-mono text-xs text-[#c4c9ac] uppercase tracking-wider font-semibold">
                Total Sessions
              </p>
              <div className="flex items-end justify-between">
                <p className="font-mono text-3xl leading-tight text-white font-bold">
                  {analytics.totalSessions}
                </p>
                <div className="flex gap-1 mb-1">
                  <div className="w-2 h-2.5 bg-[#353534] rounded-xs" />
                  <div className="w-2 h-3.5 bg-[#353534] rounded-xs" />
                  <div className="w-2 h-5 bg-[#c3f400]/40 rounded-xs" />
                  <div className="w-2 h-6.5 bg-[#c3f400]/70 rounded-xs" />
                  <div className="w-2 h-8 bg-[#c3f400] rounded-xs" />
                </div>
              </div>
            </div>
          </section>

          {/* Recent Sessions List */}
          <section className="flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-[#353534] pb-2">
              <h3 className="font-headline text-lg font-bold uppercase tracking-wide text-white">
                Recent History
              </h3>
              <button
                onClick={() => alert(`Full historical ledger contains ${analytics.totalSessions} total logged sets.`)}
                className="font-mono text-xs text-[#c3f400] hover:text-white transition-colors flex items-center gap-1 uppercase font-semibold"
              >
                VIEW ALL <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {analytics.recentSessions.map((session, idx) => (
                <div
                  key={session.id || idx}
                  className="bg-[#131313] rounded-xl border border-[#2a2a2a] p-4 hover:border-[#444933] transition-colors group shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#201f1f] flex items-center justify-center text-[#c4c9ac] group-hover:bg-[#c3f400]/15 group-hover:text-[#c3f400] transition-colors">
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          calendar_today
                        </span>
                      </div>
                      <div>
                        <p className="font-body-md text-white font-semibold">{session.relativeDate}</p>
                        <p className="font-mono text-[10px] text-[#c4c9ac] uppercase tracking-wider">{session.workoutName}</p>
                      </div>
                    </div>
                    <p className="font-mono text-base text-[#c3f400] font-bold">1RM: {session.oneRepMax}</p>
                  </div>

                  {/* Sets Table */}
                  {session.sets && session.sets.length > 0 && (
                    <div className="bg-[#1c1b1b] rounded-lg p-2.5">
                      <div className="grid grid-cols-4 gap-2 mb-2 px-2 border-b border-[#353534] pb-1">
                        <span className="font-mono text-[10px] text-[#c4c9ac] uppercase text-center font-semibold">Set</span>
                        <span className="font-mono text-[10px] text-[#c4c9ac] uppercase text-center col-span-2 font-semibold">
                          Weight x Reps
                        </span>
                        <span className="font-mono text-[10px] text-[#c4c9ac] uppercase text-center font-semibold">1RM</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {session.sets.map((set, setIdx) => {
                          const isTopSet = set.oneRepMax === session.oneRepMax;
                          return (
                            <div
                              key={setIdx}
                              className={`grid grid-cols-4 gap-2 px-2 py-1.5 rounded text-xs items-center ${
                                isTopSet
                                  ? 'bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] font-bold'
                                  : 'bg-[#201f1f]/60 text-[#e5e2e1]'
                              }`}
                            >
                              <span className="font-mono text-center">{set.setNumber}</span>
                              <span className="font-mono text-center col-span-2">
                                {set.weight} <span className="text-[#c4c9ac] text-[10px] mx-1">x</span> {set.reps}
                              </span>
                              <span className="font-mono text-center">{set.oneRepMax}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
