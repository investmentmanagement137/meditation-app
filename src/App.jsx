import React, { useState } from 'react';
import SetupScreen from './screens/SetupScreen';
import TimerScreen from './screens/TimerView';
import EndNoteModal from './modals/EndNoteModal';
import AudioModal from './modals/AudioModal';
import DurationModal from './modals/DurationModal';
import IntervalModal from './modals/IntervalModal';
import LogModal from './modals/LogModal';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  // Load YouTube API Globally on Mount
  React.useEffect(() => {
    if (!window.YT) {
      window.onYouTubeIframeAPIReady = () => {
        console.log("Global: YouTube API Ready");
      };
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const [currentScreen, setCurrentScreen] = useState('setup');
  const [sessionData, setSessionData] = useState({});
  const [isEndNoteOpen, setIsEndNoteOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [isIntervalModalOpen, setIsIntervalModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // -- Lifted State --
  // We lift these so Modals can update them and SetupScreen reflects changes immediately
  const [durations, setDurations] = useLocalStorage('meditation_durations', [5, 10, 15, 20]);
  const [customIntervals, setCustomIntervals] = useLocalStorage('custom_intervals', []);
  const [savedAudios, setSavedAudios] = useLocalStorage('meditation_audios', [
    { id: '433600551', name: 'Rain', type: 'direct', url: 'https://cdn.pixabay.com/download/audio/2023/06/25/audio_433600551.mp3' },
    { id: '11030', name: 'Forest', type: 'direct', url: 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_11030.mp3' },
    { id: '1', name: 'None', type: 'none' }
  ]);

  // Keep selection state here or in SetupScreen? 
  // SetupScreen is fine for these, but if we want to add a value and auto-select it from a modal, 
  // it helps to have control or pass the setter down.
  const [selectedDuration, setSelectedDuration] = useLocalStorage('selected_duration', 10);
  const [selectedInterval, setSelectedInterval] = useLocalStorage('selected_interval', '0');
  const [selectedAudioId, setSelectedAudioId] = useLocalStorage('last_audio_id', null);

  const handleStartSession = (data) => {
    // Request Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen denied:', e));
    }

    setSessionData(data);
    setCurrentScreen('timer');
  };

  const handleEndSession = () => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log('Exit fullscreen failed:', e));
    }
    setIsEndNoteOpen(true);
  };

  const handleSaveEndNote = (endNote) => {
    const log = { id: Date.now(), startTime: new Date().toISOString(), duration: sessionData.duration, startNote: sessionData.note, endNote };
    const savedLogs = JSON.parse(localStorage.getItem('meditation_sessions') || '[]');
    savedLogs.push(log);
    localStorage.setItem('meditation_sessions', JSON.stringify(savedLogs));
    setCurrentScreen('setup');
  };

  return (
    <div className="screen active">
      {currentScreen === 'setup' && (
        <SetupScreen
          onStartSession={handleStartSession}
          startNote={sessionData.note || ''}
          setStartNote={(n) => setSessionData({ ...sessionData, note: n })}

          openAudioModal={() => setIsAudioModalOpen(true)}
          openLogs={() => setIsLogModalOpen(true)}
          openDurationModal={() => setIsDurationModalOpen(true)}
          openIntervalModal={() => setIsIntervalModalOpen(true)}

          // Props for State
          durations={durations}
          selectedDuration={selectedDuration}
          setSelectedDuration={setSelectedDuration}

          customIntervals={customIntervals}
          selectedInterval={selectedInterval}
          setSelectedInterval={setSelectedInterval}

          savedAudios={savedAudios}
          selectedAudioId={selectedAudioId}
        // setSelectedAudioId passed via AudioModal select mostly, or we can pass setter
        />
      )}
      {currentScreen === 'timer' && (
        <TimerScreen
          sessionConfig={sessionData}
          onEndSession={handleEndSession}
        />
      )}

      {/* Modals receiving State Setters */}
      <EndNoteModal
        isOpen={isEndNoteOpen}
        onClose={() => setIsEndNoteOpen(false)}
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

      <LogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </div>
  );
}
export default App;
