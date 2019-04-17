<template>
  <div>asdf</div>
</template>

<script>
  import {
    setCookie,
    getCookie
  } from "../assets/js/base/reg.js"
  export default {
    components: {},
    data() {
      return {};
    },
    methods: {
      layerToast(val) {
        //弹框
        this.$layer.toast({
          content: val,
          time: 2000 // 自动消失时间 toast类型默认消失时间为2000毫秒
        });
      },
      async login_submit() {

        let self = this;
        this.$layer.loading("登录中...");
        let data = await http.post("/user/login", params);
        this.$layer.close();
        if (data.code === "0000") {
          sessionStorage.setItem("loginUser", true);
          sessionStorage.setItem("loginUserId", data.data.useId);
          setCookie(
            "loginImf",
            JSON.stringify({
              name: this.login_account,
              pwd: this.login_pwd
            })
          );
          this.loginBombFlag = false;
          self.getShopList();


        } else {
          this.layerToast(data.desc);
        }
      },
    },
    computed: {},
    created() {
      this.layerToast("1213")
    },
    destroyed: function () {
    }
  };
</script>
<style scoped lang='less'>
  /*@import "../../../assets/css/H5/index";*/
</style>

