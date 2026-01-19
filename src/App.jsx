import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import SetupScreen from './screens/SetupScreen';
import TimerScreen from './screens/TimerView';
import DashboardScreen from './screens/DashboardScreen';
import Layout from './components/Layout';
import EndNoteModal from './modals/EndNoteModal';
import AudioModal from './modals/AudioModal';
import DurationModal from './modals/DurationModal';
import IntervalModal from './modals/IntervalModal';
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
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isIntervalModalOpen, setIsIntervalModalOpen] = useState(false);

  // -- Lifted State --
  const [durations, setDurations] = useLocalStorage('meditation_durations', [5, 10, 15, 20]);
  const [customIntervals, setCustomIntervals] = useLocalStorage('custom_intervals', []);
  const [savedAudios, setSavedAudios] = useLocalStorage('meditation_audios', [
    { id: '1', name: 'None', type: 'none' }
  ]);
  const [logs, setLogs] = useLocalStorage('meditation_sessions', []);

  const [selectedDuration, setSelectedDuration] = useLocalStorage('selected_duration', 10);
  const [selectedInterval, setSelectedInterval] = useLocalStorage('selected_interval', '0');
  const [selectedAudioId, setSelectedAudioId] = useLocalStorage('last_audio_id', null);

  const handleStartSession = (data) => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen denied:', e));
    }
    setSessionData({ ...data, startTime: new Date().toISOString(), sessionKey: Date.now() });
    navigate('/timer');
  };

  const handleEndSession = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log('Exit fullscreen failed:', e));
    }
    setIsEndNoteOpen(true);
  };

  const [sessionAnalysis, setSessionAnalysis] = useState(null);

  const handleSaveEndNote = (endNote) => {
    setIsEndNoteOpen(false);

    const log = {
      id: Date.now(),
      startTime: sessionData.startTime || new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: sessionData.duration,
      startNote: sessionData.note || null,
      endNote: endNote || null,
      emotions: sessionAnalysis?.emotions || [],
      causes: sessionAnalysis?.causes || [],
      model: sessionAnalysis?.model || null,
      tokens: sessionAnalysis?.usage?.totalTokenCount || null
    };

    setLogs(prev => [...prev, log]);
    setSessionAnalysis(null);
    navigate('/dashboard');
  };

  const handleDeleteLog = (logId) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
  };

  return (
    <div className="app-container min-h-screen bg-gray-50 dark:bg-gray-950">
      <Routes>
        {/* Helper function to wrap components with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={
            <SetupScreen
              onStartSession={handleStartSession}
              startNote={sessionData.note || ''}
              setStartNote={(n) => setSessionData({ ...sessionData, note: n })}
              openAudioModal={() => setIsAudioModalOpen(true)}
              openLogs={() => navigate('/dashboard')}
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
            />
          } />
          <Route path="/dashboard" element={
            <DashboardScreen
              logs={logs}
              onDeleteLog={handleDeleteLog}
            />
          } />
        </Route>

        {/* Timer is standalone */}
        <Route path="/timer" element={
          <TimerScreen
            sessionConfig={sessionData}
            activeAudioId={selectedAudioId}
            onSelectAudio={setSelectedAudioId}
            onEndSession={handleEndSession}
            setSessionAnalysis={setSessionAnalysis}
            onOpenAudioSettings={() => setIsAudioModalOpen(true)}
          />
        } />
      </Routes>

      {/* Global Modals */}
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
      />

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
        customIntervals={customIntervals}
        setCustomIntervals={setCustomIntervals}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/meditation-app">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
