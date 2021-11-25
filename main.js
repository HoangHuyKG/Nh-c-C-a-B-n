const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const Player = $('.player')
const Progress = $('#progress')
const cdThumb = $('.cd-thumb')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeatBtn = $('.btn-repeat')
const Playlist = $('.playlist')
const RandomBtn = $('.btn-random')
const app = { 
    Currentsongindex: 0,
    isPlaying: false,
    isRepeat: false,
    isRandom:false,
    songs: [
    {
      name: "Nevada",
      singer: "Monstercat",
      path: "./song/nevada.mp3",
      image: "./img/nevada.jpg"
    },
    {
        name: "Faded",
        singer: "Alan Walker",
        path: "./song/faded.mp3",
        image: "./img/faded.jpg"
    },
    {
        name: "Wake Me Up",
        singer: "Avicii",
        path: "./song/wmu.mp3",
        image: "./img/wmu.jfif"
    },
    {
        name: "Nói đi là đi",
        singer: "Tân Hy Khánh,Tiêu Châu Như Quỳnh",
        path: "./song/NDLD.mp3",
        image: "./img/NDLD.jpg"
      },
      {
          name: "Lỗi của anh",
          singer: "Ngô Kiến Huy",
          path: "./song/LCA.mp3",
          image: "./img/NKH.jpg"
      },
      {
          name: "Chợt thấy em khóc",
          singer: "Noo Phước Thịnh",
          path: "./song/CTEK.mp3",
          image: "./img/NOO.jpg"
      },
      {
        name: "Thương Em là điều anh không thể ngờ",
        singer: "Noo Phước Thịnh",
        path: "./song/TELDAKTN.mp3",
        image: "./img/NOO.jpg"
    },  
    {
        name: "Giá ngày đầu đừng nói câu thương nhau",
        singer: "Issac",
        path: "./song/gnddnctn.mp3",
        image: "./img/Issac.jpg"
    },
    
      
    ],
    DefineInMyApp: function () {
        Object.defineProperty(this, 'Currentsong', {
            get: function() {
                return this.songs[this.Currentsongindex]
            }
        })
    },
    render: function () {
        const htmls = this.songs.map((song,i) => {
            return `
        <div class="song ${i == this.Currentsongindex ? 'active':''}" data-index="${i}">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
        </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    loadCurrentSong: function () {
        const heading = $('header h2')
        
        heading.textContent = this.Currentsong.name
        cdThumb.style.backgroundImage = `url('${this.Currentsong.image}')`
        audio.src = this.Currentsong.path
    },
    nextSong: function () {
        this.Currentsongindex++
        if(this.Currentsongindex >= this.songs.length){
            this.Currentsongindex = 0
        }
        this.loadCurrentSong()
        this.render()
        this.scrollNextSong()
    },
    prevSong: function () {
        this.Currentsongindex--
        if(this.Currentsongindex < 0){
            this.Currentsongindex = this.songs.length - 1
        }
        this.loadCurrentSong()
        this.render()
        this.scrollNextSong()
    },
    playrandomSong: function(){
        let newRandom
        do {
            newRandom = Math.floor(Math.random()*this.songs.length)
        } while (newRandom === this.Currentsongindex)
        this.Currentsongindex = newRandom
        this.loadCurrentSong()
        this.render()
    },
    scrollNextSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        },300)
    },
    handleEvents: function () {
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        const _this = this
        document.onscroll = function (){
            const ScrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - ScrollTop 

            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ] , {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        playBtn.onclick = function () {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function () {
            _this.isPlaying = true
            Player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false
            Player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function () {
            if(audio.duration){
                const ProgressPerCent = Math.floor(audio.currentTime / audio.duration*100)
                Progress.value = ProgressPerCent
            }
        }
        Progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        nextBtn.onclick = function () {
            if(_this.isRandom){
                _this.playrandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }
        prevBtn.onclick = function () {
            if(_this.isRandom){
                _this.playrandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
        }
        audio.onended = function () {
            if(_this.isRepeat){
                audio.play()
            } else {
            _this.nextSong()
            audio.play()
            }
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        RandomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            RandomBtn.classList.toggle('active', _this.isRandom)
        }
        Playlist.onclick = (e)=> {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    _this.Currentsongindex = songNode.dataset.index 
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')){
                    
                }
            }
        }
    },
    start: function () {
        this.DefineInMyApp()
        this.loadCurrentSong()
        this.handleEvents()
        this.render()
    }
} 
app.start()