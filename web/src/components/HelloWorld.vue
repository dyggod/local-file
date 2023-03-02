<template>
  <van-row>
    <van-col span="24">
      <van-uploader :after-read="afterRead" :accept="acceptFileType">
        <van-button icon="plus" type="primary" :loading="uploadLoading">上传文件</van-button>
      </van-uploader>
    </van-col>
  </van-row>
  <van-row>
    <van-col span="24">
      <van-list>
        <van-cell v-for="(item, index) in fileList" :key="index">
          <div class="item">
            <div class="item-left">
              <span>{{ item.name }}</span>
              <span>{{ item.size }}</span>
            </div>
            <div>
              <span><van-button @click="download(item.url)" type="primary">下载</van-button></span>
              <span><van-button @click="deleteFile(item.url)" type="danger">删除</van-button></span>
            </div>
          </div>
        </van-cell>
      </van-list>
    </van-col>
  </van-row>
</template>

<script>
import { showToast } from 'vant';
import request from '../utils/request';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      fileList: [],
      uploadUrl: 'http://localhost:3000/file/upload',
      acceptFileType: 'image/*,video/*,audio/*,text/*,application/*',
      uploadLoading: false,
      downloadLoading: false,
      deleteLoading: false
    };
  },
  methods: {
    async getFiles() {
      const data = await request('/file/list', 'get');
      this.fileList = data.data?.files;
    },
    afterRead(file) {
      // 创建formData对象，将file填入，发送至后端
      const formData = new FormData();
      formData.append('file', file.file);
      this.uploadLoading = true;
      request('/file/upload', 'post', formData).then(() => {
        this.uploadLoading = false;
        this.getFiles();
      });
    },
    download(url) {
      // console.log('url: ', url);
      // // 创建a标签，用以下载
      // const a = document.createElement('a');
      // a.href = 'http://localhost:3000' + url;
      // a.download = 'download';
      // document.body.appendChild(a)
      // a.click();
      // // 释放a标签
      // a.remove();
      request('/file/download', 'download', { url }).then((res) => {
        const blob = new Blob([res.data], { type: 'application/octet-stream' });
        const fileName = res.headers['content-disposition'].split('=')[1];
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = decodeURIComponent(fileName); // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
        showToast('下载成功');
      });
    },
    deleteFile(url) {
      request('/file/delete', 'post', { url }).then(() => {
        showToast('删除成功');
        this.getFiles();
      });
    }
  },
  created() {
    this.getFiles();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {}

.item {
  display: flex;
  justify-content: space-between;
  background-color: aqua !important;
}

.item-left {
  display: flex;
  flex-direction: column;
  text-align: left;
}
</style>
