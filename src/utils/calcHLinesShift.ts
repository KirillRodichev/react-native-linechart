export const calcHLinesShift = (
  chartHeight: number,
  hLinesOffset: number,
  hLinesNumber: number
) => {
  return (chartHeight - hLinesOffset * 2) / (hLinesNumber - 1);
};
