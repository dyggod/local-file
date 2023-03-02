<template>
  <a-row>
    <a-col>
      <h3>dg-file</h3>
    </a-col>
  </a-row>
  <a-row>
    <a-col :span="24">
      <a-list
        :data-source="fileList"
        item-layout="horizontal"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-button @click="download(item.url)">下载</a-button>
            </template>
            <a-list-item-meta
              :title="item.name"
              :description="item.size"
            >
              <template #avatar>
                <a-avatar />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
  </a-row>
</template>

<script>
import request from '../utils/request';
console.log('request: ', request);
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    async getFiles() {
      const data = await request('/file/list', 'get')
      console.log('data: ', data);
      this.fileList = data.data?.files;
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
      request('/file/download', 'download', {url}).then((res) => {
        const blob = new Blob([res.data], {type: 'application/octet-stream'});
        const fileName = res.headers['content-disposition'].split('=')[1];
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob); // 创建下载的链接
        downloadElement.href = href;
        downloadElement.download = fileName; // 下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); // 点击下载
        document.body.removeChild(downloadElement); // 下载完成移除元素
        window.URL.revokeObjectURL(href); // 释放掉blob对象
      })
    }
  },
  created() {
    this.getFiles();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
