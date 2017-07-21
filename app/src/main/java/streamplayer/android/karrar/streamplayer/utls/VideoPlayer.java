package streamplayer.android.karrar.streamplayer.utls;

import android.webkit.WebView;

/**
 * Created by karrar on 7/21/17.
 */

public class VideoPlayer {

    // video head containing wanted js and css
    private static String head = "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link href=\"https://fonts.googleapis.com/css?family=Montserrat\" rel=\"stylesheet\"><link href=\"https://fonts.googleapis.com/css?family=Raleway\" rel=\"stylesheet\"><link rel=\"shortcut icon\" href=\"file:///android_asset/player/docs/img/favicon.png\"><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css\"><link rel=\"stylesheet\" href=\"file:///android_asset/player/dist/css/player.min.css\"></head><body>";

    // video end containing all java script for controlling the video
    private static String end = "</body><script src=\"file:///android_asset/player/dist/js/player.min.js\"></script> <script>player('.video', {autoPlay: false}); </script> <script>function hideControls() {var d = document.getElementsByClassName('player__controls');d[0].style.display = 'none'; return false;}; function showControls() {var d = document.getElementsByClassName('player__controls');d[0].style.display = 'block';return false;}; function hideControlsBtns() { var d = document.getElementsByClassName('player__btn player--left player__toggle'); d[0].style.display = 'none';   d = document.getElementsByClassName('player__btn player--left player__stop'); d[0].style.display = 'none';   d = document.getElementsByClassName('player__btn player--left player__mute'); d[0].style.display = 'none';  return false; }; hideControlsBtns();      function play() { var x = document.getElementsByClassName('player__btn player--left player__toggle'); x[0].click(); return false; };  function stop() { var x = document.getElementsByClassName('player__btn player--left player__stop'); x[0].click(); return false; };  function mute() { var x = document.getElementsByClassName('player__btn player--left player__mute'); x[0].click(); return false; };</script>  </html>";




    // Calling this to start the video
    public static void Start(WebView wv, String url){
        String video = "<video class=\"video\" src=\""+url+"\"></video>";
        wv.loadDataWithBaseURL("", head+video+end, "text/html", "UTF-8", "");
    }

    // Calling this to show control buttons
    public static void ShowControls(WebView wv){
        String js ="javascript:showControls();";
        wv.loadUrl(js);
    }

    // Calling this to hide control buttons
    public static void HideControls(WebView wv){
        String js ="javascript:hideControls();";
        wv.loadUrl(js);
    }

    // Calling this to play/pause the video
    public static void play(WebView wv){
        String js ="javascript:play();";
        wv.loadUrl(js);
    }

    // Calling this to stop the video
    public static void stop(WebView wv){
        String js ="javascript:stop();";
        wv.loadUrl(js);
    }

    // Calling this to mute the video
    public static void mute(WebView wv){
        String js ="javascript:mute();";
        wv.loadUrl(js);
    }

}
