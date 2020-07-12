'use strict';

import {spawn} from "child_process";
import {EventEmitter} from "events";
import * as os from 'os'
import * as iconv from 'iconv-lite'

export class child_process_tools extends EventEmitter {
    auto_console: any;
    config: any
    command: any

    constructor(config: { type: 'console' | 'html', cwd: './' }) {
        super();
        this.config = config
        this.auto_console = {}
        this.command = spawn(this.getSystemCode().shell, [], {cwd: this.config.cwd, shell: true})

        /**
         * 通过 *.on('command',(data)=>{}) 来获取返回数据
         */
        this.command.stdout.on('data', (data: any) => {
            this.emit('command', this.format(data))
        });
        this.command.stderr.on('data', (data: any) => {
            this.emit('command', this.format(data))
        });
        this.command.on('error', (data: any) => {
            this.emit('command', this.format(data))
        });
        this.command.on('close', (data: any) => {
            this.emit('command', {msg:'子进程退出！',code:data})
        });
        this.command.on('exit', (data: any) => {
            this.emit('command', {msg:'子进程退出！',code:data})
        });
    }

    getSystemCode  () {
        //cp936 || 'GBK';
        if (os.platform() === "win32") {
            this.auto_console.shell = "cmd.exe";
            this.auto_console.coding = 'cp936';
        } else {
            this.auto_console.shell = "/bin/sh";
            this.auto_console.coding = 'UTF-8';
        }
        return this.auto_console;
    };

    format(e: any) {
        e = this.iconvs(e)
        //根据配置来判断输出那种格式
        if (this.config.type === "html") {
            return e.replace(/<DIR>/g, '&lt;DIR&gt;').replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }
        return e
    }

    iconvs(e: any) {
        //解决不支持GBK
        return iconv.decode(e, this.getSystemCode().coding);
    };

    spawn(command: string) {
        this.command.stdin.write(command)
        this.command.stdin.write('\n')
    }
    end(){
        this.command.stdin.end();
    }
}
