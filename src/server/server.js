var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});
var fs = require('fs');
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/usr/local/bin/ffmpeg", // Where is the FFmpeg binary located?
    "outputPath": "./downloads", // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest", // What video quality should be used?
    "queueParallelism": 2, // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000 // How long should be the interval of the progress reports
});

app.use(
    express.urlencoded({
        extended: true
    })
);

app.get('/files/:videoId', (req, res) => {
    var fileName = __dirname + `/downloads/${req.params.videoId}.mp3`;
    res.download(fileName, function (err) {
        if (err) {
            console.log(err);
        } else {
            fs.unlink(fileName, function () {
                console.log("File was deleted") // Callback
            });
        }
    });
})

io.on('connection', (socket) => {
    console.log("User connected");

    socket.on('start-download', (videoid) => {
        console.log(videoid);
        //Download video and save as MP3 file
        YD.download(videoid, `${videoid}.mp3`);
        YD.on("finished", function (err, data) {
            console.log(`Finished downloading ${videoid}`);
            io.emit('download-completed', videoid);
        });
        YD.on("error", function (error) {
            console.log(error);
            console.log(`Error downloading ${videoid}`);
            io.emit('download-error', videoid);
        });
        YD.on("progress", function (progress) {
            console.log(JSON.stringify(progress));
        });

    });
});

var port = process.env.PORT || 3001;

server.listen(port, function () {
    console.log('listening in http://localhost:' + port);
});