import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, ScreenType } from '../types';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onLogout,
}) => {
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [weight, setWeight] = useState(profile.weightLbs);
  const [height, setHeight] = useState(profile.height);
  const [bodyFat, setBodyFat] = useState(profile.bodyFatPercent);
  const [unitMode, setUnitMode] = useState<'LBS / IN' | 'KG / CM'>(profile.preferences.units);

  const handleSaveStats = () => {
    onUpdateProfile({
      ...profile,
      weightLbs: weight,
      height: height,
      bodyFatPercent: bodyFat,
      preferences: {
        ...profile.preferences,
        units: unitMode,
      },
    });
    setIsEditingStats(false);
  };

  const toggleUnits = () => {
    const nextUnit = unitMode === 'LBS / IN' ? 'KG / CM' : 'LBS / IN';
    setUnitMode(nextUnit);
    onUpdateProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        units: nextUnit,
      },
    });
  };

  return (
    <div className="bg-black text-[#e5e2e1] min-h-screen flex flex-col antialiased">
      <main className="flex-grow w-full max-w-4xl mx-auto px-5 pt-6 pb-28 md:pb-12 flex flex-col gap-8">
        {/* User Profile Avatar & Badge Section */}
        <section className="flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#c3f400] p-1 shadow-[0_0_20px_rgba(195,244,0,0.25)]">
              <img
                src={profile.avatarUrl}
                alt="Alex Rivera Profile"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => setIsEditingStats(true)}
              className="absolute bottom-0 right-0 bg-[#c3f400] text-[#161e00] w-8 h-8 rounded-full flex items-center justify-center border-2 border-black hover:bg-[#abd600] active:scale-95 transition-all shadow-md cursor-pointer"
              aria-label="Edit Profile"
            >
              <span className="material-symbols-outlined text-[16px] font-bold">edit</span>
            </button>
          </div>

          <h2 className="font-headline text-3xl md:text-4xl text-white uppercase font-extrabold tracking-tight mb-1.5">
            {profile.name}
          </h2>

          <div className="inline-flex items-center gap-1.5 bg-[#2a2a2a] px-3.5 py-1.5 rounded border border-[#444933]">
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              military_tech
            </span>
            <span className="font-mono text-xs text-[#c3f400] uppercase tracking-widest font-bold">
              {profile.badge}
            </span>
          </div>
        </section>

        {/* Physical Stats Bento Grid */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-headline text-2xl font-bold text-white tracking-tight">
              Physical Stats
            </h3>
            <button
              onClick={() => setIsEditingStats(true)}
              className="text-[#c3f400] font-mono text-xs uppercase tracking-wider hover:text-white"
            >
              EDIT STATS
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {/* Weight */}
            <div className="bg-[#121212] border-l-4 border-[#7df4ff] p-4 rounded-xl flex flex-col justify-between border border-[#444933] hover:border-[#c3f400] transition-colors">
              <span className="font-mono text-xs text-[#c4c9ac] uppercase font-semibold mb-2">Weight</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl md:text-3xl text-white font-bold">{profile.weightLbs}</span>
                <span className="font-mono text-xs text-[#8e9379]">LBS</span>
              </div>
            </div>

            {/* Height */}
            <div className="bg-[#121212] border-l-4 border-[#7df4ff] p-4 rounded-xl flex flex-col justify-between border border-[#444933] hover:border-[#c3f400] transition-colors">
              <span className="font-mono text-xs text-[#c4c9ac] uppercase font-semibold mb-2">Height</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl md:text-3xl text-white font-bold">{profile.height}</span>
              </div>
            </div>

            {/* Body Fat */}
            <div className="bg-[#121212] border-l-4 border-[#7df4ff] p-4 rounded-xl flex flex-col justify-between border border-[#444933] hover:border-[#c3f400] transition-colors">
              <span className="font-mono text-xs text-[#c4c9ac] uppercase font-semibold mb-2">Body Fat</span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl md:text-3xl text-white font-bold">{profile.bodyFatPercent}</span>
                <span className="font-mono text-xs text-[#8e9379]">%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Records */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="font-headline text-2xl font-bold text-white tracking-tight">
              Personal Records
            </h3>
            <button
              onClick={() => alert("Personal Records synchronized with historical logs.")}
              className="text-[#c3f400] font-mono text-xs hover:text-white transition-colors uppercase font-semibold"
            >
              VIEW ALL
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {profile.personalRecords.map((pr) => (
              <div
                key={pr.id}
                className="bg-[#121212] border border-[#444933] rounded-xl p-4 flex justify-between items-center hover:border-[#c3f400] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-[#7df4ff] group-hover:text-[#c3f400] transition-colors">
                    <span className="material-symbols-outlined text-[24px]">{pr.icon}</span>
                  </div>
                  <div>
                    <div className="font-headline text-lg font-bold text-white uppercase group-hover:text-[#c3f400] transition-colors">
                      {pr.name}
                    </div>
                    <div className="font-mono text-xs text-[#8e9379]">{pr.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-2xl md:text-3xl text-[#c3f400] font-bold">
                    {pr.weight} <span className="text-xs text-[#8e9379] font-normal">LBS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Preferences & Settings */}
        <section>
          <h3 className="font-headline text-2xl font-bold text-white tracking-tight mb-3">
            Preferences
          </h3>

          <div className="bg-[#121212] border border-[#444933] rounded-xl overflow-hidden divide-y divide-[#353534]">
            {/* Account Security */}
            <div
              onClick={() => alert("Security Protocol: 2-Factor Authentication verified on Operative device.")}
              className="flex items-center justify-between p-4 hover:bg-[#201f1f] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#c4c9ac]">lock</span>
                <span className="font-body-md text-base text-white">Account Security</span>
              </div>
              <span className="material-symbols-outlined text-[#8e9379]">chevron_right</span>
            </div>

            {/* Notification Settings */}
            <div
              onClick={() => alert("Notification alerts enabled for rest timer and training intervals.")}
              className="flex items-center justify-between p-4 hover:bg-[#201f1f] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#c4c9ac]">notifications</span>
                <span className="font-body-md text-base text-white">Notification Settings</span>
              </div>
              <span className="material-symbols-outlined text-[#8e9379]">chevron_right</span>
            </div>

            {/* Units Toggle */}
            <div
              onClick={toggleUnits}
              className="flex items-center justify-between p-4 hover:bg-[#201f1f] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#c4c9ac]">straighten</span>
                <span className="font-body-md text-base text-white">Units</span>
              </div>
              <div className="flex items-center gap-2 text-[#8e9379]">
                <span className="font-mono text-xs text-[#c3f400] font-bold">{unitMode}</span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </div>

            {/* Integrations */}
            <div
              onClick={() => alert("Apple Health & HealthKit sync actively streaming session volume.")}
              className="flex items-center justify-between p-4 hover:bg-[#201f1f] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#c4c9ac]">api</span>
                <span className="font-body-md text-base text-white">Integrations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#7df4ff] font-semibold">Apple Health</span>
                <span className="material-symbols-outlined text-[#8e9379] text-[18px]">chevron_right</span>
              </div>
            </div>
          </div>
        </section>

        {/* Logout Button */}
        <section className="mt-2">
          <button
            onClick={onLogout}
            className="w-full bg-[#2a2a2a] border border-[#444933] text-[#ffb4ab] font-headline text-lg uppercase font-bold py-4 rounded-xl hover:bg-[#93000a] hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </section>
      </main>

      {/* Edit Stats Modal */}
      <AnimatePresence>
        {isEditingStats && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsEditingStats(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#201f1f] border border-[#444933] rounded-xl w-full max-w-md p-6 shadow-2xl z-10"
            >
              <h2 className="font-headline text-2xl text-white uppercase font-bold tracking-tight mb-4">
                Update Physical Stats
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-[#c4c9ac] uppercase mb-1">
                    Body Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#131313] border border-[#444933] text-white p-3 rounded font-mono text-lg focus:border-[#c3f400] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4c9ac] uppercase mb-1">
                    Height
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-[#131313] border border-[#444933] text-white p-3 rounded font-mono text-lg focus:border-[#c3f400] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#c4c9ac] uppercase mb-1">
                    Body Fat Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#131313] border border-[#444933] text-white p-3 rounded font-mono text-lg focus:border-[#c3f400] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditingStats(false)}
                  className="flex-1 py-3 bg-[#353534] text-white rounded-lg font-mono text-xs uppercase hover:bg-[#393939]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveStats}
                  className="flex-1 py-3 bg-[#c3f400] text-[#161e00] rounded-lg font-headline font-bold text-base uppercase hover:bg-[#abd600]"
                >
                  Save Stats
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
