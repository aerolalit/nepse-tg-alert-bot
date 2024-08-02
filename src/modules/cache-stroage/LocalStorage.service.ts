import * as fs from 'fs';
import * as path from 'path';

export class LocalStorageService {
  public storageFilePath: string = path.resolve('/Users/lalit/Git/nepse-alert-tg-bot', '.storage.json');

  public async set(key: string, value: string): Promise<void> {
    const sessionData = JSON.parse(fs.readFileSync(this.storageFilePath, 'utf8'));
    sessionData[key] = value;
    fs.writeFileSync(this.storageFilePath, JSON.stringify(sessionData));
  }

  public async get(key: string): Promise<string | null> {
    const sessionData = JSON.parse(fs.readFileSync(this.storageFilePath, 'utf8'));
    return sessionData[key];
  }
}
