const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);
        
        // const playlist

        const heading = $('header h2');
        const cdThumb = $('.cd-thumb');
        const audio = $('#audio');

        const cd = $('.cd');
        
        const playButton = $('.btn-toggle-play');
        const player = $('.player');
        const progress = $('#progress');
        const nextBtn = $('.btn-next');
        const prevBtn = $('.btn-prev');
        const randomBtn = $('.btn-random');
        const repeatBtn = $('.btn-repeat');
        const playlist = $('.playlist');

        const PLAYER_STORAGE_KEY = 'HE HE';
        

        const app = {
            currentIndx: 0,
            isPlaying: false,
            isRandom: false,
            isRepeat: false,
            settings: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
            setSettings: function(key, value) {
                this.settings[key] = value;
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.settings));
            },
            songs: [
                {
                    name: 'Muon Roi Ma Sao Con',
                    singer: 'Son Tung',
                    path: './audio/SƠN TÙNG M-TP - MUỘN RỒI MÀ SAO CÒN - OFFICIAL MUSIC VIDEO.mp4',
                    image: './img/sontung-muonroimasaocon.jpg'
                },

                {
                    name: 'Ngoai Troi Co Sao',
                    singer: 'Tofu',
                    path: './audio/Tofu - Ngoài Trời Có Sao ft. PC [Official Audio].mp4',
                    image: './img/ngoaitroicosao.jpg'
                },

                {
                    name: 'Banyan Tree [interlude]',
                    singer: 'Machine Gun Kelly',
                    path: './audio/Machine Gun Kelly - banyan tree [interlude] (Official Audio).mp4',
                    image: './img/machinegunkelly.jpg'
                },

                {
                    name: 'Ngoai Troi Co Sao',
                    singer: 'Tofu',
                    path: './audio/Tofu - Ngoài Trời Có Sao ft. PC [Official Audio].mp4',
                    image: './img/ngoaitroicosao.jpg'
                }
            ],
        
            render: function() {
                // console.log(123);
                const htmls = this.songs.map((song, index) => {
                    return `
                        <div class="song ${index === this.currentIndx ? 'active' : ''}" data-index="${index}">
                            <div class="thumb" 
                            style="background-image: url('${song.image}')">
                            </div>

                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                        
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `
                })
                // $('.playlist').innerHTML = htmls.join('');
                playlist.innerHTML = htmls.join('');
            },
            
            defineProperties: function() {
                Object.defineProperty(this, 'currentSong',{
                    get: function() {
                        return this.songs[this.currentIndx];
                    }
                })

               
            },

            handleEvents: function() {
                const _this = this;
                const cdWidth = cd.offsetWidth; 

                // xu ly CD quay / dung
                const cdThumbAnimated = cdThumb.animate([
                    {
                        transform: 'rotate(360deg)'
                    }
                ],{
                    duration: 10000, // 10s
                    iterations: Infinity
                })

                cdThumbAnimated.pause()
                

                // xu ly phong to thu nho dashboard
                document.onscroll = function() {
                    // console.log(window.scrollY);
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const newCdWidth = cdWidth - scrollTop;

                    
                    cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                    // cd.stylr.opacity = newCdWidth / cdWidth;
                }

                // xu ly khi click play
                playButton.onclick = function () {
                   if(_this.isPlaying){
                        _this.isPlaying = false;
                        audio.pause();
                       player.classList.remove('playing');
                   }
                   else{
                        _this.isPlaying = true;
                       audio.play();
                       player.classList.add('playing');
                    }
                }

                // song is played
                audio.onplay = function () {
                    _this.isPlaying = true;
                    player.classList.add('playing')
                    cdThumbAnimated.play();
                }

                // song is paused
                audio.onpause = function () {
                    _this.isPlaying = false;
                    player.classList.remove('playing')
                    cdThumbAnimated.pause();

                }

                // tua song
                audio.ontimeupdate = function() {
                    if(audio.duration){
                        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                        progress.value = progressPercent;
                    }
                }

                // xu ly khi tua song
                progress.onchange = function(e) {
                    const seekTime = (audio.duration / 100 * e.target.value);
                    audio.currentTime = seekTime;
                }

                // xu ly next song
                nextBtn.onclick = function() {
                    if(_this.isRandom){
                        _this.randomSong();
                    }
                    else{
                        _this.nextSong();
                    }
                    audio.play();
                    _this.render();
                    _this.scrollToActiveSong();
                }

                // xu ly prev song
                prevBtn.onclick = function() {
                    if(_this.isRandom){
                        _this.randomSong();
                    }
                    else{
                        _this.prevSong();
                    }
                    audio.play();
                    _this.render();

                }

                // xu ly random song
                randomBtn.onclick = function(e){
                    // if(_this.isRandom){
                        _this.isRandom = !_this.isRandom;
                    // }
                    _this.setSettings('isRandom', _this.isRandom);
                    e.target.classList.toggle('active', _this.isRandom);
                    // _this.randomSong();
                }

                // ket thuc song -> next song
                audio.onended = function() {
                    if(_this.isRepeat){
                        audio.play();
                    }
                    else{
                        if(_this.isRandom){
                            _this.randomSong();
                        }
                        else{
                            _this.nextSong();
                        }
                        audio.play();
                    }
                }

                // click vao playlist
                playlist.onclick = function (e) {
                    const songElement = e.target.closest('.song:not(.active');
                    if(songElement || !e.target.closet('.option')) {
                        if(songElement){
                            _this.currentIndx = Number(songElement.dataset.index);
                            _this.loadCurrentSong();
                            audio.play();
                            _this.render();
                        }

                        if(!e.target.closet('.option')){

                        }
                    }
                }

                // repeat song
                repeatBtn.onclick = function(e){
                    _this.isRepeat = !_this.isRepeat;
                    _this.setSettings('isRepeat', _this.isRepeat);

                    repeatBtn.classList.toggle('active', _this.isRepeat);
                    
                }

            },
            // getCurrentSong: function() {
            //     return this.songs[this.currentIndx];
            // },
            loadCurrentSong: function() {
                heading.textContent = this.currentSong.name;
                cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
                audio.src = this.currentSong.path;
            },
            loadSettings: function() {
                this.isRandom = this.settings.isRandom;
                this.isRepeat = this.settings.isRepeat;

                // Object.assign(this, this.config);
            },
            // next song
            nextSong: function() {
                    this.currentIndx++;
                    if(this.currentIndx >= this.songs.length){
                        this.currentIndx = 0;
                    }
                    this.loadCurrentSong();
            },
            // prev song
            prevSong: function() {
                    this.currentIndx--;
                    if(this.currentIndx < 0){
                        this.currentIndx = this.songs.length - 1;
                    }
                    this.loadCurrentSong();
            },
            // random song
            randomSong: function(){
                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * this.songs.length)
                } while(newIndex === this.currentIndx)

                this.currentIndx = newIndex;
                this.loadCurrentSong();

            },
            //repeat song
            repeatSong: function(){

            },
            scrollToActiveSong: function(){
                setTimeout(() => {
                    $('.song.active').scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',

                    })
                }, 200);
            },
            start: function() {

                this.loadSettings();

                // dinh nghia thuoc tinh cho object
                this.defineProperties();

                // lang nghe su kien DOM events
                this.handleEvents();

                // this.currentSong

                // load bai hat vao
                this.loadCurrentSong();
                // render bai hat
                this.render();

                // randomBtn.classList.toggle('active', this.isRandom);
                // repeatBtn.classList.toggle('active', this.isRepeat);

            }
        }

        app.start();







// const $ = document.querySelector.bind(document);
// const $$ = document.querySelectorAll.bind(document);

// console.log(document.querySelector('#heading').innerText);

// const app = (() => {
//     // bien local
//     const cars = ['Xe dap'];

//     const root = $('#root');

//     return {
//         add(car){
//             cars.push(car);
//         },
//         delete(index){
//             cars.splice(index, 1);
//         },
//         render() {
//             const html = cars.map(car => `
//                 <li>${car}</li>
//             `)
//             .join("");

//             root.innerHTML = html;
//         }
//     }
// }) ();

// app.render();
