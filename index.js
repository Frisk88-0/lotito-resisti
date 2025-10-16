import express from "express";

const app = express();
app.use(express.json());

// === URL DEGLI AUDIO ===
const audios = [
  "https://www.dropbox.com/scl/fi/jmdybjszgluthygtrlemk/JAMSMS-BOND-Lotito-resisti-asroma-lotito-jamesbond-bond.mp3?rlkey=gjnoupxlaymd4nlyhojm7xajn&st=u1crmc6b&dl=1",
  "https://www.dropbox.com/scl/fi/qdtztudozgfem5cm5dd0p/Lotito-acquaezucchero-medico-locchioderpadroneingrassailcavallo.mp3?rlkey=b3eji5c8893oafqbb6dwyonn1&st=ku230cp9&dl=1",
  "https://www.dropbox.com/scl/fi/ckxfkyjxhovp8rzrni2cb/Buonanotte-con-la-matematica-spiegata-dal-presidente-Lotito-9-0-3-0-Lotito-Rompipallone.mp3?rlkey=dqmqq8xub00ucofi0g0p474qg&st=zdhdrel5&dl=1",
  "https://www.dropbox.com/scl/fi/n76p0yk2hag8966d5g2k6/Bug-Fantacalcistici-fantacalcio-asta-akpapro-only-mossa-cincebte-v....mp3?rlkey=e9vft1yfwjphlnxd6cxuq1vna&st=rt8hdgwe&dl=1",
  "https://www.dropbox.com/scl/fi/krfllj69rjuh8ghikk8aq/Claudio-Lotito-ai-microfoni-di-Sky-Sport-Ho-un-nuovo-nome-sulla....mp3?rlkey=zxonifhbco1q1wwcv2czltdcz&st=f2mpqjpk&dl=1",
  "https://www.dropbox.com/scl/fi/yjqfwr3vim64g0qcyazkm/lotito-lazio-scuse-playboy-seduzione.mp3?rlkey=ye4b4qkk2oc13s6u8e31g6ms3&st=643jgcj5&dl=1"
];

// === URL IMMAGINE ===
const imageUrl = "https://www.dropbox.com/scl/fi/f67j398iwwec9j2bcakqi/LOTIRCHIORESISTI.png?rlkey=qjn4jvmzlonqmn38otzq7am00&st=r90hs2x3&dl=1";

// === FUNZIONE RANDOM AUDIO ===
function getRandomAudio() {
  const i = Math.floor(Math.random() * audios.length);
  return audios[i];
}

// === ENDPOINT ALEXA ===
app.post("/", (req, res) => {
  const request = req.body.request;

  if (!request) {
    return res.sendStatus(400);
  }

  if (request.type === "LaunchRequest" || request.intent?.name === "PlayAudioIntent") {
    const audioUrl = getRandomAudio();

    const response = {
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
        outputSpeech: {
          type: "PlainText",
          text: "Lotito resiste!"
        }
      }
    };
    return res.json(response);
  }

  if (request.type === "IntentRequest" && request.intent.name === "AMAZON.StopIntent") {
    return res.json({
      version: "1.0",
      response: {
        shouldEndSession: true,
        directives: [{ type: "AudioPlayer.Stop" }]
      }
    });
  }

  res.json({
    version: "1.0",
    response: {
      outputSpeech: { type: "PlainText", text: "Non so come aiutarti con questo." },
      shouldEndSession: true
    }
  });
});

app.listen(3000, () => console.log("Server Lotito Resisti attivo"));
