// Promise exec
import { exec as execSync } from 'child_process';

export const exec = (command: string) => {
  return new Promise((resolve, reject) => {
    execSync(command, (error) => {
      if (error != null) reject(error);
      resolve();
    });
  });
}
