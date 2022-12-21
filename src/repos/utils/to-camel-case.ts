export const rowsParser = (rows: any[]) => {
  return rows?.map((row: any) => {
    const replaced: any = {};
    for (const key in row) {
      const camelcase = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace("_", "")
      );
      replaced[camelcase] = row[key];
    }
    return replaced;
  });
};
