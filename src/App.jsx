import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SetupScreen from './screens/SetupScreen';
import TimerScreen from './screens/TimerView';
import DashboardScreen from './screens/DashboardScreen';
import LogsScreen from './screens/LogsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AudioLibraryScreen from './screens/AudioLibraryScreen';
import ContactScreen from './screens/ContactScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import TermsScreen from './screens/TermsScreen';
import ShareScreen from './screens/ShareScreen';
import ReminderScreen from './screens/ReminderScreen';

import Layout from './components/Layout';
import EndNoteModal from './modals/EndNoteModal';
import AudioModal from './modals/AudioModal';
import DurationModal from './modals/DurationModal';
import IntervalModal from './modals/IntervalModal';
import StartBellModal from './modals/StartBellModal';
import IntervalBellModal from './modals/IntervalBellModal';
import ThemeModal from './modals/ThemeModal';
import ClockModal from './modals/ClockModal';
import APIKeyModal from './modals/APIKeyModal';
import useLocalStorage from './hooks/useLocalStorage';

// Global YouTube Player Reference
window.ytPlayer = null;

function AppContent() {
  const navigate = useNavigate();
  const ytPlayerRef = useRef(null);

  // Load YouTube API and Initialize Player Globally on Mount
  useEffect(() => {
    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    const root = document.documentElement;
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else if (savedTheme === 'light') {
      root.classList.add('light');
    }

    if (!document.getElementById('yt-player-host')) {
      const hostDiv = document.createElement('div');
      hostDiv.id = 'yt-player-host';
      hostDiv.style.position = 'absolute';
      hostDiv.style.top = '0';
      hostDiv.style.left = '0';
      hostDiv.style.width = '1px';
      hostDiv.style.height = '1px';
      hostDiv.style.opacity = '0.01';
      hostDiv.style.pointerEvents = 'none';
      hostDiv.style.zIndex = '-1';
      document.body.appendChild(hostDiv);
    }

    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => {
        console.log("Global: YouTube API Ready - Creating Player");
        window.ytPlayer = new window.YT.Player('yt-player-host', {
          height: '1',
          width: '1',
          playerVars: { 'playsinline': 1, 'controls': 0, 'loop': 1 },
          events: {
            'onReady': () => console.log("Global: YouTube Player Ready"),
            'onStateChange': (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            },
            'onError': (e) => console.error("YT Error:", e)
          }
        });
      };
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else if (window.YT && window.YT.Player && !window.ytPlayer) {
      window.ytPlayer = new window.YT.Player('yt-player-host', {
        height: '1',
        width: '1',
        playerVars: { 'playsinline': 1, 'controls': 0, 'loop': 1 },
        events: {
          'onReady': () => console.log("Global: YouTube Player Ready"),
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
          'onError': (e) => console.error("YT Error:", e)
        }
      });
    }
  }, []);

  const [sessionData, setSessionData] = useState({});
  const [isEndNoteOpen, setIsEndNoteOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      console.log("PWA Install Prompt captured");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  // Setup Modals
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isIntervalModalOpen, setIsIntervalModalOpen] = useState(false);

  // Settings Modals
  const [isStartBellModalOpen, setIsStartBellModalOpen] = useState(false);
  const [isIntervalBellModalOpen, setIsIntervalBellModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // -- Lifted State --
  const [durations, setDurations] = useLocalStorage('meditation_durations', [5, 10, 15, 20]);
  const [customIntervals, setCustomIntervals] = useLocalStorage('custom_intervals', []);
  const [savedAudios, setSavedAudios] = useLocalStorage('meditation_audios', [
    { id: '1', name: 'None', type: 'none' }
  ]);
  const [collections, setCollections] = useLocalStorage('meditation_collections', []);
  const [logs, setLogs] = useLocalStorage('meditation_sessions', []);

  const [selectedDuration, setSelectedDuration] = useLocalStorage('selected_duration', 10);
  const [selectedInterval, setSelectedInterval] = useLocalStorage('selected_interval', '0');
  const [selectedAudioId, setSelectedAudioId] = useLocalStorage('last_audio_id', null);

  const [startSound, setStartSound] = useLocalStorage('start_bell_sound', 'bell-1');
  const [intervalSound, setIntervalSound] = useLocalStorage('interval_bell_sound', 'bell-2');
  const [clockLayout, setClockLayout] = useLocalStorage('clock_layout', 'digital');
  const [apiKey, setApiKey] = useLocalStorage('gemini_api_key', '');

  // -- Preferences --
  const [hideJournaling] = useLocalStorage('pref_hide_journaling', false);
  const [reminderEnabled] = useLocalStorage('reminder_enabled', false);
  const [reminderTime] = useLocalStorage('reminder_time', '08:00');

  // --- Reminder Logic ---
  useEffect(() => {
    const checkReminder = () => {
      if (!reminderEnabled) return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;

      if (currentTime === reminderTime && now.getSeconds() < 10) {
        const lastTriggered = localStorage.getItem('last_reminder_date');
        const today = now.toDateString();

        if (lastTriggered !== today) {
          // Play Sound
          try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.type = 'sine';
              osc.frequency.setValueAtTime(500, ctx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
              gain.gain.setValueAtTime(0.1, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
              osc.start();
              osc.stop(ctx.currentTime + 0.5);
            }
          } catch (e) { console.error(e); }

          new Notification('Time to Meditate', {
            body: 'Take a moment for yourself.',
            icon: '/icon-192.png'
          });
          localStorage.setItem('last_reminder_date', today);
        }
      }
    };

    const intervalId = setInterval(checkReminder, 10000);
    return () => clearInterval(intervalId);
  }, [reminderEnabled, reminderTime]);

  // Theme Toggle Logic
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light'); // default or explicit light
        setIsDark(false);
      }
    };
    checkTheme();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
    } else {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };


  const handleStartSession = (data) => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen denied:', e));
    }
    setSessionData({ ...data, startTime: new Date().toISOString(), sessionKey: Date.now() });
    navigate('/timer');
  };

  const handleEndSession = (actualDuration) => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log('Exit fullscreen failed:', e));
    }
    if (actualDuration !== undefined) {
      setSessionData(prev => ({ ...prev, actualDuration }));
    }

    // Check if Journaling is HIDDEN
    if (hideJournaling) {
      // Save immediately without opening EndNoteModal
      let durationToUse = actualDuration;
      if (durationToUse === undefined) durationToUse = sessionData.duration;

      const log = {
        id: Date.now(),
        startTime: sessionData.startTime || new Date().toISOString(),
        endTime: new Date().toISOString(),
        duration: durationToUse,
        startNote: null,
        endNote: null,
        emotions: [],
        causes: [],
        model: null,
        tokens: null,
        audioDetails: savedAudios.find(a => a.id === sessionData.audioId) || null
      };
      setLogs(prev => [...prev, log]);
      setSessionAnalysis(null);
      setSessionData({});
      navigate('/dashboard');
    } else {
      setIsEndNoteOpen(true);
    }
  };

  const [sessionAnalysis, setSessionAnalysis] = useState(null);

  const handleSaveEndNote = (endNote) => {
    setIsEndNoteOpen(false);
    const finalDuration = sessionData.actualDuration !== undefined ? sessionData.actualDuration : sessionData.duration;

    const log = {
      id: Date.now(),
      startTime: sessionData.startTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: finalDuration,
      startNote: sessionData.note || null,
      endNote: endNote || null,
      emotions: sessionAnalysis?.emotions || [],
      causes: sessionAnalysis?.causes || [],
      model: sessionAnalysis?.model || null,
      tokens: sessionAnalysis?.usage?.totalTokenCount || null,
      audioDetails: savedAudios.find(a => a.id === sessionData.audioId) || null
    };

    setLogs(prev => [...prev, log]);
    setSessionAnalysis(null);
    // Clear session data for fresh start next time
    setSessionData({});
    navigate('/dashboard');
  };

  const handleDeleteLog = (logId) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  };

  return (
    <div className="app-container min-h-screen bg-gray-50 dark:bg-gray-950">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={
            <SetupScreen
              onStartSession={handleStartSession}
              startNote={sessionData.note || ''}
              setStartNote={(n) => setSessionData({ ...sessionData, note: n })}
              openAudioModal={() => setIsAudioModalOpen(true)}
              openLogs={() => navigate('/logs')}
              openDurationModal={() => setIsDurationModalOpen(true)}
              openIntervalModal={() => setIsIntervalModalOpen(true)}
              durations={durations}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              customIntervals={customIntervals}
              selectedInterval={selectedInterval}
              setSelectedInterval={setSelectedInterval}
              savedAudios={savedAudios}
              selectedAudioId={selectedAudioId}
              collections={collections}
              setCollections={setCollections}
            />
          } />
          <Route path="/dashboard" element={
            <DashboardScreen
              logs={logs}
              savedAudios={savedAudios}
              selectedAudioId={selectedAudioId}
              onOpenAudioModal={() => setIsAudioModalOpen(true)}
            />
          } />
          <Route path="/logs" element={
            <LogsScreen
              logs={logs}
              onDeleteLog={handleDeleteLog}
            />
          } />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/privacy" element={<PrivacyScreen />} />
          <Route path="/terms" element={<TermsScreen />} />
          <Route path="/share" element={<ShareScreen />} />
          <Route path="/reminder" element={<ReminderScreen />} />
          <Route path="/settings" element={
            <SettingsScreen
              savedAudios={savedAudios}
              selectedAudioId={selectedAudioId}
              // Open Handlers
              onOpenAudioModal={() => setIsAudioModalOpen(true)}
              onOpenStartBellModal={() => setIsStartBellModalOpen(true)}
              onOpenIntervalBellModal={() => setIsIntervalBellModalOpen(true)}
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
              onOpenClockModal={() => setIsClockModalOpen(true)}
              onOpenAIModal={() => setIsAIModalOpen(true)}
              // State
              startSound={startSound}
              intervalSound={intervalSound}
              clockLayout={clockLayout}
              apiKey={apiKey}
              isDark={isDark}
              // PWA
              deferredPrompt={deferredPrompt}
              onInstallApp={handleInstallApp}
            />
          } />
          <Route path="/audio" element={
            <AudioLibraryScreen
              activeAudioId={selectedAudioId}
              onSelectAudio={setSelectedAudioId}
              savedAudios={savedAudios}
              setSavedAudios={setSavedAudios}
              collections={collections}
              setCollections={setCollections}
            />
          } />
        </Route>

        <Route path="/timer" element={
          <TimerScreen
            sessionConfig={sessionData}
            activeAudioId={selectedAudioId}
            onSelectAudio={setSelectedAudioId}
            onEndSession={handleEndSession}
            setSessionAnalysis={setSessionAnalysis}
            onOpenAudioSettings={() => setIsAudioModalOpen(true)}
            clockLayout={clockLayout}
            startSound={startSound}
            intervalSound={intervalSound}
          />
        } />
      </Routes>

      <EndNoteModal
        isOpen={isEndNoteOpen}
        onClose={() => handleSaveEndNote(null)}
        onSave={handleSaveEndNote}
        initialNote=""
      />

      <AudioModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        onSelect={setSelectedAudioId}
        currentAudioId={selectedAudioId}
        savedAudios={savedAudios}
        setSavedAudios={setSavedAudios}
        collections={collections}
        setCollections={setCollections}
      />

      {/* SETUP MODALS */}
      <DurationModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        onSelect={setSelectedDuration}
        durations={durations}
        setDurations={setDurations}
      />

      <IntervalModal
        isOpen={isIntervalModalOpen}
        onClose={() => setIsIntervalModalOpen(false)}
        onSelect={setSelectedInterval}
        currentInterval={selectedInterval}
      />

      {/* SETTINGS MODALS */}
      <StartBellModal
        isOpen={isStartBellModalOpen}
        onClose={() => setIsStartBellModalOpen(false)}
        startSound={startSound}
        setStartSound={setStartSound}
      />

      <IntervalBellModal
        isOpen={isIntervalBellModalOpen}
        onClose={() => setIsIntervalBellModalOpen(false)}
        intervalSound={intervalSound}
        setIntervalSound={setIntervalSound}
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      <ClockModal
        isOpen={isClockModalOpen}
        onClose={() => setIsClockModalOpen(false)}
        clockLayout={clockLayout}
        setClockLayout={setClockLayout}
      />

      <APIKeyModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
