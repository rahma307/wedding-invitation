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
const musicPhoto = asset('79a3168cf52edca304ff32db46e0f888.jpg');
const couplePhoto = asset('WhatsApp Image 2026-09-01 at 7.00.13 PM.jpeg');
const storyPhotoOne = asset('f4408ae59bc76f809d049fcc92cbea80.jpg');
const storyPhotoTwo = asset('9dd45271b020a094a12bfeee12b39f65.jpg');
const storyPhotoThree = asset('40a42f4b27a14089b82a916aaff0b298.jpg');
const audioSource = asset('WhatsApp Audio 2026-09-02 at 9.31.00 AM.mp4');

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
      <div className="seal" aria-label="Youssef and Safa monogram">Y&amp;S</div>
      <div className="hero-copy">
        <motion.div
          className="display hero-title"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        >
          Youssef
          <br />
          &amp;
          <br />
          Safa
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
          15 . 08 . 2026
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
      <div className="display monogram">Y &amp; S</div>
      <div className="music-subtitle">Youssef &amp; Safa</div>
      <div className="music-photo">
        <img src={musicPhoto} alt="Youssef and Safa" />
      </div>
      <div className="music-track">Youssef &amp; Safa | 15.08.26</div>
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
  const wedding = new Date('2026-08-15T20:00:00');
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
      <div className="signature display">Y | S</div>
      <div className="couple-photo">
        <img src={couplePhoto} alt="Youssef and Safa" />
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

function AugustCalendar() {
  const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const days = useMemo(() => {
    const firstDay = new Date(2026, 7, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const cells: Array<{ label: string; target: boolean }> = [];
    for (let index = 0; index < offset; index += 1) cells.push({ label: '', target: false });
    for (let date = 1; date <= 31; date += 1) cells.push({ label: String(date), target: date === 15 });
    while (cells.length % 7 !== 0) cells.push({ label: '', target: false });
    return cells;
  }, []);

  return (
    <div aria-label="August 2026 calendar">
      <div className="weekdays">
        {weekdays.map((weekday) => <div key={weekday}>{weekday}</div>)}
      </div>
      <div className="calendar">
        {days.map((day, index) => (
          day.target ? (
            <div className="target-wrap" key={`target-${index}`} aria-label="August 15, 2026">
              <div className="petal one" />
              <div className="petal two" />
              <div className="petal three" />
              <div className="target-label">{day.label}</div>
            </div>
          ) : (
            <div className={`day${day.label ? '' : ' blank'}`} key={`day-${index}`}>{day.label || '0'}</div>
          )
        ))}
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
      <div className="month">August 2026</div>
      <AugustCalendar />
      <div className="venue">
        <div className="display section-title">Venue</div>
        <div className="venue-rule" />
        <div className="display venue-name">Louvre Heights</div>
        <div className="doors">Doors open 8:00 PM</div>
        <div className="address">3 Al Nadi, New Cairo 1<br />Cairo Governorate 4727401</div>
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
        href="https://wa.me/201033370771"
        target="_blank"
        rel="noreferrer"
        aria-label={`Confirm attendance on WhatsApp${guestId ? ` for invitation ${guestId}` : ''}`}
        data-testid="link-confirm-whatsapp"
      >
        <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
        <span>Confirm on WhatsApp</span>
      </a>
      <div className="display closing">With love, Youssef &amp; Safa</div>
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