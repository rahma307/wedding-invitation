import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  MessageCircle,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import './index.css';

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;
const musicPhoto = asset('5fdffe22-87c8-43b2-a330-defe98046360.jpg');
const couplePhoto = asset('a88c4529-c83a-42ae-8440-31c2489e2f7e.jpg');
const storyPhotoOne = asset('a88c4529-c83a-42ae-8440-31c2489e2f7e.jpg');
const storyPhotoTwo = asset('05132ad6-a363-4f9e-b8bb-423167adbd02.jpg');
const storyPhotoThree = asset('92cd7c96-4d97-4d12-9e94-cb8be07f5658.jpg');
const audioSource = asset('WhatsApp Audio 2026-09-02 at 12.26.25 PM.mp4');

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function DecorativeLineArt({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      className={`botanical ${side}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M5,5 Q30,10 35,35 Q40,55 60,60" />
        <circle cx="35" cy="35" r="4" />
        <circle cx="45" cy="45" r="3" />
        <path d="M20,15 Q25,20 22,28" />
      </g>
    </svg>
  );
}

function EnvelopeHero() {
  return (
    <section className="hero" aria-label="Wedding invitation">
      <div className="hero-flap" />
      <div className="seal" aria-label="Abd elrahman and Donia monogram">A&amp;D</div>
      <div className="hero-copy">
        <motion.div
          className="display hero-title"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
           Abd elrahman
          <br />
          &amp;
          <br />
          Donia 
        </motion.div>
        <motion.div
          className="hero-rule"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.6 }}
        />
        <motion.div
          className="hero-date"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
        >
          8 . 10 . 2026
        </motion.div>
      </div>
    </section>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    void audio.play().then(() => {
      setPlaying(true);
      setDuration(audio.duration || 0);
    }).catch(() => setPlaying(false));
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const skipBack = () => {
    if (audioRef.current) audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const skipForward = () => {
    if (audioRef.current && duration) audioRef.current.currentTime = duration;
    setCurrentTime(duration);
  };

  return (
    <section className="music" aria-label="Music player">
      <DecorativeLineArt side="left" />
      <DecorativeLineArt side="right" />
      <div className="display monogram">A &amp; D</div>
      <div className="music-subtitle">Abd elrahman &amp; Donia</div>
      <div className="music-photo">
        <img src={musicPhoto} alt="Abd elrahman and Donia" />
      </div>
      <div className="music-track">Abd elrahman &amp; Donia | 8.10.26</div>
      <div className="seek-wrap">
        <label htmlFor="wedding-song-seek" className="sr-only">Seek through the wedding song</label>
        <input
          id="wedding-song-seek"
          className="seek"
          type="range"
          min="0"
          max={duration || 1}
          value={Math.min(currentTime, duration || 1)}
          onChange={handleSeek}
          aria-valuetext={`${formatTime(currentTime)} elapsed`}
          data-testid="input-song-seek"
        />
        <div className="time-row" aria-live="polite">
          <span data-testid="text-song-elapsed">{formatTime(currentTime)}</span>
          <span data-testid="text-song-remaining">-{formatTime(Math.max(0, duration - currentTime))}</span>
        </div>
      </div>
      <div className="player-actions">
        <button
          type="button"
          className="player-button"
          onClick={skipBack}
          aria-label="Restart song"
          data-testid="button-song-restart"
        >
          <SkipBack size={18} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="player-button main"
          onClick={togglePlay}
          aria-label={playing ? 'Pause song' : 'Play song'}
          data-testid="button-song-toggle"
        >
          {playing ? <Pause size={18} strokeWidth={1.5} /> : <Play size={18} strokeWidth={1.5} />}
        </button>
        <button
          type="button"
          className="player-button"
          onClick={skipForward}
          aria-label="Skip to end of song"
          data-testid="button-song-end"
        >
          <SkipForward size={18} strokeWidth={1.5} />
        </button>
      </div>
      <audio
        ref={audioRef}
        src={audioSource}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
          setDuration(event.currentTarget.duration || 0);
        }}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
      />
    </section>
  );
}

function getCountdown() {
 const wedding = new Date('2026-10-08T19:00:00');
  const difference = Math.max(0, wedding.getTime() - Date.now());
  return [
    { value: String(Math.floor(difference / 86400000)).padStart(2, '0'), label: 'Days' },
    { value: String(Math.floor((difference % 86400000) / 3600000)).padStart(2, '0'), label: 'Hours' },
    { value: String(Math.floor((difference % 3600000) / 60000)).padStart(2, '0'), label: 'Min' },
    { value: String(Math.floor((difference % 60000) / 1000)).padStart(2, '0'), label: 'Sec' },
  ];
}

function Announcement() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.section
      className="announcement"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="eyebrow display">a note from our hearts</div>
      <div className="note">
        After years of laughter, patience, and falling more in love with every ordinary day — we're making it official — we're engaged. We can't imagine that day without the people who mean the most to us. That's you.
      </div>
      <div className="signature display">A | D</div>
      <div className="couple-photo">
        <img src={couplePhoto} alt="Abd elrahman and Donia" />
      </div>
      <div className="quote display">"Every love story is beautiful, but ours is our favorite."</div>
      <div className="countdown" aria-label="Countdown to the wedding">
        {countdown.map((unit) => (
          <div className="count-cell" key={unit.label} data-testid={`countdown-${unit.label.toLowerCase()}`}>
            <div className="count-value">{unit.value}</div>
            <div className="count-label">{unit.label}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

const storyItems = [
  {
    title: 'Where it began',
    copy: 'Two people, one golden-hour garden, and a friendship that quietly turned into something more.',
    image: storyPhotoOne,
  },
  {
    title: 'The proposal',
    copy: 'Under the lights, with her whole heart on her sleeve (and a ring on her finger), she said yes.',
    image: storyPhotoTwo,
    reverse: true,
  },
  {
    title: 'Making it official',
    copy: 'Sunflowers, promises, and the two of us — ready to start our forever, together.',
    image: storyPhotoThree,
  },
];

function OurStory() {
  return (
    <motion.section
      className="story"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="display section-title">Our Story</div>
      <div className="section-rule" />
      <div className="story-list">
        {storyItems.map((item, index) => (
          <div className={`story-item${item.reverse ? ' reverse' : ''}`} key={item.title}>
            {item.reverse ? (
              <>
                <div className="story-copy">
                  <div className="display story-heading">{item.title}</div>
                  <p>{item.copy}</p>
                </div>
                <img className="story-image" src={item.image} alt="" />
              </>
            ) : (
              <>
                <img className="story-image" src={item.image} alt="" />
                <div className="story-copy">
                  <div className="display story-heading">{item.title}</div>
                  <p>{item.copy}</p>
                </div>
              </>
            )}
            <span className="sr-only">Story chapter {index + 1}</span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// function AugustCalendar() {
//   const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
//   const days = useMemo(() => {
//     const firstDay = new Date(2026, 7, 1);
//     // const offset = (firstDay.getDay() + 6) % 7;
//     const offset = 1; // 1 October starts on Tuesday
//     const cells: Array<{ label: string; target: boolean }> = [];
//     for (let index = 0; index < offset; index += 1) cells.push({ label: '', target: false });
//     for (let date = 1; date <= 31; date += 1) cells.push({ label: String(date), target: date === 15 });
//     while (cells.length % 7 !== 0) cells.push({ label: '', target: false });
//     return cells;
//   }, []);

//   return (
//     <div aria-label="August 2026 calendar">
//       <div className="weekdays">
//         {weekdays.map((weekday) => <div key={weekday}>{weekday}</div>)}
//       </div>
//       <div className="calendar">
//         {days.map((day, index) => (
//           day.target ? (
//             <div className="target-wrap" key={`target-${index}`} aria-label="August 15, 2026">
//               <div className="petal one" />
//               <div className="petal two" />
//               <div className="petal three" />
//               <div className="target-label">{day.label}</div>
//             </div>
//           ) : (
//             <div className={`day${day.label ? '' : ' blank'}`} key={`day-${index}`}>{day.label || '0'}</div>
//           )
//         ))}
//       </div>
//     </div>
//   );
// }

function OctoberCalendar() {
  const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const days = useMemo(() => {
    // 1 October will appear under Tuesday
    const offset = 3;

    const cells: Array<{ label: string; target: boolean }> = [];

    for (let index = 0; index < offset; index += 1) {
      cells.push({
        label: '',
        target: false,
      });
    }

    for (let date = 1; date <= 31; date += 1) {
      cells.push({
        label: String(date),
        target: date === 8,
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push({
        label: '',
        target: false,
      });
    }

    return cells;
  }, []);

  return (
    <div aria-label="October 2026 calendar">
      <div className="weekdays">
        {weekdays.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>

      <div className="calendar">
        {days.map((day, index) =>
          day.target ? (
            <div
              className="target-wrap"
              key={`target-${index}`}
              aria-label="October 8, 2026"
            >
              <div className="petal one" />
              <div className="petal two" />
              <div className="petal three" />
              <div className="target-label">{day.label}</div>
            </div>
          ) : (
            <div
              className={`day${day.label ? '' : ' blank'}`}
              key={`day-${index}`}
            >
              {day.label || '0'}
            </div>
          )
        )}
      </div>
    </div>
  );
}
function BigDay() {
  return (
    <motion.section
      className="big-day"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="display section-title">The Big Day</div>
      <div className="month">October 2026</div>
      <OctoberCalendar />
      <div className="venue">
        <div className="display section-title">Venue</div>
        <div className="venue-rule" />
        <div className="display venue-name">Diamond </div>
        <div className="doors">Doors open 7:00 PM</div>
        <div className="address">Al Estad, Qesm Than Madinet Nasr,<br />Cairo Governorate 4436011</div>
        <a
          className="location-link"
          href="https://www.google.com/maps/search/?api=1&query=3+Al+Nadi,+New+Cairo+1,+Cairo+Governorate+4727401"
          target="_blank"
          rel="noreferrer"
          data-testid="link-view-location"
        >
          <MapPin size={16} strokeWidth={1.8} aria-hidden="true" />
          <span>View Location</span>
        </a>
      </div>
      <div className="map-frame">
        <iframe
          src="https://www.google.com/maps?q=3+Al+Nadi,+New+Cairo+1,+Cairo+Governorate+4727401&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Venue map"
        />
      </div>
    </motion.section>
  );
}

function Confirmation({ guestId }: { guestId: string }) {
  return (
    <motion.section
      className="confirmation"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="display section-title">Confirmation</div>
      <div className="confirmation-copy">
        We'd be so grateful if you could confirm your attendance with us directly — message us anytime, we read everything!
      </div>
      <a
        className="rsvp-link"
        href="https://wa.me/201283374287"
        target="_blank"
        rel="noreferrer"
        aria-label={`Confirm attendance on WhatsApp${guestId ? ` for invitation ${guestId}` : ''}`}
        data-testid="link-confirm-whatsapp"
      >
        <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
        <span>Confirm on WhatsApp</span>
      </a>
      <div className="display closing">With love, Abd elrahman &amp; Donia</div>
    </motion.section>
  );
}

function App() {
  const guestId = new URLSearchParams(window.location.search).get('i') ?? '';

  return (
    <main className="paper-tex">
      <div className="invitation" data-guest-id={guestId || undefined}>
        <EnvelopeHero />
        <MusicPlayer />
        <Announcement />
        <OurStory />
        <BigDay />
        <Confirmation guestId={guestId} />
      </div>
    </main>
  );
}

export default App;