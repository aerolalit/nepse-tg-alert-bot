import { AppDataSource } from "data-source";
import { Ticker } from "src/modules/stocks/entities/Ticker.entity";
import { Company } from "./company/Company.parser";
import * as companyList from './company/Company.list.json';


async function seed() {
  await AppDataSource.initialize();
  const tickerRepository = AppDataSource.getRepository(Ticker);


  const tickers = companyList.map((company:Company) => ({
    ticker: company.ticker,
    name: company.name,
    status: company.status,
    sector: company.sector,
    group: company.group,
    type: company.type,
  }));

  await tickerRepository.save(tickers);
  console.log('Ticker table seeded successfully.');

  await AppDataSource.destroy();
}

seed().catch(error => {
  console.error('Error seeding Ticker table:', error);
});