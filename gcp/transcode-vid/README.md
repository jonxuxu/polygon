# Transcode Vid

This project runs on AWS lightsail, previously on Google App Engine

It listens for videos uploaded to our video-world-source bucket, then:

- converts the videos to hls using ffmpeg and uploads to video-world-transcoded
- converts the videos to wav using ffmpeg and uploads to video-world-audio

# Quickstart for Node.js with AWS Lightsail

- [Setup](#setup)
- [Running locally](#running-locally)
- [Deploying to Lightsail](#deploying-to-lightsail)

## Running locally

    npm start

## Deploying to Lightsail

- open the ssh to terminal to the lightsail instance
- git pull, or use Filezilla to transfer the relevant files over

**Creating a screen**
`screen -S your_session_name`

**Exiting from a screen**
press and hold: ctrl a d

**Closing all screens**
`pkill screen`
