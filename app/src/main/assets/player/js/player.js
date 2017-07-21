(function() {
  'use strict';
  var Boxx = function (element, settings) {
    this.container;
    this.video = element;
    this.volume = .5;

    // icons
    this.playIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M13 6L1 12V0l12 6z"/></svg>';
    this.pauseIcon = '<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path class="st0" d="M1 0h3v12H1V0zm9 0h3v12h-3V0z"/></svg>';
    this.stopIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M1 0h12v12H1V0z"/></svg>';
    this.muteIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path opacity=".25" d="M0 8h3v4H0zM12 0h3v12h-3zM6 4h3v8H6z"/></svg>';
    this.volumeFullIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M0 8h3v4H0V8zM6 4h3v8H6zM12 0h3v12h-3z"/></svg>';
    this.volumeHalfIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M0 8h3v4H0V8zm6-4h3v8H6z"/><path opacity=".25" d="M12 0h3v12h-3z"/></svg>';
    this.volumeLowIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M0 8h3v4H0V8z"/><path opacity=".25" d="M6 4h3v8H6zm6-4h3v12h-3z"/></svg>';
    this.fullIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M3 5V2h3V0H1v5h2zm5-3h3v3h2V0H8v2zm3 5v3H8v2h5V7h-2zm-5 3H3V7H1v5h5v-2z"/></svg>';
    this.exitfullIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 12"><path d="M4 0v3H1v2h5V0H4zm9 3h-3V0H8v5h5V3zm-3 9V9h3V7H8v5h2zM1 9h3v3h2V7H1v2z"/></svg>';

    this.defaults = {
      playLabel: 'Play video',
      pauseLabel: 'Pause video',
      stopLabel: 'Stop video',
      muteLabel: 'Mute video',
      unmuteLabel: 'Unmute video',
      volumeLabel: 'Volume',
     // fullLabel: 'Full screen',
      //exitfullLabel: 'Exit full screen',
      autoPlay: false,
    };

    this.options = extendDefaults(this.defaults, settings);

    this.open();
  };





  Boxx.prototype = {
    open: function() {
      var self = this;
      
      build.call(this);
      bindEvents.call(this);

      setTimeout(function() {
        self.time.addIcon(formatTime(0) + ' - ' + formatTime(self.video.elem.duration));
      }, 500);

      if (this.options.autoPlay) {
        toggleVideo.call(this);
      }
    }
  };




  function build() {
    var frag = document.createDocumentFragment();

    this.container = UI.make()
                       .appendTo(frag)
                       .addClass('player');

    this.video = UI.assign(this.video)
                   .appendTo(this.container)
                   .addClass('player__video');

    this.controls = UI.make()
                      .appendTo(this.container)
                      .addClass('player__controls');

    this.progress = UI.make()
                      .appendTo(this.controls)
                      .addClass('player__progress')
                      .onClick(jump.bind(this))
                      .onDrag(jump.bind(this));

    this.line = UI.make()
                  .appendTo(this.progress)
                  .addClass('player__progress-bar');

    this.time = UI.make()
                  .appendTo(this.controls)
                  .addClass('player__btn player--right player__time');


    this.toggle = UI.make('button')
                    .appendTo(this.controls)
                    .addClass('player__btn player--left player__toggle')
                    .addIcon(this.playIcon)
                    .addLabel(this.options.playLabel)
                    .onClick(toggleVideo.bind(this));

    this.stop = UI.make('button')
                  .appendTo(this.controls)
                  .addClass('player__btn player--left player__stop')
                  .addIcon(this.stopIcon)
                  .addLabel(this.options.stopLabel)
                  .onClick(stopVideo.bind(this));

    this.mute = UI.make('button')
                  .appendTo(this.controls)
                  .addClass('player__btn player--left player__mute')
                  .addIcon(this.volumeHalfIcon)
                  .addLabel(this.options.muteLabel)
                  .onClick(toggleMute.bind(this));

    this.rangecontainer = UI.make()
                            .appendTo(this.controls)
                            .addClass('player__range')
                            .addLabel(this.options.volumeLabel)
                            .onDrag(volumeChange.bind(this));

    this.rangeline = UI.make()
                       .appendTo(this.rangecontainer)
                       .addClass('player__range-line');

    this.rangefull = UI.make()
                       .appendTo(this.rangecontainer)
                       .addClass('player__range-full')
                       .onClick(volumeChange.bind(this));

  //  this.full = UI.make('button')
    //              .appendTo(this.controls)
      //            .addClass('player__btn player--right player__full')
        //          .addLabel(this.options.fullLabel)
          //        .addIcon(this.fullIcon);

    document.body.appendChild(frag);
  }




  // UI API
  // ==================================
  function UI(elem) {
    this.elem = elem;
  }

  UI.assign = function(element) {
    var elem = element;
    return new UI(elem);
  }

  UI.make = function(tag) {
    var elem = document.createElement(tag || 'div');
    return new UI(elem);
  };
  


  UI.prototype = {
    addClass: function(cl) {
      var self = this.elem;
      
      cl.split(' ').forEach(function(item){
        self.classList.add(item);
      });
      
      return this;
    },
    toggleClass: function(cl) {
      this.elem.classList.toggle(cl);
      
      return this;
    },
    addLabel: function(label) {
      this.elem.title = label;
      
      return this;
    },
    addIcon: function(icon) {
      this.elem.innerHTML = icon;
      
      return this;
    },
    appendTo: function(parent) {
      if (parent instanceof UI) {
        parent.elem.appendChild(this.elem);
      } else {
        parent.appendChild(this.elem);
      }
      
      return this;
    },
    addStyles: function(styles) {
      styles = styles || {};

      for (var prop in styles) {
        if (styles.hasOwnProperty(prop)) {
          this.elem.style[prop] = styles[prop];
        }
      }
      
      return this;
    },
    onClick: function(callback) {
      this.elem.addEventListener('click', callback);
      
      return this;
    },
    onDrag: function(callback) {
      this.elem.addEventListener('mousedown', function(e) {
        callback(e);
        
        this.parentNode.onmousemove = function(e) {
          e.preventDefault();
          callback(e);
        };
      });
      
      this.elem.addEventListener('mouseup', function(e) {
        this.parentNode.onmousemove = null;
      });
      
      this.elem.addEventListener('mouseleave', function(e) {
        this.parentNode.onmousemove = null;
      });
      
      return this;
    }
  };




  // UI actions
  // ==================================
  function toggleVideo() {
    var that = this,
        video = this.video.elem,
        toggle = this.toggle,
        checkProgress,
        checkTime;

    if (video.paused) {
      video.play();
      toggle.addIcon(this.pauseIcon);
      toggle.addLabel(this.options.pauseLabel);
      
      checkTime = setInterval(function () {
        updateTime.call(that);
      }, 1000);
      
      checkProgress = setInterval(function () {
        updateProgress.call(that);
      }, 500);
    } else {
      video.pause();
      toggle.addIcon(this.playIcon);
      toggle.addLabel(this.options.playLabel);
      
      clearInterval(checkTime);
      
      clearInterval(checkProgress);
    }
  }


  function stopVideo() {
    var self = this,
        video = this.video.elem;
        
    video.currentTime = 0;
    updateTime.call(this);
    
    setTimeout(function() {
      video.pause();
      self.toggle.addIcon(self.playIcon);
      self.toggle.addLabel(self.options.playLabel);
    }, 10);
  }


  //function toggleFullScreen() {
    //this.container.toggleClass('player--full');

    //if (this.fullScreen) {
      //this.full.addIcon(this.fullIcon);
      //this.full.addLabel(this.options.fullLabel);
   // } else {
     // this.full.addIcon(this.exitfullIcon);
      //this.full.addLabel(this.options.exitfullLabel);
   // }

    //this.fullScreen = !this.fullScreen;
//  }


  function toggleMute() {
    var video = this.video.elem,
        rangeLevel = this.rangeline.elem;

    if (video.volume !== 0) {
      video.volume = 0;
      rangeLevel.style.width = '0%';
    } else {
      var volumeLevel = (this.volumeLevel != 0) ? this.volumeLevel : 0.5;
      
      video.volume = volumeLevel;
      rangeLevel.style.width = (volumeLevel * 100) + '%';
    }

    updateVolumeLabels.call(this);
  }


  function updateVolumeLabels() {
    var mute = this.mute,
        volume = this.video.elem.volume;

    if (volume === 0) {
      mute.addIcon(this.muteIcon);
      mute.addLabel(this.options.unmuteLabel);
    } else if (0 < volume && volume <= 0.33) {
      mute.addIcon(this.volumeLowIcon);
    } else if (0.33 < volume && volume <= 0.66) {
      mute.addIcon(this.volumeHalfIcon);
    } else if (volume > 0.66) {
      mute.addIcon(this.volumeFullIcon);
      mute.addLabel(this.options.muteLabel);
    }
  }


  function updateVolume(volume) {
    // stop if volume is negative
    if (volume < 0) return;

    if (volume < 0.1) {
      this.video.elem.volume = 0;
      // store the last volume level for unmute volume restore
      this.volumeLevel = 0;
    } else if (volume > 0.95) {
      this.video.elem.volume = 1;
      // store the last volume level for unmute volume restore
      this.volumeLevel = 1;
    } else {
      this.video.elem.volume = volume;
      // store the last volume level for unmute volume restore
      this.volumeLevel = volume;
    }
  }


  function volumeChange(e) {
    var volumeWidth = Math.floor((e.offsetX / this.rangecontainer.elem.offsetWidth) * 100),
        volumeRate = volumeWidth / 100;

    if (volumeRate > 1.01) return;

    this.rangeline.elem.style.width = volumeWidth + '%';
    updateVolume.call(this, volumeRate);
    updateVolumeLabels.call(this);
  }


  function jump(e) {
    var jumpTime = (e.offsetX / this.progress.elem.offsetWidth) * this.video.elem.duration;
    
    this.video.elem.currentTime = jumpTime;
    updateProgress.call(this);
  }


  function updateTime() {
    var passedTime = formatTime(this.video.elem.currentTime),
    fullTime = formatTime(this.video.elem.duration);

    this.time.addIcon(passedTime + ' - ' + fullTime);
  }


  function updateProgress() {
    var passedTime = this.video.elem.currentTime,
        fullTime = this.video.elem.duration;

    this.line.elem.style.width = (passedTime / fullTime) * 100 + '%';
  }


  function formatTime(time) {
    var secNum = Math.floor(time),
        hours   = Math.floor(secNum / 3600),
        minutes = Math.floor((secNum - (hours * 3600)) / 60),
        seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
      hours = '0' + hours;
    }
    
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    
    if (seconds < 10) {
      seconds = '0' + seconds;
    } 

    return hours + ':' + minutes + ':' + seconds;
  }




  // helpers
  // ==================================
  function extendDefaults(defaults, settings) {
    var property;
    
    for (property in settings) {
      if (settings.hasOwnProperty(property)) {
        defaults[property] = settings[property];
      }
    }
    
    return defaults;
  }


  function bindEvents() {
    var playerObj = this, // reference to Boxxi obj
        mouseIn = false, // mouse over player video to enable keyboard shortcuts
        focusedElement = document.activeElement;

    // enable keyboard shortcuts
    this.video.elem.addEventListener('mouseenter', function(){
      mouseIn = true;
      // remove focus from last clicked button
      document.activeElement.blur();
    });

    // disable keyboard shortcuts
    this.container.elem.addEventListener('mouseout', function(){
      mouseIn = false;
    });

    // remove right click context menu on video element
    this.video.elem.addEventListener('contextmenu', function(e){
      e.preventDefault();
    });

    // start/stop video on space key press
    window.addEventListener('keydown', function(e){
      if (mouseIn && (e.keyCode === 32)) {
        e.preventDefault();
        toggleVideo.call(playerObj);
      }
    });

    // toggle full screen on F12 key press
 //   window.addEventListener('keydown', function(e){
   //   if (mouseIn && (e.keyCode === 123)) toggleFullScreen.call(playerObj);
   // });

    // toggle full screen on fullscreen button click
    //this.full.elem.addEventListener('click', toggleFullScreen.bind(this));
  }




  // export
  // ==================================
  window.player = function(selector, settings) {
    var videos = document.querySelectorAll(selector);
    
    [].forEach.call(videos, function(item) {
      return new Boxx(item, settings);
    });
  };
})();
