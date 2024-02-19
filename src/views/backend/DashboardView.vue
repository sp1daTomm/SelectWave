<template>
  <router-view v-if="status" />
</template>
<script>
export default {
  data() {
    return {
      status: false,
    };
  },
  created() {
    // 從 cookie 取出 token，所有 axios 請求都會加上 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)selectWaveToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1',
    );
    this.$http.defaults.headers.common.Authorization = token;

    // 檢查用戶是否仍持續登入
    const api = `${import.meta.env.VITE_APP_API_URL}/api/auth/check`;
    this.$http.get(api, {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.data.status) {
          this.status = true;
        } else {
          this.status = false;
          this.$swal({
            title: '登入失敗，請重新登入',
          });
          this.$router.push('/login');
        }
      })
      .catch((err) => {
        console.log(err);
        this.$router.push('/login');
        this.$swal({
          title: `${err.response.data.message}`,
        });
      });
  },
};
</script>
