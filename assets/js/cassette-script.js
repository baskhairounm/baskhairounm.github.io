class CassetteMixtape {
    constructor() {
        this.playlist = [
            {
                title: "Can't Help Myself (Karol's Song)",
                artist: "The Four Tops",
                youtubeId: "T6QKqFPRZSA",
                duration: "2:44"
            },
            {
                title: "At Last (When Karol Met Martin)",
                artist: "Etta James",
                youtubeId: "S-cbOl96RFM",
                duration: "3:01"
            },
            {
                title: "Stand By Me (K&M Forever)",
                artist: "Ben E. King",
                youtubeId: "hwZNL7QVJjE",
                duration: "2:59"
            },
            {
                title: "La Vie En Rose (Martin's Promise)",
                artist: "Édith Piaf",
                youtubeId: "kFzViYkZAz4",
                duration: "3:28"
            },
            {
                title: "The Way You Look Tonight (Karol)",
                artist: "Frank Sinatra",
                youtubeId: "h9ZGKALMMuc",
                duration: "3:22"
            },
            {
                title: "Dream a Little Dream (Our Future)",
                artist: "Ella Fitzgerald",
                youtubeId: "UchZ_ZP6YIw",
                duration: "3:06"
            },
            {
                title: "Moon River (First Dance)",
                artist: "Audrey Hepburn",
                youtubeId: "uirBWk-qd9A",
                duration: "2:41"
            },
            {
                title: "Fly Me to the Moon (Honeymoon)",
                artist: "Frank Sinatra",
                youtubeId: "5hxibHJOE5E",
                duration: "2:28"
            },
            {
                title: "L-O-V-E (Karol & Martin)",
                artist: "Nat King Cole",
                youtubeId: "JErVP6xLZwg",
                duration: "2:22"
            },
            {
                title: "What a Wonderful World (Together)",
                artist: "Louis Armstrong",
                youtubeId: "VqhCQZaH4Vs",
                duration: "2:20"
            }
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        this.player = null;
        this.playerReady = false;
        
        this.initializeElements();
        this.bindEvents();
        this.renderPlaylist();
        this.loadYouTubeAPI();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.volumeSlider = document.getElementById('volume');
        this.trackList = document.getElementById('trackList');
        this.displayTitle = document.querySelector('.track-title');
        this.displayNumber = document.querySelector('.track-number');
        this.leftReel = document.querySelector('.left-reel');
        this.rightReel = document.querySelector('.right-reel');
    }
    
    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.shuffleBtn.addEventListener('click', () => this.shufflePlaylist());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
    }
    
    loadYouTubeAPI() {
        if (window.YT) {
            this.initializePlayer();
            return;
        }
        
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
        window.onYouTubeIframeAPIReady = () => {
            this.initializePlayer();
        };
    }
    
    initializePlayer() {
        const playerDiv = document.createElement('div');
        playerDiv.id = 'youtube-player';
        playerDiv.style.display = 'none';
        document.body.appendChild(playerDiv);
        
        this.player = new YT.Player('youtube-player', {
            height: '1',
            width: '1',
            videoId: this.playlist[this.currentTrack].youtubeId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1
            },
            events: {
                onReady: () => {
                    this.playerReady = true;
                    this.setVolume(this.volumeSlider.value);
                },
                onStateChange: (event) => this.onPlayerStateChange(event),
                onError: () => this.nextTrack()
            }
        });
    }
    
    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            this.nextTrack();
        } else if (event.data === YT.PlayerState.PLAYING) {
            this.isPlaying = true;
            this.updatePlayButton();
            this.startReelAnimation();
        } else if (event.data === YT.PlayerState.PAUSED) {
            this.isPlaying = false;
            this.updatePlayButton();
            this.stopReelAnimation();
        }
    }
    
    togglePlay() {
        if (!this.playerReady) return;
        
        if (this.isPlaying) {
            this.player.pauseVideo();
        } else {
            this.player.playVideo();
        }
    }
    
    updatePlayButton() {
        this.playBtn.textContent = this.isPlaying ? '⏸' : '▶';
    }
    
    startReelAnimation() {
        this.leftReel.classList.add('playing');
        this.rightReel.classList.add('playing');
    }
    
    stopReelAnimation() {
        this.leftReel.classList.remove('playing');
        this.rightReel.classList.remove('playing');
    }
    
    previousTrack() {
        this.currentTrack = this.currentTrack > 0 ? this.currentTrack - 1 : this.playlist.length - 1;
        this.loadTrack();
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack();
    }
    
    loadTrack() {
        if (!this.playerReady) return;
        
        const track = this.playlist[this.currentTrack];
        this.player.loadVideoById(track.youtubeId);
        this.updateDisplay();
        this.updatePlaylistHighlight();
        
        if (this.isPlaying) {
            setTimeout(() => {
                this.player.playVideo();
            }, 500);
        }
    }
    
    updateDisplay() {
        const track = this.playlist[this.currentTrack];
        this.displayNumber.textContent = `TRACK ${String(this.currentTrack + 1).padStart(2, '0')}`;
        this.displayTitle.textContent = `${track.title} - ${track.artist}`;
    }
    
    setVolume(value) {
        if (this.playerReady) {
            this.player.setVolume(value);
        }
    }
    
    shufflePlaylist() {
        const shuffled = [...this.playlist];
        const currentSong = shuffled[this.currentTrack];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        this.playlist = shuffled;
        this.currentTrack = this.playlist.findIndex(track => track === currentSong);
        this.renderPlaylist();
        this.updatePlaylistHighlight();
        
        this.shuffleBtn.style.background = 'linear-gradient(145deg, #00ff41, #00cc33)';
        setTimeout(() => {
            this.shuffleBtn.style.background = '';
        }, 500);
    }
    
    renderPlaylist() {
        this.trackList.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'track-item';
            trackElement.innerHTML = `
                <div>
                    <div class="track-name">${track.title}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-duration">${track.duration}</div>
            `;
            
            trackElement.addEventListener('click', () => {
                this.currentTrack = index;
                this.loadTrack();
            });
            
            this.trackList.appendChild(trackElement);
        });
    }
    
    updatePlaylistHighlight() {
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, index) => {
            item.classList.toggle('playing', index === this.currentTrack);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CassetteMixtape();
});

// Vintage text effect for loading
function createVintageLoadingEffect() {
    const displayText = document.querySelector('.track-title');
    const originalText = displayText.textContent;
    
    const loadingTexts = [
        'LOADING...',
        'REWINDING...',
        'FAST FORWARD...',
        'PLAY ►'
    ];
    
    let loadingIndex = 0;
    const loadingInterval = setInterval(() => {
        displayText.textContent = loadingTexts[loadingIndex];
        loadingIndex = (loadingIndex + 1) % loadingTexts.length;
    }, 800);
    
    setTimeout(() => {
        clearInterval(loadingInterval);
        displayText.textContent = originalText;
    }, 3000);
}

// Add some sparkle effects
function addSparkleEffects() {
    const container = document.querySelector('.container');
    
    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '2px';
        sparkle.style.height = '2px';
        sparkle.style.background = '#fff';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.opacity = '0.8';
        sparkle.style.animation = 'twinkle 2s ease-out forwards';
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 2000);
    }, 3000);
}

// Add twinkle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
`;
document.head.appendChild(style);

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    createVintageLoadingEffect();
    addSparkleEffects();
});