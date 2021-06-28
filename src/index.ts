import cluster from 'cluster';
import { cpus } from 'os';
import { appEnv } from './config';
import Server from './server';

const workers: any[] = [];

if (process.env.NODE_ENV !== "development" && cluster.isMaster) {
  const numCPUs = cpus().length;

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[i].on("message", (message: string) => {
      console.log(message);
    });
  }
  // process is clustered on a core and process id is assigned
  cluster.on(
    "online",
    (worker: any): void => {
      console.log(`Worker ${worker.process.pid} is listening`);
    }
  );

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `worker ${
        worker.process.pid
      } died with signal : ${signal} and code : ${code}`
    );
    // Starting a new worker
    cluster.fork();
    workers.push(cluster.fork());
    // to receive messages from worker process
    workers[workers.length - 1].on("message", (message: string) => {
      console.log(message);
    });
  });
} else {
  const PORT = Number(appEnv.config.port);
  const server = new Server(PORT);
  server.start();
}
