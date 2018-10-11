<!-- 登录 -->
<template>
  <el-container id="login">
    <el-main class="background-img"
             :style="imgbg">
      <div class="content">
        <div class="sloganBox">
          <!-- <img :src="img.slogan" /> -->
        </div>
        <div class="main">
          <h4 class="fz1"
              style="color:#3D4955;text-align:center;">后台登陆</h4>
          <el-form :model="ruleForm"
                   ref="ruleForm">
            <el-form-item>
              <el-input placeholder="用户名"
                        v-model="ruleForm.userName"
                        size="medium"
                        prefix-icon="el-icon-town-yonghuming">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入您的密码"
                        type="password"
                        v-model="ruleForm.passWord"
                        size="medium"
                        @keyup.enter.native="userSubmit"
                        prefix-icon="el-icon-town-mima"></el-input>
            </el-form-item>

            <el-form-item>
              <!-- @click="submitForm" -->
              <el-button class="login"
                         type="primary"
                         size="medium"
                         :loading="submitLoading"
                         @click="userSubmit">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <el-footer class="footerbox">
      <span>copyright ©2018 mark2麦子智能科技. All Rights Reserved 粤ICP备18026354号</span>
    </el-footer>
  </el-container>
</template>
<script>
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      submitLoading: false,
      //图片资源
      img: {
        loginLogo: require("@/assets/img/imesLogo.png")
      },
      imgbg: {
        backgroundImage: "url(" + require("../../assets/img/loginbg.png") + ")",
        backgroundRepeat: "no-repeat"
      },
      // 表单数据
      ruleForm: {
        userName: "", // 账户
        passWord: "" // 密码
      }
    };
  },
  methods: {
    //获取cookie
    // getCookie(name) {
    //   var arr;
    //   var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    //   if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    //   else return null;
    // },
    //用户登录
    userSubmit() {
      axios
        .post("http://www.imes-inc.ser:8000/m2_system/system/toLogin.do", {
          userName: this.ruleForm.userName,
          password: this.ruleForm.passWord
        })
        .then(res => {
          if (res.data.status === 0) {
            //请求成功
            // if (this.getCookie("skip_url")) {
            //   // window.location.href = skip_url;
            //   console.log(this.getCookie("skip_url"),"wwww");
            // } else {
            //   //默认首页
            // }
          } else {
            //失败
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
#login {
  height: 100vh;
  .background-img {
    position: relative;
    width: 100%;
    min-width: 1200px;
    height: 750px;
    // background: url(../../assets/img/loginbg.png) no-repeat;
    .content {
      width: 1200px;
      height: 420px;
      margin: 0 auto;
      position: absolute;
      top: 150px;
      left: 200px;
      display: inline-block;
      .sloganBox {
        display: inline-block;
        width: 500px;
        height: 340px;
        img {
          width: 100%;
          display: inline-block;
          vertical-align: middle;
        }
      }
      .main {
        margin-left: 260px;
        display: inline-block;
        background: #fff;
        padding: 40px;
        width: 300px;
        height: 310px;
        border-radius: 8px;
        .el-form {
          margin: 40px auto;
          width: 100%;
          .login {
            width: 100%;
            margin-top: 20px;
            border-radius: 3px;
          }
        }
      }
    }
  }
  .footerbox {
    width: 100%;
    line-height: 60px;
    text-align: center;
    font-size: 14px;
    color: #c0c4cc;
  }
}
</style>
