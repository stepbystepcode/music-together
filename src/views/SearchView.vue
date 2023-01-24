<script setup>
import { reactive, ref } from "vue";
import axios from "axios";
let song = ref("");
let info = reactive({});
let list = ref([]);
let recommend = ref(true);
let search = async () => {
  recommend.value = false;
  let { data } = await axios(
    `/api/v3/search/song?format=json&keyword=${song.value}&page=1&pagesize=20&showtype=1`
  );
  console.log(data);
  info.value = data.data.info;
};
(async () => {
  let { data } = await axios(
    `/v3/rank/newsong?version=9108&plat=0&with_cover=1&pagesize=100&type=2&area_code=1&page=1&with_res_tag=1`
  );
  list.value = JSON.parse(data.slice(23, -21)).data.info;
  console.log(list.value);
})();
</script>

<template>
  <div class="search">
    <div class="search-box">
      <img class="icon" src="/search.svg" alt="" />
      <input type="text" name="" id="" v-model="song" />
      <button @click="search()">Search</button>
    </div>
    <div class="list" v-if="!recommend">
      <ul>
        <li v-for="(item, index) in info.value" :key="index">
          <router-link
            :to="{ path: '/', query: { hash: item.hash, id: item.album_id } }"
            ><span class="songname">{{ item.songname }}</span
            ><br /><span class="full">{{ item.filename }}</span></router-link
          >
        </li>
      </ul>
    </div>
    <div class="recommend list" v-if="recommend">
      <ul>
        <li v-for="(song, index) in list" :key="song">
          <router-link :to="{ path: '/', query: { num: index } }"
            ><span class="songname">{{ song.songname }}</span
            ><br /><span class="full">{{ song.filename }}</span></router-link
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: black;
  color: #fff;
  height: 100%;
  min-height: 100vh;
}
.search-box {
  background: #2c2c2c;
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.icon {
  position: relative;
  left: 2rem;
}
.search-box input {
  background: #414141;
  border-radius: 40px;
  border: 0;
  width: 70%;
  height: 2rem;
  outline: 0;
  color: #fff;
  padding-left: 3rem;
}
.search-box button {
  background: none;
  outline: none;
  color: #fff;
  border: 0;
  font-size: 1.2rem;
}
.list {
  background: #2b2b2b;
  border-radius: 0.3rem;
  margin: 1rem;
  width: 90%;
}
.list ul li {
  padding: 1rem;
}
.songname {
  color: #597ba0;
}
.full {
  font-size: 14px;
  color: #9f9f9f;
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>
