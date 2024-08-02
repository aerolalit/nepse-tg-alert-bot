const upperFirst = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const quote = (text: string) => `"${text}"`;

export const pkName = (tableName: string, columns: string[]) => {
  return quote(`PK_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}`);
};

export const fkName = (tableName: string, columns: string[], targetTableName: string, targetColumns: string[]) => {
  return quote(
    `FK_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}_${upperFirst(targetTableName)}_${targetColumns
      .map(lowerFirst)
      .join('_')}`,
  );
};

export const uqName = (tableName: string, columns: string[]) => {
  return quote(`UQ_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}`);
};

export const idxName = (tableName: string, columns: string[]) => {
  return quote(`IDX_${upperFirst(tableName)}_${columns.map(lowerFirst).join('_')}`);
};

export const addPk = (tableName: string, columns: string[]) => {
  return `CONSTRAINT ${pkName(tableName, columns)} PRIMARY KEY (${columns.map(quote).join(', ')})`;
};

export const addFk = (tableName: string, columns: string[], targetTableName: string, targetColumns: string[]) => {
  return (
    `CONSTRAINT ${fkName(tableName, columns, targetTableName, targetColumns)} ` +
    `FOREIGN KEY (${columns.map(quote).join(', ')}) REFERENCES ${quote(upperFirst(targetTableName))} (${targetColumns
      .map(quote)
      .join(', ')})`
  );
};

export const createFk = (tableName: string, columns: string[], targetTableName: string, targetColumns: string[]) => {
  return `ALTER TABLE ${quote(tableName)} ADD ${addFk(tableName, columns, targetTableName, targetColumns)}`;
};

export const addUq = (tableName: string, columns: string[]) => {
  return `CONSTRAINT ${uqName(tableName, columns)} UNIQUE (${columns.map(quote).join(', ')})`;
};

export const dropUq = (tableName: string, columns: string[]) => {
  return `DROP CONSTRAINT ${uqName(tableName, columns)}`;
};

export const createIdx = (tableName: string, columns: string[]) => {
  return `CREATE INDEX ${idxName(tableName, columns)} ON ${quote(tableName)} (${columns.map(quote).join(', ')});`;
};

export const dropIdx = (tableName: string, columns: string[]) => {
  return `DROP INDEX ${idxName(tableName, columns)};`;
};

export const dropFk = (tableName: string, columns: string[], targetTableName: string, targetColumns: string[]) => {
  return `DROP CONSTRAINT ${fkName(tableName, columns, targetTableName, targetColumns)}`;
};

export const deleteFk = (tableName: string, columns: string[], targetTableName: string, targetColumns: string[]) => {
  return `ALTER TABLE ${quote(tableName)} ${dropFk(tableName, columns, targetTableName, targetColumns)};`;
};

export const createPartialIdx = (tableName: string, columns: string[], condition: string) => {
  return `CREATE INDEX ${idxName(tableName, columns)} ON ${quote(tableName)} (${columns
    .map(quote)
    .join(', ')}) WHERE ${condition};`;
};