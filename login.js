// 1. 匯入Vue CDN 套件
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.prod.min.js';

// 2. 需要串接API，先定義API路徑變數
const url = 'https://vue3-course-api.hexschool.io/v2';

// 3. Vue起手式，關注點分離
const app = createApp({
    data() {
        return {
            // 4. 定義API需要的資料
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        login() {
            // 5. 定義API路徑要傳入AJAX參數
            const apiUrl = `${url}/admin/signin`;
            axios.post(apiUrl,this.user)
            .then(res => {
                // 6. 執行登入API成功，會回傳token、expired(使用時間)，定義變數取出
                const { token , expired } = res.data;
                // 7. 讓tokene 跟 expirrd，透過瀏覽器cookies儲存。
                // 使用unix timestamp時間格式
                document.cookie = `jhouToken=${token}; expires=${new Date(expired)}`;

                // 8. 登入驗證成功後，切換至後台頁面，這裡一定要家.html
                window.location = './backstage.html';

            })
            .catch(err => {
                console.dir(err);
            })
        }
    },
});

// 實體化
app.mount('#app');