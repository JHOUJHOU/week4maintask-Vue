// 1. 匯入Vue CDN 套件
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.prod.min.js';

// 匯入 pagination 元件
import pagination from './pagination.js';

// 匯入 delProductModal 元件
import delproduct from './delProductModal.js';

// 2. 需要串接API，先定義API路徑變數
const url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'yusyuanjhou';
let productModal = {};
let delProductModal = {};

// 3. Vue起手式，關注點分離
const app = createApp({
    // 註冊元件 區域註冊
    components: {
        pagination,
        delproduct
    },
    data() {
        return{
            // 4. 定義資料
            products: [],
            tempProduct: {
                imagesUrl:[],
            },
            isNew: false,
            // 定義 pagination 資料
            pagination: {}
        }
    },
    methods: {
        openModal(status, product) {
            // 根據點擊的狀態，判斷新增或編輯或刪除
            console.log(status, product);
            if(status === 'isNew'){
                // 新增將資料清空
                this.tempProduct = {
                    imagesUrl:[],
                }
                productModal.show();
                this.isNew = true;
            } else if(status === 'edit'){
                // 這裡要使用淺層拷貝，才不會變更到原有資料
                this.tempProduct =  { ...product };
                productModal.show();
                this.isNew = false;
            } else if(status === 'delete'){
                this.tempProduct =  { ...product };
                delProductModal.show();
            }
        },
        checkLogin() {
            // 5. 將剛剛儲存的token儲存
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)jhouToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            // 5. 每次請求後都將token傳入到headers中
            axios.defaults.headers.common['Authorization'] = token;

            const apiUrl = `${url}/api/user/check`;
            axios.post(apiUrl)
            .then(() => {
                this.getProduct();
            })
            .catch(err => {
                console.log(err);
            })

        },
        // 希望取得產品時直接做分頁，可以用參數預設值 page = 1，讓預設帶出第一頁
        // query 會使用問號去代入 ?page-${page}
        getProduct(page = 1) { 
            const apiUrl = `${url}/api/${api_path}/admin/products/?page=${page}`;
            axios.get(apiUrl)
            .then(res => {
                this.products = res.data.products;
                // 取得 pagination 資料
                this.pagination = res.data.pagination;
            })
            .catch(err => {
                console.dir(err);
            })
        },
        delProduct() {
            let apiUrl = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;

            axios.delete(apiUrl)
            .then(res => {
                // console.log(this.tempProduct);
                this.getProduct();
                delProductModal.hide();
            })
            .catch(err => {
                console.dir(err);
            })
        }
    },
    mounted() {
        this.checkLogin();
        productModal = new bootstrap.Modal(document.querySelector('#productModal'));
        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'));
    }
});
// 全域註冊。也可以用區域註冊
app.component('productModal' , {
    props: ['tempProduct','isNew'],
    template: `#templateForProductModal`,
    methods: {
        // 直接將上方剪下使用
        // 因為Modal已經做元件，所以要直接將更新的方法拉到這裡
        updateProduct() {
            let apiUrl = `${url}/api/${api_path}/admin/product`;
            let method = 'post';
            
            // 判斷不是新增，使用編輯API方式
            if(!this.isNew){
                apiUrl = `${url}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }
            console.log(url,method,this.isNew);
            axios[method](apiUrl,{ data: this.tempProduct })
            .then(res => {
                
                // console.log(this.tempProduct);
                // 新增完要重新渲染畫面
                // this.getProduct(); // 這邊沒有get Product 是外層的方法，所以需移除
                // Modal視窗新增完後關閉
                this.$emit('get-product');
                productModal.hide();
            })
            .catch(err => {
                console.dir(err);
            })
        }
    }
})

// 實體化
app.mount('#app');