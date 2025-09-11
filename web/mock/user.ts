import Mock from 'mockjs';
import type {MockMethod} from "vite-plugin-mock";
import {TOKEN_KEY} from "../src/constants/user.ts";


export default [
    {
        url: "/api/test/getUserInfo",
        method: "get",
        response: () => {
            return {
                code: 200,
                data: {
                    name: 'admin',
                    avatar:
                        'https://lf1-xgcdn-tos.pstatp.com/obj/vcloud/vadmin/start.8e0e4855ee346a46ccff8ff3e24db27b.png',
                    email: 'wangliqun@email.com',
                    job: 'frontend',
                    jobName: '前端开发工程师',
                    organization: 'Frontend',
                    organizationName: '前端',
                    location: 'beijing',
                    locationName: '北京',
                    introduction: '王力群并非是一个真实存在的人。',
                    personalWebsite: 'https://www.arco.design',
                    verified: true,
                    phoneNumber: /177[*]{6}[0-9]{2}/,
                    accountId: /[a-z]{4}[-][0-9]{8}/,
                    registrationTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
                },
            };
        },
    }, {
        // 登录
        url: '/api/user/login',
        method: 'post',
        rawResponse: async (req, res) => {
            /* ---------- 1. 取 body（框架不同自行调整） ---------- */
            const body = await new Promise<Record<string, string>>((resolve) => {
                let buf = ''
                req.on('data', (chunk) => (buf += chunk))
                req.on('end', () => resolve(JSON.parse(buf || '{}')))
            })

            /* ---------- 2. 业务校验（就是原 response 函数里的代码） ---------- */
            const { username, password } = body
            let data: Record<string, unknown>
            if (!username) data = { code: 400, msg: '用户名不能为空' }
            else if (!password) data = { code: 400, msg: '密码不能为空' }
            else if (username === 'admin' && password === 'admin') data = { code: 200 }
            else data = { code: 400, msg: '账号或者密码错误' }

            /* ---------- 3. 写 header + 回包 ---------- */
            res.setHeader(TOKEN_KEY, '04c4820f-366c-43a1-b1ae-0f1098910e52')
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.statusCode = 200
            res.end(JSON.stringify(data))
        }
    }
] as MockMethod[]
