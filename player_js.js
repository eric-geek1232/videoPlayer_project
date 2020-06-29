class Video{
    constructor(selector){
        this.selector = selector;
        this.playerElement = document.querySelector(selector);
        this.videoElement = document.querySelector(selector + " video");

        this.bindEvents();
    }

    bindEvents(){
        this.playPause_btn = document.querySelector(this.selector + " .play-pause");
        this.showVolume_btn= document.querySelector(this.selector + " .show-volume");
        this.volumenRange= document.querySelector(this.selector + " #volume-range");
        this.progressBar = document.querySelector(this.selector + " .bar");
        this.progressConteinerBar = document.querySelector(this.selector + " .progress");
        this.fullScreen_btn = document.querySelector(this.selector + " .set-full-screen");
        this.showSpeed_btn = document.querySelector(this.selector + " .show-speed");
        this.playBackRate_btns = document.querySelectorAll(this.selector + " .playBackRate");

        this.playPause_btn.addEventListener('click', ()=> this.playPause());
        this.showVolume_btn.addEventListener('click', ()=> this.toggleVolume());
        this.showSpeed_btn.addEventListener('click', ()=> this.toggleSpeed());
        this.volumenRange.addEventListener('input', ()=> this.controlVolume());
        this.videoElement.addEventListener('timeupdate', ()=> this.updateProgress());
        this.setFullDuration();
        this.videoElement.addEventListener('durationchange', ()=> this.setFullDuration());
        this.fullScreen_btn.addEventListener('click', ()=> this.setFullScreen());
        this.progressConteinerBar.addEventListener('click', (ev)=> this.setDuration(ev));
        document.addEventListener('keydown', (ev)=>{
            if(ev.keyCode == 32) this.playPause(); //37-40 77M 32p
            if(ev.keyCode == 77) this.muteVolume();
            this.setKeyTime(ev.keyCode);
        });
        
        this.playBackRate_btns.forEach((el)=>{
            el.addEventListener('click', ()=> this.setPlayBackRate(el));
        });
    }

    setDuration(ev){
        let el = ev.currentTarget;
        let positions = this.getRelativeCoordinates(ev, el);
        let fullWidth = el.offsetWidth;
        let percentage = positions.x / fullWidth;

        let time = this.videoElement.duration * percentage;
        this.videoElement.currentTime = time;
    }

    setKeyTime(keyCode){
        if(keyCode == 37){
            this.videoElement.currentTime -= 5; 
        }
        if(keyCode == 39){
            this.videoElement.currentTime += 5; 
        }
    }

    playPause(){
        if(this.videoElement.paused){
            this.videoElement.play();
            this.playPause_btn.innerHTML = "pause";

        }else{
            this.videoElement.pause();
            this.playPause_btn.innerHTML = "play_arrow";
        }
    }

    toggleVolume(){
        document.querySelector(this.selector + " .volume").classList.toggle('active');
    }

    toggleSpeed(){
        document.querySelector(this.selector + " .speed").classList.toggle('active');
    }

    controlVolume(){
        if(this.volumenRange.value == 0){
            this.showVolume_btn.innerHTML = "volume_mute";
        }else if(this.volumenRange.value <= 0.5){
            this.showVolume_btn.innerHTML = "volume_down";
        }else{
            this.showVolume_btn.innerHTML = "volume_up";
        }
        this.videoElement.volume = this.volumenRange.value;
    }

    muteVolume(){
        if(this.videoElement.volume == 0){
            this.volumenRange.value = 1;
            this.videoElement.volume = this.volumenRange.value; 
            this.showVolume_btn.innerHTML = 'volume_up';
            this.volumenRange.value = 1;
        } else{
            this.volumenRange.value = 0;
            this.videoElement.volume = this.volumenRange.value;
            this.showVolume_btn.innerHTML = 'volume_mute';
        }
    }

    updateProgress(){
        let currentTime = this.videoElement.currentTime;
        let fullTime = this.videoElement.duration;

        this.setTime(currentTime," .current-duration");

        let percentage = Math.floor((currentTime * 100) / fullTime);

        this.progressBar.style.width = percentage+"%";
    }

    setFullDuration(){
        this.setTime(this.videoElement.duration, ".full-duration");
    }

    setTime(duration, selector){
        let minutes = parseInt(duration / 60, 10);
        let seconds = parseInt(duration % 60);

        /*if(minutes < 10){
            minutes = "0" + minutes;
        }
        if(seconds < 10){
            seconds = "0" + seconds;
        }
        o de otra manera con el operador ternario
        */

        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        document.querySelector(this.selector + " "+ selector)
        .innerHTML = minutes + ":" + seconds;
    }

    setFullScreen(){
        let fullScreenFuntion = this.videoElement.requestFullscreen ||
                                this.videoElement.webkitRequestFullScreen ||
                                this.videoElement.mozRequestFullScreen ||
                                this.videoElement.msRequestFullscreen;

        fullScreenFuntion.call(this.videoElement);
    }

    setPlayBackRate(el){
        let speed = parseFloat(el.dataset.value);

        this.videoElement.playbackRate = speed;

        this.toggleSpeed();
    }

    getRelativeCoordinates(e, container){
        let pos = {}, offset = {}, ref;
        ref = container.offsetParent;
          pos.x = !! e.touches ? e.touches[ 0 ].pageX : e.pageX;
         pos.y = !! e.touches ? e.touches[ 0 ].pageY : e.pageY;
         offset.left = container.offsetLeft;
        offset.top = container.offsetTop;
          while(ref){
            offset.left += ref.offsetLeft;
             offset.top += ref.offsetTop;
               ref = ref.offsetParent;
        }
          return {
               x : pos.x - offset.left,
               y : pos.y - offset.top,
        };
   }
}