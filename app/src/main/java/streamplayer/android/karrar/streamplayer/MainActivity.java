package streamplayer.android.karrar.streamplayer;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.MediaController;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.VideoView;

import streamplayer.android.karrar.streamplayer.utls.VideoPlayer;

public class MainActivity extends AppCompatActivity implements View.OnClickListener{

    // views for global accessing
    private WebView videoView;
    private RelativeLayout playbtns;
    private ImageView play;
    private ImageView stop;
    private ImageView mute;
    private EditText et;
    private Button btn;

    // to control the video
    private boolean streamvideo = false;
    private boolean playing = true;

    // to hold the video url
    private String url = "";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        // Hiding the action bar
        ActionBar ab = getSupportActionBar();
        ab.hide();


        // Defining views
        et = (EditText) findViewById(R.id.editText);
        btn = (Button) findViewById(R.id.button);
        playbtns = (RelativeLayout) findViewById(R.id.playbtns);
        play = (ImageView) findViewById(R.id.play);
        stop = (ImageView) findViewById(R.id.stop);
        mute = (ImageView) findViewById(R.id.mute);

        // Setting up the video player as a webview
        videoView = (WebView) findViewById(R.id.videoView);
        videoView.getSettings().setAppCacheEnabled(true);
        videoView.getSettings().setJavaScriptEnabled(true);

        // Setting the after video starts
        videoView.setWebViewClient(new WebViewClient(){
            public void onPageFinished(WebView view, String url){
                VideoPlayer.play(videoView);
                playbtns.setVisibility(View.VISIBLE);
                play.setImageBitmap(BitmapFactory.decodeResource(MainActivity.this.getResources(),R.drawable.ic_pause));
                playing = true;
            }
        });


        // Setting up clickables
        findViewById(R.id.button).setOnClickListener(this);
        findViewById(R.id.hidecontrolsbtn).setOnClickListener(this);
        findViewById(R.id.play).setOnClickListener(this);
        findViewById(R.id.stop).setOnClickListener(this);
        findViewById(R.id.mute).setOnClickListener(this);

    }


    // Managing the clickables
    @Override
    public void onClick(View v) {
        switch(v.getId()) {
            case R.id.play:
                if(playing){
                    play.setImageBitmap(BitmapFactory.decodeResource(MainActivity.this.getResources(),R.drawable.ic_play_arrow));
                    playing = false;
                }else{
                    play.setImageBitmap(BitmapFactory.decodeResource(MainActivity.this.getResources(),R.drawable.ic_pause));
                    playing = true;
                }
                VideoPlayer.play(videoView);
                break;

            case R.id.mute:
                VideoPlayer.mute(videoView);
                break;

            case R.id.stop:
                play.setImageBitmap(BitmapFactory.decodeResource(MainActivity.this.getResources(),R.drawable.ic_play_arrow));
                playing = false;
                VideoPlayer.stop(videoView);
                break;

            case R.id.hidecontrolsbtn:
               // Hide conrtols
                    if(playbtns.getVisibility() == v.VISIBLE){
                        playbtns.setVisibility(v.GONE);
                        VideoPlayer.HideControls(videoView);
                    }else{
                        playbtns.setVisibility(v.VISIBLE);
                        VideoPlayer.ShowControls(videoView);
                    }

                break;
            case R.id.button:
                // Play video
                if(streamvideo){
                    //videoView.stop;
                    btn.setText("Play");
                    streamvideo = false;
                }else {
                    url = et.getText().toString();
                    if (!url.equals("") && !url.contains(" ")) {
                        try {
                            VideoPlayer.Start(videoView,url);
                            btn.setText("Stop");
                            streamvideo = true;
                        } catch (Exception e) {
                            // TODO: handle exception
                            Toast.makeText(this, "Error in connecting, check your internet or video url", Toast.LENGTH_SHORT).show();
                        }
                    }
                }
                break;

        }
    }
}
