import readline from "readline";
import { spawn } from 'node:child_process';
import { programa1_sinais } from "./sinais/programa1.js";
import { programa2_sinais } from "./sinais/programa2.js";
import { produtor_pipes } from "./pipes/produtor.js";
import { consumidor_pipes } from "./pipes/consumidor.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(`PID: ${process.pid}\n`, "Coe monitor, quer executar qual parte do Projeto?");
console.log(
  "\n",
  "1 - Sinais. Programa1 pede um PID e signal para ser enviado\n",
  "2 - Sinais. Programa2 escuta sinais\n",
  "3 - Sinais. Programa1 se comunicando com Programa2\n",
  "4 - Pipes. Produtor gera potenciais primos, consumidor recebe e testa\n",

);
let menu = function () {
  rl.question("Qual vai? (1/2/3/4/5/6/7): ", function (fun) {
    switch (fun) {
      case "1":
        rl.question("Identificador do Processo destino: ",
          function (processID) {
            let loop = function (){
              rl.question("Sinal a ser enviado (SIGINT/SIGTERM/SIGPIPE): ", function (signal) {
                console.log(
                  `Programa 1 Rodando... destination_PID:${processID}, signal:${signal}...`
                );
                programa1_sinais(processID, signal, process.pid).then(()=>{loop()});
              });
            }
            loop();
          }
        )
        break;
      case "2":
        rl.question(
          "busy ou blocking wait? (block/busy): ",
          function (waitType) {
            console.log(
              `Programa 2 Rodando... wait_type:${waitType}...`
            );
            programa2_sinais(waitType);
          }
        );
        break;
      case "3":
        const program2 = spawn("node", ["./sinais/programa2.js", "blocking"]);
        program2.stdout.on("data", (data) => {
          console.log(`Programa2: ${data}`);
        });
        program2.on('exit', function () {
          console.log(`Programa2 terminado.`)
        });
        setTimeout(()=>
        {
          console.log(`Programa1: Enviando SIGINT para ${child.pid}`)
          programa1_sinais(child.pid, "SIGINT", process.pid).then(() => {
            console.log(`Programa1: Enviando SIGINT para ${child.pid}`)
            programa1_sinais(child.pid, "SIGINT", process.pid).then(() => {
              console.log(`Programa1: Enviando SIGPIPE para ${child.pid}`)
              programa1_sinais(child.pid, "SIGPIPE", process.pid);
            });
          });
        },1000)
        break;
      case "4":
        const child = spawn("node", ["./sinais/programa2.js", "blocking"]);
        produtor_pipes
        console.log(4)
        break;
      default:
        console.log("respeita as opções pf");
        menu();
    }
  });
};
menu();
