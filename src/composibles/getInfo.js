import { reactive } from 'vue'
import axios from "axios";
let res = reactive({});
let info = reactive({});
const getInfo = (hash,id) => {
    const load = async () => {
        let { data } = await axios(`/yy/yy/index.php?r=play/getdata&callback=jQuery&mid=1&hash=${hash}&platid=4&album_id=${id}&_=1672924226537`
        );
        res = JSON.parse(data.slice(7, -2)).data;
        info.title = res.song_name;
        info.cover = res.img;
        info.audioStr = res.play_url;
        info.isplay = true;
    }
    return { info, load }
}
export default getInfo
