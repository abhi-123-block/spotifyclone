let currentsong = new Audio();
let songs;
let currfolder;

function convertTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // padStart ensures there is always a leading zero if the number is less than 10
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${currfolder}`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href && element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];

    // 1. Clear the placeholder <li> if you want a clean list
    songul.innerHTML = "";

    for (const song of songs) {
        // 2. Format the name (remove .mp3 and fix spaces)
        let songName = song.replaceAll("%20", " ");

        // 3. Create the full music card structure for each song
        songul.innerHTML += `
            <li> 
                <img class="invert" src="img/music.svg" alt="music">
                <div class="info">
                    <div>${songName}</div>
                    <div>Arijit Singh</div> 
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="play">
                </div>
            </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)isko karne se ek sare gane click karne par bhi chalenge
    currentsong.src = `${currfolder}` + track
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 /00:00"

}

async function displsyalbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/ `)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach(e =>{
        if(e.href.includes("/songs")){
            console.log(e.href)
        }
    })
}
async function main() {
    await getsongs("ncs");
    playmusic(songs[0], true)

    displsyalbums()
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertTime(currentsong.currentTime)} / ${convertTime(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
        else {
            playmusic(songs[0])
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`${item.currentTarget.dataset.folder}`);

        })
    })
}
main()


