import cron from 'cron'
import https from 'https'

const backend='https://khaizar-loginsecure.onrender.com/api'
const job=new cron.CronJob('*/14 * * * *',function(){
    console.log(`Restarting server`);

    https.get(backend,(res)=>{
        if(res.statusCode===200){
            console.log('Server restarted');
        }else{
            console.error(`failed to restart:${res.statusCode}`);
        }
    })
    .on('error',(err)=>{
        console.error('Error during restarting',err.message);
    })
})
export const jobs=job