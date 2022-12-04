import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import requireTransform from 'vite-plugin-require-transform';

//按需引入样式
// import styleImport from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    
    requireTransform.default({
      fileRegex:/.ts$|.tsx$|.vue$|.png$|.jpg$|.jpeg$|.json$/
    }),
    ////按需引入antd样式配置
    // styleImport({
    //   libs: [
    //     {
    //       libraryName: 'antd',
    //       esModule: true,
    //       resolveStyle: (name) => {
    //         return `antd/es/${name}/style/index`;
    //       }
    //     }
    //   ],
    // })
  ],
  css:{
		//* css模块化
		 modules: { // css模块化 文件以.module.[css|less|scss]结尾
		     generateScopedName: '[name]__[local]___[hash:base64:5]',
		     hashPrefix: 'prefix',
	    },
	    //* 预编译支持less
	     preprocessorOptions: {
		      less: {
		        // 支持内联 JavaScript
		        javascriptEnabled: true,
		      },
	    },
	},
})
