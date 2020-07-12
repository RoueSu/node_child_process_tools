import {child_process_tools} from "./index";

let cmd = new child_process_tools({type: 'console', cwd: './'})


cmd.spawn('dir')
cmd.spawn('mkdir test')
cmd.spawn('cd test')
// cmd.end()
cmd.on('command', (d) => {
    console.log(d);
});
