import { exec } from 'child_process';
import axios from 'axios';

export async function runShellCommand(cmd: string) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      if (stderr) return reject(new Error(stderr));
      resolve(stdout);
    });
  });
}
export async function runPowerShellCommand(psCommand: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const wrappedCommand = `powershell.exe -NoProfile -NonInteractive -Command "${psCommand}"`;

    exec(wrappedCommand, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(stdout || stderr);
    });
  });
}

export function createAzureClient(baseUrl: string, workspace: string, token: string) {
  return axios.create({
    baseURL: `https://${baseUrl}/${workspace}`,
    headers: {
      Authorization: `Basic ${Buffer.from(`:${token}`).toString('base64')}`,
      Accept: 'application/json',
    },
  });
}
