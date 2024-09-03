import * as path from 'path';
import * as fs from 'fs';

export type Company = {
  name: string;
  ticker: string;
  status: string;
  sector: string;
  group: string;
  type: string;
};

function readCSVFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

function parseData(data: string): Company[] {
  return data.trim().split('\n').map(line => {
    const [, name, symbol, status, sector, group, type] = line.split(',').map(item => item.trim());
    return {
      name: name,
      ticker: symbol, // Renamed from symbol to ticker
      status: status,
      sector: sector,
      group: group,
      type: type
    };
  });
}

function writeJSONFile(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

const csvFilePath = path.resolve(__dirname, 'Company.list.csv');
const jsonFilePath = path.resolve(__dirname, 'Company.list.json');
const csvData = readCSVFile(csvFilePath);
const companies = parseData(csvData);
writeJSONFile(jsonFilePath, companies);
console.log('Company data parsed and saved to JSON file');