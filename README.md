# Flock
A video calling platform based in React.js maximizing productivity and promoting a healthy wellbeing! 

## Description
Flock is a real-world implementation of a video platform inspired by the Pomodoro technique that is used for more effective studying and work habits. Flock allows users to set a study break after a given amount of time to balance psychological and physical wellbeing with online work and studying. 

## How to Run

To run the application you will need a [Twilio account](https://www.twilio.com/try-twilio) and Node.js and npm installed. Start by cloning or downloading the repo to your machine.

```bash
git clone https://github.com/alvanli/Flock
cd Flock
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file by copying the `.env.example`.

```bash
cp .env.example .env
```

### Credentials
You will need your Twilio Account SID, available in your [Twilio console](https://www.twilio.com/console). Add it to the `.env` file.

You will also need an API key and secret, you can create these under the [Programmable Video Tools in your console](https://www.twilio.com/console/video/project/api-keys). Create a key pair and add them to the `.env` file too.

Once you have completed the above you can run the application with:

```bash
npm run dev
```

This will open in your browser at [localhost:3000](http://localhost:3000).
