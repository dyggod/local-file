import { createApp } from 'vue'
import { Button, Col, Row, Uploader, List, Cell, Toast } from 'vant';

import 'vant/lib/index.css';
import App from './App.vue'

const app = createApp(App)

app.use(Button).use(Col).use(Row).use(Uploader).use(List).use(Cell).use(Toast)

app.mount('#app')
