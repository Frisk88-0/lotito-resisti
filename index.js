import express from "express";

const app = express();
app.use(express.json());

// Lista audio e immagine come prima
const audios = [ /* tutti i tuoi link mp3 */ ];
const imageUrl = "https://www.dropbox.com/scl/fi/f67j398iwwec9j2bcakqi/LOTIRCHIORESISTI.png?rlkey=qjn4jvmzlonqmn38otzq7am00&st=r90hs2x3&dl=1";

function getRandomAudio() {
  const i = Math.floor(Math.random() * audios.length);
  return audios[i];
}

app.post("/", (req, res) => {
  const request = req.body.request;

  if (!request) return res.sendStatus(400);

  if (request.type === "LaunchRequest" || request.intent?.name === "PlayAudioIntent") {
    const audioUrl = getRandomAudio();

    return res.json({
      version: "1.0",
      response: {
        shouldEndSession: true,
        directives: [
          {
            type: "AudioPlayer.Play",
            playBehavior: "REPLACE_ALL",
            audioItem: {
              stream: {
                token: "lotitoAudio",
                url: audioUrl,
                offsetInMilliseconds: 0
              }
            }
          },
          {
            type: "Alexa.Presentation.APL.RenderDocument",
            token: "lotitoAPL",
            document: {
              type: "APL",
              version: "1.1",
              mainTemplate: {
                items: [
                  {
                    type: "Image",
                    source: imageUrl,
                    width: "100vw",
                    height: "100vh",
                    scale: "best-fit"
                  }
                ]
              }
            }
          }
        ],
        outputSpeech: { type: "PlainText", text: "Lotito resiste!" }
      }
    });
  }

  if (request.type === "IntentRequest" && request.intent.name === "AMAZON.StopIntent") {
    return res.json({
      version: "1.0",
      response: { shouldEndSession: true, directives: [{ type: "AudioPlayer.Stop" }] }
    });
  }

  return res.json({
    version: "1.0",
    response: {
      outputSpeech: { type: "PlainText", text: "Non so come aiutarti con questo." },
      shouldEndSession: true
    }
  });
});

// Qui la porta dinamica
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Lotito Resisti attivo su porta ${PORT}`));
