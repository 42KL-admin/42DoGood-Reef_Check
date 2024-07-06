class CreateSlateConfig implements SlateConfig.SlateConfig {
  rowNumberFrom: number;
  rowNumberTo: number;
  numberOfColumns: number;
  ignoredRows: number[];
  ignoredCols: number[];

  constructor(data?: SlateConfig.SlateConfig) {
    this.rowNumberFrom = data?.rowNumberFrom || 0;
    this.rowNumberTo = data?.rowNumberTo || 0;
    this.numberOfColumns = data?.numberOfColumns || 0;
    this.ignoredRows = data?.ignoredRows
      ? data?.ignoredRows
      : new Array<number>();
    this.ignoredCols = data?.ignoredCols
      ? data?.ignoredCols
      : new Array<number>();
  }
}

export { CreateSlateConfig };
