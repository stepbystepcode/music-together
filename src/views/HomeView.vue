<script setup>
import axios from "axios";
import { ref, computed } from "vue";
import { io } from "socket.io-client";
import getInfo from "../composibles/getInfo";
import { useRoute } from "vue-router";
const route = useRoute();
let { info, load } = getInfo(route.query.hash, route.query.id);
load();
const socket = io("http://www.codingboy.xyz:3000");
if (route.query.num) {
  socket.emit("play", { num: route.query.num });
} else {
  socket.emit("play", { hash: route.query.hash, id: route.query.id });
}
socket.on("play", (arg) => {
  let audio = document.querySelector("audio");
  if (arg != null && !arg.num) {
    let { info, load } = getInfo(arg.hash, arg.id);
    (async () => {
      await load();
      console.log(info);
      console.log(info.title);
    })();
  }
  if (arg.hasOwnProperty("num")) {
    console.log();
    (async () => {
      let { data } = await axios(
        `/v3/rank/newsong?version=9108&plat=0&with_cover=1&pagesize=100&type=2&area_code=1&page=1&with_res_tag=1`
      );
      let temp = JSON.parse(data.slice(23, -21)).data.info[arg.num];
      console.log(JSON.parse(data.slice(23, -21)).data.info[arg.num]);

      let { info, load } = getInfo(temp.hash, temp.album_id);
      (async () => {
        await load();
        console.log(info);
        console.log(info.title);
      })();
    })();
  }
  audio.play();
  info.isplay = true;
});
socket.on("pause", () => {
  let audio = document.querySelector("audio");
  console.log("pause:");
  audio.pause();
  info.isplay = false;
});

let time = ref(0);
const playPause = () => {
  let audio = document.querySelector("audio");
  audio.addEventListener("timeupdate", () => {
    time.value = (audio.currentTime / audio.duration) * 100;
  });
  if (audio.paused) {
    audio.play();
    info.isplay = true;
    socket.emit("play");
  } else {
    audio.pause();
    info.isplay = false;
    socket.emit("pause");
  }
};
const changeSong = (n) => {
  let num = Number(route.query.num) + Number(n);
  window.location.href = "http://www.codingboy.xyz:3000/?num=" + num;
};
const inputBar = () => {
  let audio = document.querySelector("audio");
  audio.currentTime = (time.value / 100) * audio.duration;
};
</script>

<template>
  <div class="home">
    <img :src="info.cover" alt="" class="bg" />
    <div class="linear"></div>
    <div class="title">
      {{ info.title }}
      <router-link to="search">
        <img class="icon" src="/search.svg" alt=""
      /></router-link>
    </div>
    <audio :src="info.audioStr"></audio>
    <div class="cover-warp">
      <div class="cover">
        <img
          class="circling"
          :style="
            info.isplay
              ? 'animation-play-state:running'
              : 'animation-play-state:paused'
          "
          :src="info.cover"
          alt=""
        />
      </div>
      <div class="records"></div>
    </div>
    <div class="control-warp">
      <input
        type="range"
        min="0"
        max="100"
        v-model="time"
        @input="inputBar()"
        name=""
        id=""
      />
      <div class="control">
        <button @click="changeSong(-1)" class="previous other-button"></button>
        <button
          class="play-pause"
          :class="info.isplay ? 'pause' : 'play'"
          @click="playPause()"
        ></button>
        <button @click="changeSong(1)" class="next other-button"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@-webkit-keyframes circling {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
@keyframes circling {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-self: center;
  align-items: center;
  flex-direction: column;
}
.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-position: center;
  background-size: cover;
  filter: blur(40px);
}
.linear {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.7)
  );
}
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.2rem;
  width: 100%;
}

.circling {
  animation: circling 20s linear infinite;
}
.cover-warp {
  margin-top: 9rem;
  width: 16rem;
  height: 16rem;
  position: relative;
}
.cover {
  width: 10rem;
  height: 10rem;
  margin: -5rem 0 0 -5rem;
  position: absolute;
  top: 50%;
  left: 50%;
}
.cover img {
  width: 100%;
  height: 100%;
}
.records {
  width: 16rem;
  height: 16rem;
  background-size: cover;
  background-image: url("https://s3.music.126.net/mobile-new/img/disc-plus.png?b700b62e1971b351dcb8b8ce1c9ceea3=");
  position: absolute;
}
.control {
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-pause {
  background: none;
  border-radius: 100px;
  width: 3rem;
  height: 3rem;
  margin: 1rem;
  outline: 0;
  background: none;
  background-size: cover;
  border: 0;
}
.play {
  background-image: url(../assets/play.png);
}
.pause {
  background-image: url(../assets/pause.png);
}
.previous {
  background-image: url(../assets/previous.png) !important;
}
.next {
  background-image: url(../assets/next.png) !important;
}
.other-button {
  border: 0;
  width: 38px;
  height: 38px;
  background-size: cover;
  background: none;
  outline: 0;
}
.icon {
  position: absolute;
  right: 2rem;
}
.control-warp {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
/* .progress-bar {
  margin-top: 13rem;
  width: 75%;
  height: 2px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
}
.point {
  width: 5px;
  height: 5px;
  border-radius: 10px;
  background: #fff;
} */
[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  margin-top: 13rem;
  outline: 0;
  background-color: transparent;
  width: 300px;
}
[type="range"]::-webkit-slider-runnable-track {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}
[type="range" i]::-webkit-slider-container {
  height: 5px;
  overflow: hidden;
}
[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 5px;
  height: 5px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid transparent;
  margin-top: -2px;
  border-image: linear-gradient(#fff, #fff) 0 fill / 2 5 2 0 / 0px 0px 0 2000px;
}
</style>
